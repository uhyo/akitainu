export type Source = {
  name: string;
  run: () => Promise<SourceResult>;
};

export type SourceResult = {
  targetFiles: string[];
};
