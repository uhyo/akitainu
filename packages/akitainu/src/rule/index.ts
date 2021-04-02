import { Checker } from "../checker";
import { Filter } from "../filter";

export type Rule = {
  filter: Filter;
  check: Checker;
};
