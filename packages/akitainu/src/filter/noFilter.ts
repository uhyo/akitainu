import { Filter } from "./index.js";

export function noFilter(): Filter {
  return {
    name: "no",
    async run({ errors }) {
      return { errors };
    },
  };
}
