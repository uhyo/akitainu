import { Checker } from "../checker";
import { Source } from "../source";

export type Rule = {
  source: Source;
  check: Checker;
};
