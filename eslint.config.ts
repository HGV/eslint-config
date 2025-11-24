import { defineConfig } from "eslint/config";
import { configs } from "./src/index";

export default defineConfig(configs.ts.node);
