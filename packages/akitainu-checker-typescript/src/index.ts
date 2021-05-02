import { Checker, CheckError } from "akitainu";
import glob from "glob";
import path from "path";
import ts from "typescript";
import { promisify } from "util";

type TypeScriptCheckerOptions = {
  tsconfig?: string;
  /**
   * Compiler options to override tsconfig one.
   */
  compilerOptions?: ts.CompilerOptions;
};

export default function typescriptChecker({
  tsconfig,
  compilerOptions,
}: TypeScriptCheckerOptions): Checker {
  const checker: Checker = {
    name: "typescript",
    async run({ targetFiles = [], baseDirectory }) {
      let parsedCommandLine: ts.ParsedCommandLine | undefined;
      if (tsconfig !== undefined) {
        parsedCommandLine = ts.getParsedCommandLineOfConfigFile(
          path.resolve(baseDirectory, tsconfig),
          compilerOptions,
          {
            useCaseSensitiveFileNames: false,
            getCurrentDirectory: ts.sys.getCurrentDirectory,
            readDirectory: ts.sys.readDirectory,
            fileExists: ts.sys.fileExists,
            readFile: ts.sys.readFile,
            onUnRecoverableConfigFileDiagnostic(diagnostic) {
              throw new Error(
                ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n", 2)
              );
            },
          }
        );
        if (parsedCommandLine !== undefined) {
          compilerOptions = {
            ...compilerOptions,
            ...parsedCommandLine.options,
          };
        }
      }
      const hasMagic = targetFiles.some((value) => glob.hasMagic(value));
      const files = hasMagic
        ? await promisify(glob)(`@(${targetFiles.join("|")})`)
        : targetFiles;
      const program = ts.createProgram({
        rootNames: parsedCommandLine?.fileNames ?? targetFiles,
        options: { ...compilerOptions, noEmit: true },
      });
      const emitResult = program.emit(undefined, () => {
        /* empty */
      });
      const allDiagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics);
      const errors: CheckError[] = allDiagnostics.map((d) => {
        const { file, start } = d;
        const code = `TS${d.code}`;
        const message = ts.flattenDiagnosticMessageText(d.messageText, "\n", 2);
        if (!file) {
          return {
            code,
            message,
          };
        }
        const { line, character } = file.getLineAndCharacterOfPosition(
          d.start || 0
        );
        return {
          code,
          message,
          location: {
            file: path.relative(baseDirectory, file.fileName),
            line: line + 1, // transform 0-indexed to 1-indexed
            column: character + 1, // same as above
          },
        };
      });
      return { errors };
    },
  };
  return checker;
}
