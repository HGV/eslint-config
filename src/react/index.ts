import pluginA11y from "eslint-plugin-jsx-a11y";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

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
