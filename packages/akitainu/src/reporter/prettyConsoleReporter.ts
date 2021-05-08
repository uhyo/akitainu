import chalk from "chalk";
import { Reporter } from "./index.js";

// empty for now
export type PrettyConsoleReporterConfig = Record<string, never>;

export function prettyConsoleReporter(
  _: PrettyConsoleReporterConfig
): Reporter {
  return {
    name: "pretty-console",
    async run({ errors }) {
      console.log(
        `Found ${errors.length || "no"} error${errors.length > 1 ? "s" : ""}.\n`
      );
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
