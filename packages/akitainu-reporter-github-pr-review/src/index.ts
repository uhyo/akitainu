import { Reporter } from "akitainu";
import { Octokit } from "octokit";
import { run } from "./run.js";

type OctokitOptions = ConstructorParameters<typeof Octokit>[0];

export type GithubPrReporterOptions = {
  /**
   * GitHub API URL. Defaults to "https://api.github.com"
   */
  githubApiUrl?: string;
  /**
   * GitHub access token
   */
  githubToken: string;
  /**
   * Reporository. Example: "uhyo/akitainu"
   */
  repository: string;
  /**
   * PR number.
   */
  prNumber: number;
  /**
   * Other octokit options.
   */
  octokitOptions?: OctokitOptions;
  /**
   * Tag for metadata embedded in review comments.
   * defaults to "akitainu"
   */
  metadataTag?: string;
};

export default function githubPrReporter({
  githubToken,
  githubApiUrl,
  repository,
  octokitOptions,
  prNumber,
  metadataTag = "akitainu",
}: GithubPrReporterOptions): Reporter {
  const [owner = "", repo = ""] = repository.split("/");
  const octokit = new Octokit({
    ...octokitOptions,
    auth: githubToken,
    baseUrl: githubApiUrl,
  });
  const reporter: Reporter = {
    name: "github-pr",
    async run({ errors }) {
      await run(
        errors,
        octokit,
        prNumber,
        {
          owner,
          repo,
        },
        metadataTag
      );
    },
  };
  return reporter;
}
