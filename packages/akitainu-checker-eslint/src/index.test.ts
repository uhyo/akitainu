import path from "path";
import eslintChecker from ".";

describe("akitainu-checker-eslint", () => {
  it("glob", async () => {
    const checker = eslintChecker();
    const testFixturesDir = path.resolve(__dirname, "../test-fixtures");
    const { errors } = await checker.run({
      targetFiles: ["./test-fixtures/*.js"],
    });
    expect(errors).toEqual([
      {
        code: "eqeqeq",
        location: {
          file: path.join(testFixturesDir, "eqeqeq.js"),
          line: 2,
          column: 14,
        },
        message: "Expected '===' and instead saw '=='.",
      },
      {
        code: "no-unreachable",
        location: {
          file: path.join(testFixturesDir, "no-unreachable.js"),
          line: 3,
          column: 3,
        },
        message: "Unreachable code.",
      },
    ]);
  });
});
