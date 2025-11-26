import type { Rule } from "eslint";
import { version } from "../../package.json";

type IsTuple<T extends readonly unknown[]> = number extends T["length"]
  ? false
  : true;
type Prepend<Head, Tail> = Tail extends unknown[]
  ? true extends IsTuple<Tail>
    ? [Head, ...Tail]
    : [Head, Tail]
  : [Head, Tail];

export type Severity = "off" | "warn" | "error" | 0 | 1 | 2;
export type RuleOptions<T> = Prepend<Severity, T>;

export type ESLintRule = Rule.RuleModule;

// Options is a transporter
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface EsLintCompleteRule<Options, Name extends string> {
  name: Name;
  rule: ESLintRule;
}

interface ESLintPluginMeta<Namespace extends string> {
  name: `eslint-plugin-${Namespace}`;
  version: string;
  namespace: Namespace;
}

interface ESLintPlugin<
  Namespace extends string,
  Rules extends Record<string, ESLintRule>
> {
  meta: ESLintPluginMeta<Namespace>;
  rules: Rules;
}

export const defineRule = <Options, Name extends string>(
  name: Name,
  rule: ESLintRule
): EsLintCompleteRule<Options, Name> => {
  return {
    name,
    rule,
  };
};

export type ESLintPluginRules<
  Rules extends Record<string, ESLintRule>,
  Prefix extends string = never
> = Prefix extends never
  ? Rules
  : {
      [K in keyof Rules as `${Prefix}/${Extract<K, string>}`]: Rules[K];
    };

/**
 *
 * @param namespace name of the plugin, becomes `eslint-plugin-<name>` and the rules will become accessible as `<name>/rule-name`
 * @param rules rules the plugin should load
 * @param prefix optional prefix for all rules of the plugin, e.g. `@hgv` makes rules become `@hgv/rule-name`
 * @returns
 */
export const definePlugin = <
  Namespace extends string,
  Rules extends Record<string, ESLintRule>
>(
  namespace: Namespace,
  rules: Rules
): ESLintPlugin<Namespace, Rules> => {
  return {
    meta: {
      name: `eslint-plugin-${namespace}`,
      version,
      namespace,
    },
    rules,
  };
};
