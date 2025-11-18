import type { Rule } from "eslint";

type ESLintRule = [string, Rule.RuleModule];

type ESLintPluginMeta = {};

type ESLintPlugin = {
  meta: ESLintPluginMeta;
  rules: Array<Record<string, ESLintRule> | ESLintRule>;
};

export function defineRule(name: string, rule: Rule.RuleModule): ESLintRule {
  return [name, rule];
}

export function definePlugin(plugin: ESLintPlugin): ESLintPlugin {
  return plugin;
}
