import { byCodeFilter } from "../filter/byCodeFilter.js";
import { prettyConsoleReporter } from "../reporter/prettyConsoleReporter.js";
import { gitDiffSource } from "../source/gitDiffSource.js";
import { staticSource } from "../source/staticSource.js";
import { PackageConfig } from "./config.js";

export async function resolvePackage(pkg: PackageConfig): Promise<unknown> {
  if (typeof pkg === "string") {
    const mod = await resolvePackageName(pkg);
    return mod({} as never);
  }
  const [packageName, config] = pkg;
  const mod = await resolvePackageName(packageName);
  return mod(config as never);
}

const internalPackage = new Map<string, (config: never) => unknown>([
  ["static-source", staticSource],
  ["git-diff-source", gitDiffSource],
  ["pretty-console-reporter", prettyConsoleReporter],
  ["by-code-filter", byCodeFilter],
]);

async function resolvePackageName(
  name: string
): Promise<(config: never) => unknown> {
  const internalPackagePrefix = "akitainu:";
  if (name.startsWith(internalPackagePrefix)) {
    // `akitainu:`-prefixed name is special, pointing to internal package
    const internal = internalPackage.get(
      name.slice(internalPackagePrefix.length)
    );
    if (internal) {
      return internal;
    }
  }
  return (await import(name)).default;
}
