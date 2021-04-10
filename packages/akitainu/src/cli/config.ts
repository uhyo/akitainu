export type CliConfig = {
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
  reporters: PackageConfig[];
};

export type ConfigRule = {
  /**
   * Name of rule (used in output).
   */
  name?: string;
  /**
   * Source of files to check.
   */
  source?: PackageConfig;
  /**
   * Checker applied.
   */
  checker: PackageConfig;
  /**
   * Filter applied to errors.
   */
  filter?: PackageConfig;
};

export type PackageConfig = string | [packageName: string, config: unknown];

export function getDefaultConfig(defaultBaseDirectory: string): CliConfig {
  return {
    baseDirectory: defaultBaseDirectory,
    rules: [],
    reporters: ["akitainu:pretty-console"],
  };
}
