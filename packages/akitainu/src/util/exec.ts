import { spawn, SpawnOptions } from "child_process";

/**
 * Execute given function and returns stdout.
 */
export function exec(
  command: string,
  args: readonly string[],
  spawnOptions: SpawnOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, spawnOptions);
    proc.on("error", reject);
    proc.on("exit", (code) => {
      if (code) {
        reject(new Error(`Command '${command}' exited with code '${code}'`));
      }
    });
  });
}
