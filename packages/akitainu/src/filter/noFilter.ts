import { Filter } from ".";

export function noFilter(): Filter {
  return {
    name: "no",
    async run({ errors }) {
      return { errors };
    },
  };
}
