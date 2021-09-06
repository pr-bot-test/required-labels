const core = require("@actions/core");
const github = require("@actions/github");

try {
  const github_token = core.getInput("GITHUB_TOKEN");
  const requiredLabels = core.getInput("labels").split(",");
  log(github.context.payload)
  const labelsInIssue = github.context.payload.issue.labels.map((label) => {
    return label.name;
  });
  const octokit = github.getOctokit(github_token);

  const missingLabels = requiredLabels.filter((requiredLabel) => {
    return !labelsInIssue.includes(requiredLabel);
  });

  if (missingLabels.length > 0) {
    const missingLabelsString = missingLabels.join(", ");
    const message =github.context.payload

    octokit.rest.issues.createComment({
      issue_number: github.context.issue.number,
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      body: message,
    });
  }
} catch (error) {
  core.setFailed(error.message);
}
