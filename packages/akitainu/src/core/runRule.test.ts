import { Rule } from "../rule/index.js";
import { runRule } from "./index.js";

describe("runRule", () => {
  it("source & checker", async () => {
    const rule: Rule = {
      checker: {
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
      source: {
        name: "source",
        async run() {
          return { targetFiles: ["a.ts", "b.ts"] };
        },
      },
    };
    const result = await runRule(rule, {
      baseDirectory: "./",
    });
    expect(result.errors).toEqual([
      {
        checker: "check",
        code: "ERR",
        message: "error!",
      },
      {
        checker: "check",
        code: "ERR2",
        message: "error!",
      },
    ]);
  });
  it("filter", async () => {
    const rule: Rule = {
      checker: {
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
      source: {
        name: "source",
        async run() {
          return { targetFiles: ["a.ts", "b.ts"] };
        },
      },
      filter: {
        name: "filter",
        async run({ errors }) {
          return {
            errors: errors.filter(({ code }) => code === "ERR2"),
          };
        },
      },
    };
    const result = await runRule(rule, {
      baseDirectory: "./",
    });
    expect(result.errors).toEqual([
      {
        checker: "check",
        code: "ERR2",
        message: "error!",
      },
    ]);
  });
});
