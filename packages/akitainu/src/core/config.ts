import { Checker } from "../checker/index.js";
import { Filter } from "../filter/index.js";
import { Reporter } from "../reporter/index.js";
import { Source } from "../source/index.js";

export type AkitainuConfig = {
  /**
   * Base directory of relative paths in the config.
   */
  baseDirectory: string;
  /**
   * Rule to run.
   */
  rules: ConfigRule[];
  /**
   * Reporters definition.
   */
  reporters: (PackageConfig | Reporter)[];
};

export type ConfigRule = {
  /**
   * Name of rule (used in output).
   */
  name?: string;
  /**
   * Source of files to check.
   */
  source?: PackageConfig | Source;
  /**
   * Checker applied.
   */
  checker: PackageConfig | Checker;
  /**
   * Filters applied to errors.
   */
  filters?: (PackageConfig | Filter)[];
};

export type PackageConfig = string | [packageName: string, config: unknown];

export function getDefaultConfig(defaultBaseDirectory: string): AkitainuConfig {
  return {
    baseDirectory: defaultBaseDirectory,
    rules: [],
    reporters: ["akitainu:reporter-pretty-console"],
  };
}
