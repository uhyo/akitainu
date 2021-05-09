![npm](https://img.shields.io/npm/v/akitainu)

## Problem

You want to add a new lint rule to existing codebase, but you cannot afford to fix all existing code.

## Solution

You only check changed files with the new lint rule when a pull request is opened. This way, new files are forced to obey the new rule. Also, existing files are gradually fixed as they are modified.

**akitainu** helps you automate this workflow.

akitainu is inspired by [reviewdog](https://github.com/reviewdog/reviewdog), but is for the npm ecosystem.

## Usage

See also: [Akitainu Website](https://akitainu.vercel.app/)

Basically, you define **rules** which are composed of following configurations:

- **source** defines which files to check.
- **checker** defines what check is done against files.
- **filter** defines which errors to report.

The above solution is realized by _sourcing_ from `git diff`. When you check existing code, you can _filter_ out errors from the new lint rule so that the existing code is still green.

### Simple Setting

The following setting runs `eslint` against all files matching `./src/**/*.ts`. Resulting errors are not filtered.

```json
{
  "rules": [
    {
      "source": [
        "akitainu:static-source",
        {
          "files": ["./src/**/*.ts"]
        }
      ],
      "checker": "akitainu-checker-eslint"
    }
  ]
}
```

### Complex setting

The following config defines two rules. One of them is for full linting and the other is for checking pull requests. The latter sources from `git diff` through the built-in `akitainu:git-diff-source` source. Both rules have a filter set up so that `@typescript-eslint/no-explicit-any` erros are effective only in the latter rule.

Also this config has a custom **reporter** `akitainu-reporter-github-pr-review` which reports errors through review comments on the pull request in question.

```js
// eslint rules to check only for changed files in PRs
const eslintAdditionalCheckRules = ["@typescript-eslint/no-explicit-any"];

module.exports = {
  rules: [
    {
      source: [
        "akitainu:static-source",
        {
          files: ["./src/**/*.ts"],
        },
      ],
      checker: "akitainu-checker-eslint",
      filter: [
        "akitainu:by-code-filter",
        {
          exclude: eslintAdditionalCheckRules,
        },
      ],
    },
    ...// additional check for pull request
    (process.env.GITHUB_BASE_REF
      ? [
          {
            source: [
              "akitainu:git-diff-source",
              {
                before: "origin/" + process.env.GITHUB_BASE_REF,
                after: "HEAD",
              },
            ],
            checker: "akitainu-checker-eslint",
            filter: [
              "akitainu:by-code-filter",
              {
                include: eslintAdditionalCheckRules,
              },
            ],
          },
        ]
      : []),
  ],
  reporters: [
    "akitainu:pretty-console-reporter",
    ...(process.env.GITHUB_TOKEN && process.env.PR_NUMBER
      ? [
          [
            "akitainu-reporter-github-pr-review",
            {
              githubToken: process.env.GITHUB_TOKEN,
              repository: "uhyo/akitainu-playground",
              prNumber: Number(process.env.PR_NUMBER),
            },
          ],
        ]
      : []),
  ],
};
```

See [uhyo/akitainu-playground](https://github.com/uhyo/akitainu-playground) for how the above config works.

## Project Status

This project is in a PoC stage. Currently only ESLint is officially supported as a checker.

Any kind of help is super welcome.

## Contribution

Welcome

## License

MIT
