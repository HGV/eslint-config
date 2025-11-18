/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RuleTester } from "eslint";
import noReactDefaultImport from "./noReactDefaultImport.js";

const [name, rule] = noReactDefaultImport;

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2020 },
});

ruleTester.run(name, rule, {
  valid: [
    {
      code: 'import * as React from "react";',
    },
  ],
  invalid: [
    {
      code: 'import React from "react";',
      errors: 1,
    },
    {
      code: 'import React, { useState } from "react";',
      errors: 1,
    },
    {
      code: 'import * as React from "react";',
      errors: 1,
    },
  ],
});
