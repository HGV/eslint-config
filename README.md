# HGV ESlint config

## Install

```sh
npm install --save-dev @hgv/shared-web-config
```

## Usage

```ts
import { browserConfig } from "@hgv/shared-eslint";
import { reactConfig } from "@hgv/shared-eslint/react";
import { defineConfig } from "eslint/config";

export default defineConfig([browserConfig, reactConfig]);
```

## Default Configurations

- JS/TS

```js
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
```

- React

```ts
/**
 * Recommended ESLint configuration for React projects.
 * This configuration uses the [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react)
 * and [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) plugins
 */
export const reactConfig = defineConfig([
  pluginReact.configs.flat["recommended"] ?? {},
  pluginReact.configs.flat["jsx-runtime"] ?? {},
  pluginA11y.flatConfigs.recommended,
  pluginReactHooks.configs.flat["recommended-latest"],
  {
    rules: {
      "react/button-has-type": "error",
      "react/destructuring-assignment": "error",
      "react/function-component-definition": [
        "error",
        { namedComponents: "arrow-function" },
      ],
      "react/jsx-boolean-value": "error",
      "react/jsx-curly-brace-presence": "error",
      "react/jsx-no-useless-fragment": "error",
      "react/no-unused-prop-types": "error",
      "react/self-closing-comp": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: `Identifier[name="React"]`,
          message:
            `Using the variable "React" is not allowed. ` +
            `Use named imports instead, e.g.: import { FunctionComponent } from "react".`,
        },
      ],
    },
    settings: { react: { version: "detect" } },
  },
]);
```
