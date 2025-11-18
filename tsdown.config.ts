import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["packages/eslint/index.ts", "packages/eslint/react/index.ts"],
  dts: {
    sourcemap: true,
  },
  format: ["esm"],
  clean: true,
  minify: false,
  outputOptions: {
    legalComments: "inline",
  },
});
