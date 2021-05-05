import { Source } from "./index.js";

export type StaticSourceInput = {
  files: string[];
};

export function staticSource({ files }: StaticSourceInput): Source {
  return {
    name: "static",
    async run() {
      return {
        targetFiles: files,
      };
    },
  };
}
