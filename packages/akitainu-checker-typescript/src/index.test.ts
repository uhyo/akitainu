import path from "path";
import typescriptChecker from ".";

describe("akitainu-checker-typescript", () => {
  it("normal", async () => {
    const projectDir = path.resolve(__dirname, "..", "test-fixtures/project1");
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
    const projectDir = path.resolve(__dirname, "..", "test-fixtures/project1");
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
    const projectDir = path.resolve(__dirname, "..", "test-fixtures/project1");
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
});
