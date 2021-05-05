import { Checker } from "../checker/index.js";
import { Filter } from "../filter/index.js";
import { Source } from "../source/index.js";

export type Rule = {
  name?: string;
  source?: Source;
  checker: Checker;
  filter?: Filter;
};
