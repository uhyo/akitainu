import { Checker, CheckError } from "akitainu";
import { Minimatch } from "minimatch";
import path from "path";
import ts from "typescript";

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
    async run({ targetFiles, baseDirectory }) {
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
      const program = ts.createProgram({
        rootNames: parsedCommandLine?.fileNames ?? targetFiles ?? [],
        options: { ...compilerOptions, noEmit: true },
      });
      const emitResult = program.emit(undefined, () => {
        /* empty */
      });
      const allDiagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics);

      const fileFilter =
        targetFiles &&
        targetFiles.length > 0 &&
        new Minimatch(
          targetFiles.length > 1
            ? `{${targetFiles.join(",")}}`
            : (targetFiles[0] as string)
        );
      const errors: CheckError[] = allDiagnostics.flatMap((d) => {
        const { file, start = 0 } = d;
        const code = `TS${d.code}`;
        const message = ts.flattenDiagnosticMessageText(d.messageText, "\n", 2);
        if (!file) {
          return [
            {
              code,
              message,
            },
          ];
        }
        const fileName = path.relative(baseDirectory, file.fileName);
        if (fileFilter && !fileFilter.match(fileName)) {
          return [];
        }
        const { line, character } = file.getLineAndCharacterOfPosition(start);
        return [
          {
            code,
            message,
            location: {
              file: path.relative(baseDirectory, file.fileName),
              line: line + 1, // transform 0-indexed to 1-indexed
              column: character + 1, // same as above
            },
          },
        ];
      });
      return { errors };
    },
  };
  return checker;
}
