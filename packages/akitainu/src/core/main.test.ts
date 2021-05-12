import path from "path";
import { fileURLToPath } from "url";
import { main } from "./main.js";

describe("main", () => {
  it("load config", async () => {
    const configPath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../test-fixtures/akitainurc_main1.cjs"
    );
    const result = await main(configPath);
    expect(result).toEqual({
      hasErrors: true,
      errors: [
        {
          checker: "chk",
          code: "ERR",
          message: "foo.ts\nhi",
        },
        {
          checker: "chk",
          code: "ERR2",
          message: "foo.ts\nhi",
        },
        {
          checker: "chk",
          code: "ERR",
          message: "bar.ts\nhi",
        },
        {
          checker: "chk",
          code: "ERR2",
          message: "bar.ts\nhi",
        },
      ],
    });
  });
});
