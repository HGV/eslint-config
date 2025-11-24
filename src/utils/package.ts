import fs from "node:fs";
import path from "node:path";
import { PackageJSON } from "./package.types";

interface FindPackageJSONOptions {
  /**
   * @default ["node_modules"]
   */
  ignores?: string[];
  /**
   * @default process.cwd()
   */
  startPath?: string;
  /**
   * Ignore the cached package.json and fetches it again
   */
  refresh?: boolean | undefined;
}

/**
 * Find the closest package.json file to the selected path, walks the path tree upwards
 * For performance reasons since it is a linear process
 * @param ignores paths to ignore, does not support any special notations, just checks for equality on path parts
 * @param startPath If not provided, process.cwd() is used
 */
export const findClosestPackageJSON = (options?: FindPackageJSONOptions) => {
  const fsRoot = path.parse(path.resolve("")).root;
  const startPath = options?.startPath ?? process.cwd();
  const ignores = options?.ignores ?? ["node_modules"];
  let directory = path.resolve(startPath);
  if (!fs.statSync(startPath).isDirectory()) {
    directory = path.dirname(directory);
  }

  ignores.forEach((ignore) => {
    while (directory.includes(ignore)) {
      directory = path.resolve(directory, "..");
    }
  });

  const firstCandidate = path.resolve(path.join(directory, "package.json"));
  if (fs.existsSync(firstCandidate)) {
    return firstCandidate;
  }

  do {
    directory = path.resolve(directory, "..");
    const candidate = path.join(directory, "package.json");
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  } while (directory !== fsRoot);

  return;
};

const packageJSONCache = new Map<string, PackageJSON>();

export const getPackageJSON = (options?: FindPackageJSONOptions) => {
  if (!options?.refresh) {
    const refresh = options?.refresh;
    const cached = packageJSONCache.get(stableKey(options));
    if (cached) {
      return cached;
    }
    options = { ...options, refresh };
  }
  const path = findClosestPackageJSON(options);
  if (!path) return;

  const content = fs.readFileSync(path, { encoding: "utf8" });
  const packageJSON = JSON.parse(content) as PackageJSON;

  if (!options.refresh) {
    delete options.refresh;
    packageJSONCache.set(stableKey(options), packageJSON);
  }

  return packageJSON;
};

export const stableKey = (object: unknown): string => {
  return JSON.stringify(sortObject(object));
};

const sortObject = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((v) => sortObject(v));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        //@ts-expect-error - TS does not know what {}[string] could return, so it defaults to any
        .map((key) => [key, sortObject(value[key])])
    );
  }

  return value;
};
