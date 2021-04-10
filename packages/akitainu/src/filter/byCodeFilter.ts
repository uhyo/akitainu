import { Filter } from ".";

export type ByCodeFilterOptions =
  | {
      include: readonly string[];
      exclude?: undefined;
    }
  | {
      include?: undefined;
      exclude: readonly string[];
    };

export function byCodeFilter(options: ByCodeFilterOptions): Filter {
  if (options.include) {
    const includeSet = new Set(options.include);
    return {
      name: "by-code",
      async run({ errors }) {
        return {
          errors: errors.filter(({ code }) => includeSet.has(code)),
        };
      },
    };
  } else {
    const excludeSet = new Set(options.exclude);
    return {
      name: "by-code",
      async run({ errors }) {
        return {
          errors: errors.filter(({ code }) => !excludeSet.has(code)),
        };
      },
    };
  }
}
