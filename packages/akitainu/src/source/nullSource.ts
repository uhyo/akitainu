import { Source } from "./index.js";

export function nullSource(): Source {
  return {
    name: "null",
    async run() {
      return {
        targetFiles: [],
      };
    },
  };
}
