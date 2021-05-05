const packages = [
  "akitainu",
  "akitainu-checker-eslint",
  "akitainu-checker-typescript",
  "akitainu-reporter-github-pr-review",
];

module.exports = {
  rules: [
    // eslint
    ...packages.map((p) => ({
      source: [
        "akitainu:static-source",
        {
          files: [`packages/${p}/src/**/*.ts`],
        },
      ],
      checker: "akitainu-checker-eslint",
    })),
    // typescript
    ...packages.map((p) => ({
      checker: [
        "akitainu-checker-typescript",
        {
          tsconfig: `./packages/${p}/tsconfig.json`,
        },
      ],
    })),
  ],
};
