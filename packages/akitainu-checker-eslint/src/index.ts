import { Checker, CheckError } from "akitainu";
import { ESLint } from "eslint";

export type CheckerESLintOptions = {
  eslintOptions?: ESLint.Options;
};

export default function eslintChecker({
  eslintOptions,
}: CheckerESLintOptions): Checker {
  const checker: Checker = {
    name: "eslint",
    async run({ targetFiles = [] }) {
      const eslint = new ESLint(eslintOptions);
      const eslintResult = await eslint.lintFiles(targetFiles as string[]);
      const errors: CheckError[] = eslintResult.flatMap((lintResult) =>
        lintResult.messages.flatMap((message) => {
          if (message.severity !== 2) {
            // 2 is error
            return [];
          }
          return [
            {
              code: message.ruleId || "",
              message: message.message,
              location: {
                file: lintResult.filePath,
                line: message.line,
                column: message.column,
              },
            },
          ];
        })
      );
      return {
        errors,
      };
    },
  };
  return checker;
}
