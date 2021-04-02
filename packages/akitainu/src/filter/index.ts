export type Filter = {
  name: string;
  run: () => Promise<FilterResult>;
};

export type FilterResult = {
  targetFiles: string[];
};
