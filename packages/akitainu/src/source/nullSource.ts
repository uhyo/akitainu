import { Source } from ".";

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
