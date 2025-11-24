import { RuleTester } from "eslint";
import noMixedCaseAcronyms from "./useCorrectApostrophe";

const { name, rule } = noMixedCaseAcronyms;

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2020 },
});

ruleTester.run(name, rule, {
  valid: [
    {
      code: "const message = 'It’s a nice day.'; // using correct apostrophes",
    },
  ],
  invalid: [
    {
      code: "const message = `It’s a nice day.`; // using incorrect apostrophes",
      errors: [
        {
          message: "Use the typographically correct apostrophe: ’ instead of '",
          line: 1,
          column: 20,
        },
      ],

      output:
        // eslint-disable-next-line @hgv/use-correct-apostrophes
        "const message = `It's a nice day.`; // using incorrect apostrophes",
    },
  ],
});
