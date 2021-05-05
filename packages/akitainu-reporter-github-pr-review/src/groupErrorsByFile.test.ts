import { groupErrorsByFile } from "./groupErrorsByFile.js";

describe("groupErrorsByFile", () => {
  it("errors are grouped by files", () => {
    const errors = [
      {
        code: "@typescript-eslint/no-explicit-any",
        message: "Unexpected any. Specify a different type.",
        location: {
          file: "/path/to/project/src/index.ts",
          line: 1,
          column: 23,
        },
        checker: "eslint",
      },
      {
        code: "@typescript-eslint/no-explicit-any",
        message: "Unexpected any. Specify a different type.",
        location: {
          file: "/path/to/project/src/index.ts",
          line: 7,
          column: 12,
        },
        checker: "eslint",
      },
      {
        code: "some-other-code",
        message: "message",
        location: {
          file: "/path/to/project/src/dir/other-file.ts",
          line: 1,
          column: 1,
        },
        checker: "eslint",
      },
      {
        code: "no-location-error",
        message: "what?",
        checker: "unknown",
      },
    ];
    const baseDir = "/path/to/project";

    expect(groupErrorsByFile(errors, baseDir)).toEqual({
      noLocationErrors: [
        {
          code: "no-location-error",
          message: "what?",
          checker: "unknown",
        },
      ],
      errorsByFile: new Map([
        [
          "src/index.ts",
          [
            {
              code: "@typescript-eslint/no-explicit-any",
              message: "Unexpected any. Specify a different type.",
              location: {
                file: "/path/to/project/src/index.ts",
                line: 1,
                column: 23,
              },
              checker: "eslint",
            },
            {
              code: "@typescript-eslint/no-explicit-any",
              message: "Unexpected any. Specify a different type.",
              location: {
                file: "/path/to/project/src/index.ts",
                line: 7,
                column: 12,
              },
              checker: "eslint",
            },
          ],
        ],
        [
          "src/dir/other-file.ts",
          [
            {
              code: "some-other-code",
              message: "message",
              location: {
                file: "/path/to/project/src/dir/other-file.ts",
                line: 1,
                column: 1,
              },
              checker: "eslint",
            },
          ],
        ],
      ]),
    });
  });
});
