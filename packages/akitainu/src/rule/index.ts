import { Check } from "../check";
import { Filter } from "../filter";

export type Rule = {
  filter: Filter;
  check: Check;
};
