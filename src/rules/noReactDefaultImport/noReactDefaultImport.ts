import { defineRule } from "../../utils/rules";

export default defineRule("no-react-default-import", {
  meta: {},
  create(context) {
    return {
      ImportDeclaration(node) {
        for (const specifier of node.specifiers) {
          if (
            (specifier.type === "ImportDefaultSpecifier" ||
              specifier.type === "ImportNamespaceSpecifier") &&
            node.source.value === "react"
          ) {
            context.report({
              node: specifier,
              message:
                `Using the variable "React" is not allowed. ` +
                `Use named imports instead, e.g.: import { useState } from "react".`,
            });
          }
        }
      },
    };
  },
});
