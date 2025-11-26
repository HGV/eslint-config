# HGV ESLint config

## Install

```sh
npm install --save-dev @hgv/eslint-config
```

## Usage

```ts
import { configs } from "@hgv/eslint-config";

export default defineConfig([configs.react]);
```

## HGV Rules

- 💼 Configurations in which the rule is enabled by default
- ✅ node/browser configuration
- ☑️ react configuration
  🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix)
- 💡 Manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions)

| Rule                                                          | 💼   | 🔧  | 💡  |
| ------------------------------------------------------------- | ---- | --- | --- |
| [@hgv/no-mixed-case-acronyms](docs/noMixedCaseAcronyms.md)    | ✅☑️ |     | 💡  |
| [@hgv/no-react-default-import](docs/noReactDefaultImport.md)  | ☑️   |     |     |
| [@hgv/use-correct-apostrophes](docs/useCorrectApostrophes.md) | ✅☑️ | 🔧  |     |

## Default Configurations

For The browser and node configurations, browser globals are used.
For Node, the `node` preset is used.

- JS/TS Node
  - [@eslint/js](https://github.com/eslint/eslint/tree/main/packages/js)
  - [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint)
  - [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn)

```js
export const nodeConfig = defineConfig([
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
      "unicorn/no-array-reduce": "off",
      "unicorn/no-await-expression-member": "off",
      "unicorn/no-nested-ternary": "off",
      "unicorn/no-null": "off",
      "unicorn/abbreviations": "off",
      "unicorn/no-negated-conditions": "off",
      "unicorn/prefer-at": "off",
      "unicorn/no-array-sort": "off",
      "unicorn/no-document-cookie": "off",
    },
  },

  // TS rules
  {
    rules: {
      "@typescript-eslint/no-namespace": "off",
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
      "@typescript-eslint/only-throw-error": ["error", { allow: ["Redirect"] }],
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
```

- React
  - [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
  - [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react)
  - [eslint-plugin-react-hooks](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks)

```ts
export const reactConfig = defineConfig([
  {
    rules: {
      "@hgv/use-correct-apostrophes": "error",
      "@hgv/no-mixed-case-acronyms": "error",
      "@hgv/no-react-default-import": "error",
    },
  },
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
      "react/hooks/refs": "off",
      "react-hooks/exhaustive-deps": "off",
    },
    settings: { react: { version: "detect" } },
  },
]);
```
