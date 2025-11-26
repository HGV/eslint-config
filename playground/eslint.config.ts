import { configs } from "@hgv/eslint-config";

import { defineConfig } from "eslint/config";

export default defineConfig([
  configs.react,
  {
    ignores: ["/dist", "/node_modules"],
  },
]);
