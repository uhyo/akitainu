export type Checker = {
  name: string;
  run: (input: CheckerInput) => Promise<CheckerResult>;
};

export type CheckerInput = {
  readonly targetFiles: readonly string[];
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
