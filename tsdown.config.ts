import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["packages/eslint/index.ts", "packages/eslint/react/index.ts"],
  dts: true,
  format: ["esm"],
  clean: true,
  outputOptions: {
    legalComments: "inline",
  },
});
