import pluginJS from "@eslint/js";
import pluginUnicorn from "eslint-plugin-unicorn";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

type TSESLintConfig = {
  /**
   * Disable rules because they conflict with CSS Modules.
   * @default false
   */
  disable_no_unsafe?: boolean;
};

// A list of acronyms/initialisms which should always be all-caps (e.g., "HTML")
// or all-lowercase (e.g., "html"), never mixed case (e.g., "Html").
const acronyms = ["CSS", "HTML", "JSON", "SVG", "URL", "XML"];

/**
 * Recommended ESLint configuration for browser-based TypeScript projects.
 * This configuration uses the [@eslint/js](https://www.npmjs.com/package/@eslint/js)
 * and [typescript-eslint](https://typescript-eslint.io/) plugins.
 */
export const nodeConfig = defineConfig([
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
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/[a-z]'[a-z]/i]",
          message: "Use the typographically correct apostrophe: ’ instead of '",
        },
      ],
    },
  },
  {
    rules: {
      "unicorn/explicit-length-check": "off",
      "unicorn/filename-case": [
        "error",
        { cases: { camelCase: true, pascalCase: true } },
      ],
      "unicorn/no-array-for-each": "off",
      "unicorn/no-array-reduce": "off",
      "unicorn/no-await-expression-member": "off",
      "unicorn/no-nested-ternary": "off",
      "unicorn/no-null": "off",
      "unicorn/prefer-at": "off",
      "unicorn/prevent-abbreviations": [
        "error",
        {
          extendDefaultReplacements: false,
          replacements: Object.fromEntries(
            acronyms.map((a) => [a.toLowerCase(), { [a]: true }])
          ),
          ignore: acronyms.map((a) => a.toLowerCase()),
        },
      ],
      "unicorn/no-array-sort": "off",
      "unicorn/no-document-cookie": "off",
    },
  },

  // TS rules
  {
    rules: {
      "@typescript-eslint/dot-notation": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: ["default", "classicAccessor"], format: ["camelCase"] },
        { selector: ["import", "method"], format: ["camelCase", "PascalCase"] },
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
    rules: {
      "@typescript-eslint/only-throw-error": ["error", { allow: ["Redirect"] }],
    },
  },
  {
    ignores: ["dist/**", "node_modules/**"],
  },
]);

export const browserConfig = defineConfig([
  { languageOptions: { globals: globals.browser } },
  nodeConfig,
]);
