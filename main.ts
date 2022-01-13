import * as core from '@actions/core'
import * as github from '@actions/github'

const githubToken = core.getInput('github-token')
//const configPath = core.getInput('config-path', {required: true})

const client = github.getOctokit(githubToken)

labels = await octokit.request('GET /repos/{owner}/{repo}/labels', {
  owner: github.context.repo.owner,
  repo: github.context.repo.repo
})

for (label in labels)
{
  
  int IssueNumber;
  await client.issues.addLabels({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: IssueNumber,
    labels: label
  })
}
