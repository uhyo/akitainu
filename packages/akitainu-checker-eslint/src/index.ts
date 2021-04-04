import path from "path";
import { ESLint } from "eslint";
import { Checker, CheckError } from "akitainu";

export default function eslintChecker(eslintOptions?: ESLint.Options): Checker {
  const checker: Checker = {
    name: "eslint",
    async run({ targetFiles }) {
      const eslint = new ESLint(eslintOptions);
      const eslintResult = await eslint.lintFiles(targetFiles as string[]);
      const errors: CheckError[] = eslintResult.flatMap((lintResult) =>
        lintResult.messages.map((message) => ({
          code: message.ruleId || "",
          message: message.message,
          location: {
            file: lintResult.filePath,
            line: message.line,
            column: message.column,
          },
        }))
      );
      return {
        errors,
      };
    },
  };
  return checker;
}
