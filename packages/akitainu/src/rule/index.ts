import { Checker } from "../checker";
import { Source } from "../source";

export type Rule = {
  name?: string;
  source?: Source;
  checker: Checker;
};
