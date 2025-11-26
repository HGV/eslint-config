import pluginA11y from "eslint-plugin-jsx-a11y";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import { getHGVPlugin } from "../plugins";

const hgvPlugin = getHGVPlugin("react");

const plugins = {
  [hgvPlugin.meta.namespace]: hgvPlugin,
};

/**
 * Recommended ESLint configuration for React projects.
 * This configuration uses the [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react),
 * [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
 * and [eslint-plugin-react-hooks](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks) plugins
 */
export const reactConfig = defineConfig([
  {
    plugins,
  },
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
