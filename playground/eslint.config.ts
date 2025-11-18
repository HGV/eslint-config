import { browserConfig } from "@hgv/shared-eslint";
import { reactConfig } from "@hgv/shared-eslint/react";

import { defineConfig } from "eslint/config";

export default defineConfig([
  browserConfig,
  reactConfig,
  {
    extends: ["@hgv/shared-eslint/react"],
    ignores: ["/dist"],
  },
]);
