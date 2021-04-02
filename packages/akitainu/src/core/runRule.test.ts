import { runRule } from ".";
import { Rule } from "../rule";

describe("runRule", () => {
  it("errors", async () => {
    const rule: Rule = {
      check: {
        name: "check",
        async run(input) {
          expect(input.targetFiles).toEqual(["a.ts", "b.ts"]);
          return {
            errors: [
              {
                code: "ERR",
                message: "error!",
              },
              {
                code: "ERR2",
                message: "error!",
              },
            ],
          };
        },
      },
      filter: {
        name: "filter",
        async run() {
          return { targetFiles: ["a.ts", "b.ts"] };
        },
      },
    };
    const result = await runRule(rule);
    expect(result.errors).toEqual([
      {
        code: "ERR",
        message: "error!",
      },
      {
        code: "ERR2",
        message: "error!",
      },
    ]);
  });
});
