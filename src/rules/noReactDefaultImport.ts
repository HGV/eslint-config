import { defineRule } from "@/util/rules";

export default defineRule("no-react-default-import", {
  meta: {
    messages: {
      avoidDefaultImport:
        `Using the variable "React" is not allowed. ` +
        `Use named imports instead, e.g.: import { FunctionComponent } from "react".`,
    },
  },
  create(context) {
    console.log(context);

    return {
      ImportDefaultSpecifier(node) {
        // TODO check if it is React, report
      },
      ImportNamespaceSpecifier(node) {
        //TODO check if it is React, report
      },
    };
  },
});
