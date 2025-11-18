import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    "*": "packages/eslint/index.ts",
    react: "packages/eslint/react/index.ts",
  },
  dts: {
    sourcemap: true,
  },
  format: ["esm"],
  clean: true,
  minify: true,
  outputOptions: {
    legalComments: "inline",
  },
});
