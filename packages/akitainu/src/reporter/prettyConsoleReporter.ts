import chalk from "chalk";
import { Reporter } from ".";

export type PrettyConsoleReporterConfig = {};

export function prettyConsoleReporter(
  _: PrettyConsoleReporterConfig
): Reporter {
  return {
    name: "pretty-console",
    async run({ errors }) {
      for (const { checker, code, message, location } of errors) {
        const loc = !location
          ? ""
          : `${chalk.bold(location.file)}${chalk.gray(
              `:${location.line}:${location.column}`
            )}`;

        console.log(
          `
${loc}
${chalk.blueBright(checker)}:${chalk.yellow(code)} ${message}
`.trim() + "\n"
        );
      }
    },
  };
}
