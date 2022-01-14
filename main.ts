import * as core from '@actions/core'
import * as github from '@actions/github'

const githubToken = core.getInput('github-token')
//const configPath = core.getInput('config-path', {required: true})

const client = github.getOctokit(githubToken)

const push = github.context.payload.push

if (!push) {
  throw new Error(
    'Could not get push from context'
  )
}

var labels = await octokit.request('GET /repos/{owner}/{repo}/labels', {
  owner: github.context.repo.owner,
  repo: github.context.repo.repo
})

for (label in labels)
{
  var regexp = new RegExp('(%'+label.name+'% #)(\d+)(.*)')
  
  for (commit in push.commits)
  {
    var regex = new RegExp('((%'+label+'% #)(\\d+))','gmi');
    var results = [...commit.message.matchAll(regex)];
    if (result.length>0)
    {
       for (r in results)
       {
         var IssueNumber = parseInt(r[3]);
         if isNaN(IssueNumber) continue;
         
         await client.issues.addLabels({
           owner: github.context.repo.owner,
           repo: github.context.repo.repo,
           issue_number: IssueNumber,
           labels: label
         })
       }
    }
  }
}
