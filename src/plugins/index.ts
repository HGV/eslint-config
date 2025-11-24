import noMixedCaseAcronyms from "../rules/noMixedCaseAcronyms/noMixedCaseAcronyms";
import noReactDefaultImport from "../rules/noReactDefaultImport/noReactDefaultImport";
import useCorrectApostrophe from "../rules/useCorrectApostrophes/useCorrectApostrophe";

import { definePlugin, type ESLintRule } from "../utils/rules";

export const getHGVPlugin = (type: "ts" | "react") => {
  let rules: Record<string, ESLintRule> = {
    [noMixedCaseAcronyms.name]: noMixedCaseAcronyms.rule,
    [useCorrectApostrophe.name]: useCorrectApostrophe.rule,
  };
  if (type === "react") {
    rules = {
      ...rules,
      [noReactDefaultImport.name]: noReactDefaultImport.rule,
    };
  }

  return definePlugin("@hgv", rules);
};
