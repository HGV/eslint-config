import pluginJS from "@eslint/js";
import pluginUnicorn from "eslint-plugin-unicorn";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";
import { getHGVPlugin } from "./plugins";
import { reactConfig } from "./react";

const hgvPlugin = getHGVPlugin("ts");

/**
 * Recommended ESLint configuration for browser-based TypeScript projects.
 * This configuration uses the [@eslint/js](https://github.com/eslint/eslint/tree/main/packages/js),
 * [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) plugins and
 * [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn)
 */
const nodeConfig = (options: { addHGVPlugins?: boolean }) => {
  const plugins = options.addHGVPlugins
    ? {
        [hgvPlugin.meta.namespace]: hgvPlugin,
      }
    : {};

  return defineConfig([
    {
      plugins,
    },
    {
      rules: {
        "@hgv/use-correct-apostrophes": "error",
        "@hgv/no-mixed-case-acronyms": "error",
      },
    },
    pluginJS.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    pluginUnicorn.configs.recommended,
    {
      // JS rules
      rules: {
        "dot-notation": "off",
        "func-style": ["error", "expression"],
        "no-console": ["error", { allow: ["warn", "error"] }],
        "no-else-return": "error",
        "no-useless-computed-key": "error",
        "no-useless-rename": "error",
        "object-shorthand": "error",
        eqeqeq: "error",
        "prefer-template": "error",
      },
    },
    // Unicorn rules
    {
      rules: {
        "unicorn/explicit-length-check": "off",
        "unicorn/filename-case": [
          "error",
          { cases: { camelCase: true, pascalCase: true } },
        ],
        "unicorn/no-array-for-each": "off",
        "unicorn/prevent-abbreviations":"off",
        "unicorn/no-array-reduce": "off",
        "unicorn/no-await-expression-member": "off",
        "unicorn/no-nested-ternary": "off",
        "unicorn/no-null": "off",
        "unicorn/abbreviations": "off",
        "unicorn/no-negated-condition": "off",
        "unicorn/prefer-at": "off",
        "unicorn/no-array-sort": "off",
        "unicorn/no-document-cookie": "off",
      },
    },

    // TS rules
    {
      rules: {
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/dot-notation": "error",
        "@typescript-eslint/prefer-optional-chain": "error",
        "@typescript-eslint/naming-convention": [
          "error",
          { selector: ["default", "classicAccessor"], format: ["camelCase"] },
          {
            selector: ["import", "method"],
            format: ["camelCase", "PascalCase"],
          },
          {
            selector: ["variableLike"],
            format: ["camelCase", "PascalCase"],
            leadingUnderscore: "allowSingleOrDouble",
          },
          { selector: ["property"], format: null },
          { selector: ["memberLike", "typeLike"], format: ["PascalCase"] },
        ],
        "@typescript-eslint/no-confusing-void-expression": "off",
        "@typescript-eslint/prefer-destructuring": "error",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/restrict-plus-operands": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/prefer-nullish-coalescing": [
          "error",
          { ignoreConditionalTests: true, ignorePrimitives: { boolean: true } },
        ],
        "@typescript-eslint/unified-signatures": [
          "error",
          { ignoreDifferentlyNamedParameters: true },
        ],
        "@typescript-eslint/only-throw-error": [
          "error",
          { allow: ["Redirect"] },
        ],
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            args: "all",
            argsIgnorePattern: "^_",
            caughtErrors: "all",
            caughtErrorsIgnorePattern: "^_",
            destructuredArrayIgnorePattern: "^_",
            varsIgnorePattern: "^_",
          },
        ],
      },
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          projectService: true,
          tsconfigRootDir: process.cwd(),
        },
      },
    },
    {
      ignores: ["dist/**", "node_modules/**"],
    },
  ]);
};

export const browserConfig = (options: { addHGVPlugins?: boolean }) =>
  defineConfig([
    { languageOptions: { globals: globals.browser } },
    nodeConfig({ addHGVPlugins: options.addHGVPlugins ?? true }),
  ]);

const hgvReactConfig = defineConfig([
  browserConfig({ addHGVPlugins: false }),
  reactConfig,
]);
const hgvBrowserConfig = browserConfig({ addHGVPlugins: true });
const hgvNodeConfig = nodeConfig({ addHGVPlugins: true });

export const configs = {
  ts: {
    browser: hgvBrowserConfig,
    node: hgvNodeConfig,
  },
  react: hgvReactConfig,
};
