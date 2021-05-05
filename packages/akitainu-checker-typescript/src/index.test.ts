import { jest } from "@jest/globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import typescriptChecker from "./index.js";

// TypeScript checker needs time, so increase timeout
jest.setTimeout(150_000);

describe("akitainu-checker-typescript", () => {
  const projectDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "test-fixtures/project1"
  );
  it("normal", async () => {
    const checker = typescriptChecker({
      tsconfig: path.join(projectDir, "tsconfig.json"),
    });
    const { errors } = await checker.run({
      baseDirectory: projectDir,
    });
    expect(errors).toEqual([
      {
        code: "TS2322",
        location: {
          file: "src/foo.ts",
          line: 1,
          column: 14,
        },
        message: "Type 'number' is not assignable to type 'string'.",
      },
      {
        code: "TS2304",
        location: {
          file: "src/index.ts",
          line: 1,
          column: 1,
        },
        message: "Cannot find name 'aaa'.",
      },
      {
        code: "TS7006",
        location: {
          file: "src/index.ts",
          line: 3,
          column: 15,
        },
        message: "Parameter 'oh' implicitly has an 'any' type.",
      },
    ]);
  });
  it("filtering by filenames", async () => {
    const checker = typescriptChecker({
      tsconfig: path.join(projectDir, "tsconfig.json"),
    });
    const { errors } = await checker.run({
      targetFiles: ["src/**/foo.ts"],
      baseDirectory: projectDir,
    });
    expect(errors).toEqual([
      {
        code: "TS2322",
        location: {
          file: "src/foo.ts",
          line: 1,
          column: 14,
        },
        message: "Type 'number' is not assignable to type 'string'.",
      },
    ]);
  });
  it("filtering by filenames (multiple)", async () => {
    const checker = typescriptChecker({
      tsconfig: path.join(projectDir, "tsconfig.json"),
    });
    const { errors } = await checker.run({
      targetFiles: ["src/**/foo.ts", "src/**/bar.ts"],
      baseDirectory: projectDir,
    });
    expect(errors).toEqual([
      {
        code: "TS2322",
        location: {
          file: "src/foo.ts",
          line: 1,
          column: 14,
        },
        message: "Type 'number' is not assignable to type 'string'.",
      },
    ]);
  });
  it("filtering by absolute path", async () => {
    const checker = typescriptChecker({
      tsconfig: path.join(projectDir, "tsconfig.json"),
    });
    const { errors } = await checker.run({
      targetFiles: [path.join(projectDir, "src/foo.ts")],
      baseDirectory: projectDir,
    });
    expect(errors).toEqual([
      {
        code: "TS2322",
        location: {
          file: "src/foo.ts",
          line: 1,
          column: 14,
        },
        message: "Type 'number' is not assignable to type 'string'.",
      },
    ]);
  });
});
