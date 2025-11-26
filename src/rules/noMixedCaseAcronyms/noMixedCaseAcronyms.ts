import { Rule } from "eslint";
import type * as ESTree from "estree";
import globals from "globals";
import nodePath from "node:path";
import { getPackageJSON } from "../../utils/package";
import { defineRule } from "../../utils/rules";
import { and, createCheckers, not, or } from "./conditions";
type AcronymCorrectOption = "pascal" | "upper" | "lower" | "match-casing";

/**
 * Per Acronym config
 */
interface MixedCaseAcronymOptions {
  value: string;
  /**
   * Casing to substitute the matched string with
   * @default "match-casing"
   */
  option?: AcronymCorrectOption;
  /**
   * Ignore the match if it matches at the 1. character of the String
   * @default false
   */
  ignoreStart?: boolean;
}

interface Checks {
  checkImports: boolean;
  checkMemberExpressions: boolean;
  checkVariableDeclarations: boolean;
  checkObjectExpressions: boolean;
  checkCallExpressions: boolean;
}

/**
 * Tells ESLint to ignore
 */
interface IgnoreFromPackageJSON {
  dependencies: boolean;
  devDependencies: boolean;
  peerDependencies: boolean;
}

type Options = Omit<MixedCaseAcronymOptions, "value"> & {
  /**
   * Acronyms to check, can either be an object or a string
   * If the string is provided, global presets are used, otherwise they can be overwritten per value
   * @default  ["CSS", "HTML", "JSON", "SVG", "URL", "XML", "HTTP"]
   */
  acronyms?: (MixedCaseAcronymOptions | string)[];
  /**
   * Configuration to tell the rule what packages to ignore since they are external code
   * @default ```ts
   * {
   *  dependencies: true,
   *  devDependencies: true,
   *  peerDependencies: true
   * }
   * ```
   */
  ignoreFromPackageDependencies?: Partial<IgnoreFromPackageJSON>;
  disableOnFiles?: string[];
  checks: Checks;
  /**
   * Additional sources to ignore. If a string matches, the acronym rule will ignore variables imported from there
   * @default []
   */
  ignoreFromSources?: string[];
  /**
   * This is used to define Identifiers that are an exception because they are defined by the Runtime
   * @default globals.browser
   */
  ignoreGlobals?: Record<string, boolean>;
  checkStrings: boolean;
};

export const defaultOptions: Required<Options> = {
  acronyms: ["CSS", "HTML", "JSON", "SVG", "URL", "XML", "HTTP"],
  ignoreFromPackageDependencies: {
    dependencies: true,
    devDependencies: true,
    peerDependencies: true,
  },
  disableOnFiles: ["**/*.config.ts"],
  checks: {
    checkCallExpressions: true,
    checkImports: true,
    checkVariableDeclarations: true,
    checkMemberExpressions: true,
    checkObjectExpressions: true,
  },
  ignoreFromSources: [],
  ignoreStart: true,
  option: "match-casing",
  ignoreGlobals: globals.browser,
  checkStrings: false,
};

const escapeRegExp = (s: string) => {
  return s.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
};

const getIncorrectlyCasedAcronyms = (
  word: string,
  acronyms: Required<MixedCaseAcronymOptions>[]
) => {
  return [
    ...acronyms.reduce((errors, acronym) => {
      const regexp = new RegExp(escapeRegExp(acronym.value), "gi");
      const matches = word.matchAll(regexp);
      for (const match of matches) {
        if (
          match[0] !== correctAcronym(acronym.value, acronym.option) &&
          !(match.index === 0 && acronym.ignoreStart)
        ) {
          errors.add(acronym.value);
        }
      }
      return errors;
    }, new Set<string>()),
  ];
};

const correctWord = (
  word: string,
  acronyms: Required<MixedCaseAcronymOptions>[]
) => {
  for (const acronym of acronyms) {
    const regexp = new RegExp(escapeRegExp(acronym.value), "gi");
    word = word.replace(regexp, (match, index) => {
      if (index !== 0 || !acronym.ignoreStart) {
        return correctAcronym(acronym.value, acronym.option);
      }
      return match;
    });
  }

  return word;
};

const correctAcronym = (acronym: string, option: AcronymCorrectOption) => {
  switch (option) {
    case "lower": {
      return acronym.toLocaleLowerCase();
    }
    case "upper": {
      return acronym.toLocaleUpperCase();
    }
    case "pascal": {
      return acronym.charAt(0).toUpperCase() + acronym.slice(1).toLowerCase();
    }
    case "match-casing": {
      return acronym;
    }
  }
};

type IdNode = ESTree.Identifier & Rule.NodeParentExtension;

type ImportSource =
  | {
      imported: true;
      ignored: true;
    }
  | {
      imported: true;
      ignored: false;
      source: string;
    }
  | {
      imported: false;
    };

const getImportSource = (
  context: Rule.RuleContext,
  node: IdNode
): ImportSource => {
  const packageJSON = getPackageJSON();
  const options = context.options[0] as Options;
  const { sourceCode } = context;
  const scope = sourceCode.getScope(node);
  const variable = scope.set.get(node.name);
  const ignoreSet = new Set<string>(options.ignoreFromSources);

  if (packageJSON) {
    for (const [key, shouldIgnore] of Object.entries(
      options.ignoreFromPackageDependencies ?? {}
    )) {
      if (shouldIgnore) {
        Object.keys(packageJSON[key] || {}).forEach((v) => ignoreSet.add(v));
      }
    }
  }

  const importDefinition = variable?.defs.find(
    (definition) => definition.type === "ImportBinding"
  );

  if (!importDefinition?.parent.source.value) {
    return { imported: false };
  }

  const sourceValue = importDefinition.parent.source.value.toString();

  if (ignoreSet.has(sourceValue)) {
    return {
      ignored: true,
      imported: true,
    };
  }

  return {
    ignored: false,
    imported: true,
    source: sourceValue,
  };
};

const checkCallExpression = (
  context: Rule.RuleContext,
  node: ESTree.CallExpression
): boolean => {
  if (!(context.options[0] as Options).checks.checkCallExpressions) {
    return false;
  }

  switch (node.callee.type) {
    case "Identifier": {
      const { sourceCode } = context;
      const source = getImportSource(context, node.callee as IdNode);
      return (
        !sourceCode.isGlobalReference(node.callee) &&
        (!source.imported || !source.ignored)
      );
    }
    case "CallExpression": {
      return checkCallExpression(context, node.callee);
    }
    case "MemberExpression": {
      return checkMemberExpression(context, node.callee);
    }
  }

  return true;
};

const checkMemberExpression = (
  context: Rule.RuleContext,
  node: ESTree.MemberExpression
): boolean => {
  if (!(context.options[0] as Options).checks.checkMemberExpressions) {
    return false;
  }

  switch (node.object.type) {
    case "Identifier": {
      const { sourceCode } = context;
      const source = getImportSource(context, node.object as IdNode);
      return (
        !sourceCode.isGlobalReference(node.object) &&
        source.imported &&
        source.ignored
      );
    }
    case "MemberExpression": {
      return checkMemberExpression(context, node.object);
    }
    case "CallExpression": {
      return checkCallExpression(context, node.object);
    }
  }
  return true;
};

const conditions = createCheckers<[Rule.RuleContext, IdNode]>()({
  // This is always checked since it does put no restriction on namings
  isArrayPatternDefinition: ([_, node]) => node.parent.type === "ArrayPattern",
  isCheckedImportedNode: ([context, node]) => {
    const importSource = getImportSource(context, node);
    return !(importSource.imported && importSource.ignored);
  },
  isCheckedMemberExpression([context, node]) {
    if (node.parent.type !== "MemberExpression") {
      return true;
    }
    return checkMemberExpression(context, node.parent);
  },
  isObjectExpression: ([_, node]) => {
    return (
      node.parent.type === "Property" &&
      node.parent.parent.type === "ObjectExpression" &&
      node.parent.key === node
    );
  },
  isCheckedImportSpecifier: ([context, node]) => {
    if (node.parent.type === "ImportSpecifier") {
      const importSource = getImportSource(
        context,
        node.parent.local as IdNode
      );
      return importSource.imported && !importSource.ignored;
    }
    return false;
  },
  isDefaultImport: ([_, node]) => {
    return node.parent.type === "ImportDefaultSpecifier";
  },
  isNamespaceImport: ([_, node]) => {
    return node.parent.type === "ImportNamespaceSpecifier";
  },
  isLeftSideVariableDefinition: ([_, node]) => {
    let currentNode: Rule.NodeParentExtension & ESTree.Node = node;
    while (
      currentNode.parent.type !== "Program" &&
      currentNode.parent.type !== "BlockStatement"
    ) {
      if (
        currentNode.parent.type === "VariableDeclarator" &&
        currentNode.parent.id === currentNode
      ) {
        return true;
      }

      currentNode = currentNode.parent;
    }

    return false;
  },
  isObjectPattern: ([_, node]) => {
    return (
      node.parent.type === "Property" &&
      node.parent.parent.type === "ObjectPattern"
    );
  },
});

const mergeOptions = (
  acronyms: (MixedCaseAcronymOptions | string)[] | undefined,
  globalConfig: Required<Omit<MixedCaseAcronymOptions, "value">>
): Required<MixedCaseAcronymOptions>[] => {
  if (!acronyms) return [];
  return acronyms.map((acronym) => {
    if (typeof acronym === "string") {
      return {
        value: acronym,
        ignoreStart: globalConfig.ignoreStart,
        option: globalConfig.option,
      } satisfies MixedCaseAcronymOptions;
    }
    return {
      ignoreStart: globalConfig.ignoreStart,
      option: globalConfig.option,
      ...acronym,
    } satisfies MixedCaseAcronymOptions;
  });
};

const checkWord = (
  context: Rule.RuleContext,
  node: ESTree.Node,
  word: string,
  acronymOptions: Required<MixedCaseAcronymOptions>[]
) => {
  const errors = getIncorrectlyCasedAcronyms(word, acronymOptions);
  if (errors.length > 0) {
    const correctedWord = correctWord(word, acronymOptions);

    report(
      context,
      `Found incorrectly cased acronyms in ${node.type}: ${errors}`,
      node,
      correctedWord
    );
  }
};

const report = (
  context: Rule.RuleContext,
  message: string,
  node: ESTree.Node,
  correctedWord: string
) => {
  context.report({
    message,
    node,
    suggest: [
      {
        desc: `Correct with ${correctedWord}`,
        fix: (fixer) => {
          if (node.type === "Identifier") {
            const { sourceCode } = context;
            const scope = sourceCode.getScope(node);
            const variable =
              scope.set.get(node.name) ??
              scope.references.find((r) => r.identifier === node)?.resolved;

            if (!variable) {
              return fixer.replaceText(node, correctedWord);
            }

            const { identifiers, references } = variable;
            const toReplace = [
              ...identifiers,
              ...references.map((r) => r.identifier),
            ];

            const uniqueRanges = new Set<string>();
            const fixes = [];

            for (const replace of toReplace) {
              const rangeKey = `${replace.range![0]}-${replace.range![1]}`;
              if (uniqueRanges.has(rangeKey)) {
                continue;
              }
              uniqueRanges.add(rangeKey);
              fixes.push(fixer.replaceText(replace, correctedWord));
            }

            return fixes;
          }
          return fixer.replaceText(node, correctedWord);
        },
      },
    ],
  });
};

export default defineRule<Options, "no-mixed-case-acronyms">(
  "no-mixed-case-acronyms",
  {
    meta: {
      hasSuggestions: true,
      type: "suggestion",
      schema: [
        {
          type: "object",
          properties: {
            option: {
              enum: ["upper", "lower", "pascal", "match-casing"],
              default: defaultOptions.option,
            },
            ignoreStart: {
              type: "boolean",
              default: defaultOptions.ignoreStart,
            },
            disableOnFiles: {
              type: "array",
              items: { type: "string" },
              default: defaultOptions.disableOnFiles,
            },
            acronyms: {
              type: "array",
              items: {
                anyOf: [
                  { type: "string" },
                  {
                    type: "object",
                    properties: {
                      value: { type: "string" },
                      option: {
                        enum: ["upper", "lower", "pascal", "match-casing"],
                      },
                      ignoreStart: { type: "boolean" },
                    },
                    required: ["value"],
                    additionalProperties: false,
                  },
                ],
              },
              default: defaultOptions.acronyms,
            },
            ignoreFromPackageDependencies: {
              type: "object",
              properties: {
                dependencies: { type: "boolean" },
                devDependencies: { type: "boolean" },
                peerDependencies: { type: "boolean" },
              },
              additionalProperties: false,
              default: defaultOptions.ignoreFromPackageDependencies,
            },
            ignoreFromSources: {
              type: "array",
              items: { type: "string" },
            },
            ignoreGlobals: {
              type: "object",
              additionalProperties: { type: "boolean" },
            },
            checkStrings: {
              type: "boolean",
              default: defaultOptions.checkStrings,
            },
          },
        },
      ],
      defaultOptions: [defaultOptions],
    },
    create(context) {
      const options = context.options[0] as Options;
      const { filename } = context;

      if (
        options.disableOnFiles?.some((pattern) =>
          nodePath.matchesGlob(filename, pattern)
        )
      ) {
        console.warn("ignored", filename, "matched glob");
        return {};
      }

      const acronymOptions = mergeOptions(options.acronyms, {
        ignoreStart: options.ignoreStart || defaultOptions.ignoreStart,
        option: options.option ?? defaultOptions.option,
      });

      const visitedNodes: {
        line?: number | undefined;
        col?: number | undefined;
        endLine?: number | undefined;
        endCol?: number | undefined;
        type: string;
      }[] = [];

      return {
        Identifier(node) {
          if (
            visitedNodes.some(
              (cached) =>
                node.loc?.start.column === cached.col &&
                node.loc?.start.line === cached.line &&
                node.loc?.end.column === cached.endCol &&
                node.loc?.end.line === cached.endLine &&
                node.type === cached.type
            )
          ) {
            return;
          }

          switch (true) {
            case options.checks.checkVariableDeclarations &&
              and(
                conditions.isLeftSideVariableDefinition,
                not(conditions.isObjectPattern)
              )([context, node]):
            case options.checks.checkImports &&
              or(
                conditions.isDefaultImport,
                conditions.isNamespaceImport,
                conditions.isCheckedImportSpecifier
              )([context, node]):
            case conditions.isArrayPatternDefinition([context, node]):
            case options.checks.checkObjectExpressions &&
              conditions.isObjectExpression([context, node]): {
              const incorrectlyNamedAcronyms = getIncorrectlyCasedAcronyms(
                node.name,
                acronymOptions
              );

              if (incorrectlyNamedAcronyms.length > 0) {
                const correctedWord = correctWord(node.name, acronymOptions);
                report(
                  context,
                  `Found incorrectly cased acronyms: ${incorrectlyNamedAcronyms}`,
                  node,
                  correctedWord
                );
              }
            }
          }

          visitedNodes.push({
            col: node.loc?.start.column,
            line: node.loc?.start.line,
            endCol: node.loc?.end.column,
            endLine: node.loc?.end.line,
            type: node.type,
          });
        },
        Literal(node) {
          if (node.parent.type === "ImportDeclaration") {
            return;
          }

          if (node.parent.type === "MemberExpression") {
            const checkKey = checkMemberExpression(context, node.parent);
            if (checkKey && typeof node.value === "string") {
              const word = node.value;
              checkWord(context, node, word, acronymOptions);
            }
          }
          if (!options.checkStrings) return;

          const word = node.value;
          if (typeof word === "string") {
            checkWord(context, node, word, acronymOptions);
          }
        },
        TemplateLiteral(node) {
          if (node.parent.type === "MemberExpression") {
            const checkKey = checkMemberExpression(context, node.parent);
            if (checkKey) {
              for (const element of node.quasis) {
                const word = element.value.cooked ?? element.value.raw;
                checkWord(context, element, word, acronymOptions);
              }
            }
          }
          if (!options.checkStrings) return;
          for (const element of node.quasis) {
            const word = element.value.cooked ?? element.value.raw;

            if (typeof word === "string") {
              checkWord(context, node, word, acronymOptions);
            }
          }
        },
      };
    },
  }
);
