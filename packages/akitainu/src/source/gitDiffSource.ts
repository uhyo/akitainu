import child_process from "child_process";
import path from "path";
import { promisify } from "util";
import { Source } from "./index.js";

const execFile = promisify(child_process.execFile);

export type GitDiffSourceOptions = {
  before: string;
  after: string;
};

export function gitDiffSource({ before, after }: GitDiffSourceOptions): Source {
  return {
    name: "git-diff",
    async run() {
      const { stdout: gitRootDir } = await execFile("git", [
        "rev-parse",
        "--show-toplevel",
      ]);
      const { stdout: statuses } = await execFile("git", [
        "diff",
        "--name-status",
        `${before}..${after}`,
      ]);
      const trimmedGitRootDir = gitRootDir.trim();
      const targetFiles = statuses.split("\n").flatMap((line) => {
        const [letter, filePath] = line.split(/\s+/);
        if (letter === "D" || !letter) {
          // remove deleted file
          return [];
        }
        return [path.join(trimmedGitRootDir, filePath || "")];
      });
      return {
        targetFiles,
      };
    },
  };
}
