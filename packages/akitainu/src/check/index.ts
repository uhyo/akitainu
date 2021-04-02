export type Check = {
  name: string;
  run: (input: CheckInput) => Promise<CheckResult>;
};

export type CheckInput = {
  readonly targetFiles: readonly string[];
};

export type CheckResult = {
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
