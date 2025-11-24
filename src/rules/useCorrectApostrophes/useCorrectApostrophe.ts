import { Rule } from "eslint";
import { defineRule } from "../../utils/rules";

const checkForApostrophes = (
  context: Rule.RuleContext,
  text: string,
  /**
   * Get the starting point of the node in the source file (this should include the quotations which is default behavior for node.range)
   */
  getRangeStart: () => number
) => {
  const matches = text.matchAll(/([a-zA-Z0-9])'([a-zA-Z0-9])/gi);
  for (const match of matches) {
    const startIndex = match.index * 1;
    const absStart = getRangeStart() + startIndex + 2;
    const absEnd = absStart + 1;

    const source = context.sourceCode;
    const startLocation = source.getLocFromIndex(absStart);
    const endLocation = source.getLocFromIndex(absEnd);

    context.report({
      message: `Use the typographically correct apostrophe: ’ instead of '`,
      loc: {
        start: startLocation,
        end: endLocation,
      },
      fix: (fixer) => {
        return fixer.replaceTextRange([absStart, absEnd], "’");
      },
    });
  }
};

export default defineRule("use-correct-apostrophes", {
  meta: { fixable: "code" },
  create(context) {
    return {
      Literal(node) {
        const text = node.value;
        if (typeof text === "string") {
          checkForApostrophes(context, text, () => node.range?.[0] ?? 0);
        }
      },
      TemplateElement(node) {
        const text = node.value.cooked;

        if (text) {
          checkForApostrophes(context, text, () => node.range?.[0] ?? 0);
        }
      },
    };
  },
});
