# Keep acronyms consistent across the codebase

💼 This rule is enabled in the following configs: ✅ node/browser, ☑️ react\
💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions)

## Examples

```ts
// ❌
const mySvgVariable;
const someOthersvgVariable;

// ✅
const mySVGVariable;
const someOtherSVGVariable;
```

## Options

Type: `object`

- ### acronyms

  Type: `Array<string | MixedCaseAcronymOptions>`\
  Default: `["CSS", "HTML", "JSON", "SVG", "URL", "XML", "HTTP"]`\
  Example:

  ```ts
  [
    "CSS",
    {
      value: "ESLint",
      option: "upper",
      ignoreStart: false,
    },
  ];
  ```

  Define the acronyms that are checked in the codebase
  If a string is provided, the global presets are used, otherwise they can be overwritten per value

- ### ignoreFromPackageDependencies

  Type: `object`\
  Default: `{}`\
  Example:

  - ### dependencies

    Type: `boolean`\
    Default: `true`

    Ignores the dependencies from the `package.json` file

  - ### devDependencies

    Type: `boolean`\
    Default: `true`

    Ignores the devDependencies from the `package.json` file

  - ### peerDependencies

    Type: `boolean`\
    Default: `true`

    Ignores the peerDependencies from the `package.json` file

- ### ignoreFromSources

  Type: `string[]`\
  Default: `[]`\
  Example:

  ```ts
  ["src/my-file.ts"];
  ```

  Ignores the acronyms imported from the provided files

- ### ignoreGlobals

  Type: `object`\
  Default: `globals.browser`\
  Example:

  ```ts
  {
    browser: true,
    node: true,
  };
  ```

  Ignores the acronyms from the provided global variables

- ### disableOnFiles

  Type: `string[]`\
  Default: `["**/*.config.ts"]`\

  Disable the rule on files that match the provided glob patterns

- ### checks

  Type: `object`\
  Default: `{ checkCallExpressions: true, checkImports: true, checkVariableDeclarations: true, checkMemberExpressions: true, checkObjectExpressions: true }`

  Configure which checks should be performed

- ### checkStrings

  Type: `boolean`\
  Default: `false`\

  If set to `true`, the acronyms are also checked in strings

- ### option

  Type: `"upper" | "lower" | "pascal" | "match-casing"`\
  Default: `"match-casing"`\

  The option to use when checking the acronyms

  - `"upper"`: Checks if the acronym is in uppercase
  - `"lower"`: Checks if the acronym is in lowercase
  - `"pascal"`: Checks if the acronym is in pascal case
  - `"match-casing"`: Checks if the acronym is in the same casing as the acronym definition

## Additional Type Definitions

- ### MixedCaseAcronymOptions

  ```ts
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
  ```

- ### AcronymCorrectOption

  ```ts
  type AcronymCorrectOption = "pascal" | "upper" | "lower" | "match-casing";
  ```
