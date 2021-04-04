import { staticSource } from "../source/staticSource";
import { PackageConfig } from "./config";

export async function resolvePackage(pkg: PackageConfig): Promise<unknown> {
  if (typeof pkg === "string") {
    const mod = await resolvePackageName(pkg);
    return mod({});
  }
  const [packageName, config] = pkg;
  const mod = await resolvePackageName(packageName);
  return mod(config);
}

const internalPackage: Map<string, (config: any) => unknown> = new Map([
  ["static", staticSource],
]);

async function resolvePackageName(
  name: string
): Promise<(config: any) => unknown> {
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
