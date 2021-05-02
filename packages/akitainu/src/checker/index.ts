export type Checker = {
  name: string;
  run: (input: CheckerInput) => Promise<CheckerResult>;
};

export type CheckerInput = {
  /**
   * Files to run the check against.
   * If omitted, checker's default should be applied.
   */
  readonly targetFiles?: readonly string[];
  /**
   * Base directory. This should be base of relative paths.
   */
  readonly baseDirectory: string;
};

export type CheckerResult = {
  errors: CheckError[];
};

export type CheckError = {
  /**
   * Error code.
   */
  code: string;
  /**
   * Error message.
   */
  message: string;
  /**
   * Location of error.
   */
  location?: {
    file: string;
    line: number;
    column: number;
  };
};
