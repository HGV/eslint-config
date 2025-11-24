import { RuleTester } from "eslint";
import noReactDefaultImport from "./noReactDefaultImport.js";

const { name, rule } = noReactDefaultImport;

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2020 },
});

ruleTester.run(name, rule, {
  valid: [
    {
      code: 'import {useState} from "react";',
    },
  ],
  invalid: [
    {
      code: 'import React from "react";',
      name: "default",
      errors: 1,
    },
    {
      code: 'import React, { useState } from "react";',
      name: "default and named",
      errors: 1,
    },
    {
      code: 'import * as React from "react";',
      name: "Import * as",
      errors: 1,
    },
  ],
});
