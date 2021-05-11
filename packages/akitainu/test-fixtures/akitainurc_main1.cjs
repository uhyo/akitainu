module.exports = {
  rules: [
    {
      source: {
        async run() {
          return {
            targetFiles: ["foo.ts", "bar.ts"],
          };
        },
      },
      checker: {
        name: "chk",
        async run({ targetFiles }) {
          return {
            errors: targetFiles.flatMap((file) => [
              {
                code: "ERR",
                message: file,
              },
              {
                code: "ERR2",
                message: file,
              },
            ]),
          };
        },
      },
      filters: [
        {
          async run({ errors }) {
            return {
              errors: errors.map((err) => ({
                ...err,
                message: `${err.message}\nhi`,
              })),
            };
          },
        },
      ],
    },
  ],
  reporters: [],
};
