import { CheckError } from "../checker";

export type ReporterInput = {
  errors: readonly CheckError[];
};

export type Reporter = {
  /**
   * Name of reporter.
   */
  name: string;
  run: (input: ReporterInput) => Promise<void>;
};
