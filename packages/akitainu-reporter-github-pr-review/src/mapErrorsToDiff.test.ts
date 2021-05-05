import parseDiff from "parse-diff";
import { mapErrorsToDiff } from "./mapErrorsToDiff.js";

describe("mapErrorsToDiff", () => {
  it("1", () => {
    const errorsByFile = new Map([
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
    ]);
    const parsedDiff = parseDiff(`
diff --git a/src/index.ts b/src/index.ts
index a8141d3..e940a8a 100644
--- a/src/index.ts
+++ b/src/index.ts
@@ -1 +1,7 @@
+const pika = "chu" as any;
+
  console.log("Hello, world!");
+
+console.log("Hello, any!");
+
+const foo: any = 3;
`);

    expect(mapErrorsToDiff(errorsByFile, parsedDiff)).toEqual([
      {
        filePath: "src/index.ts",
        position: 1,
        error: {
          code: "@typescript-eslint/no-explicit-any",
          message: "Unexpected any. Specify a different type.",
          location: {
            file: "/path/to/project/src/index.ts",
            line: 1,
            column: 23,
          },
          checker: "eslint",
        },
      },
      {
        filePath: "src/index.ts",
        position: 7,
        error: {
          code: "@typescript-eslint/no-explicit-any",
          message: "Unexpected any. Specify a different type.",
          location: {
            file: "/path/to/project/src/index.ts",
            line: 7,
            column: 12,
          },
          checker: "eslint",
        },
      },
    ]);
  });
});
