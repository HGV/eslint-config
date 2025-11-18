import pluginJS from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * Recommended ESLint configuration for browser-based TypeScript projects.
 * This configuration uses the [@eslint/js](https://www.npmjs.com/package/@eslint/js)
 * and [typescript-eslint](https://typescript-eslint.io/) plugins.
 *
 * Additionally it provides the globals.browser set of global variables.
 */
export const browserConfig = defineConfig([
  { languageOptions: { globals: globals.browser } },
  pluginJS.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    // JS rules
    rules: {
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
  // TS rules
  {
    rules: {
      // These no-unsafe-* rules are disabled because they conflict with CSS Modules.
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-argument": "off",

      "@typescript-eslint/dot-notation": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/restrict-plus-operands": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/prefer-nullish-coalescing": [
        "error",
        { ignoreConditionalTests: true },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: ["default"], format: ["camelCase"] },
        { selector: ["import", "method"], format: ["camelCase", "PascalCase"] },
        {
          selector: ["variableLike"],
          format: ["camelCase", "PascalCase"],
          leadingUnderscore: "allowSingleOrDouble",
        },
        { selector: ["property"], format: null },
        { selector: ["memberLike", "typeLike"], format: ["PascalCase"] },
      ],
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-namespace": "off",
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
    ignores: ["**/dist/**", "**/node_modules/**"],
  },
]);
