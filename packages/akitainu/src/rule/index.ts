import { Checker } from "../checker";
import { Filter } from "../filter";
import { Source } from "../source";

export type Rule = {
  name?: string;
  source?: Source;
  checker: Checker;
  filter?: Filter;
};
