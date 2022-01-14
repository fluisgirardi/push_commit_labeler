const core = require('@actions/core');
const github = require('@actions/github');

const githubToken = core.getInput('github-token')
//const configPath = core.getInput('config-path', {required: true})

const client = github.getOctokit(githubToken)


function main_run()
{
  if (!github.context.payload) 
  {
    throw new Error('No payload found in the context.')
  }

  if ((!github.context.payload.commits) || (!github.context.payload.commits.length)) 
  {
    console.log(' - skipping commits');
    return;
  }
  
  var labels = client.request('GET /repos/{owner}/{repo}/labels', {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo
  });

  console.log(labels);
  
  for (label in labels)
  {
    var regexp = new RegExp('(%'+label.name+'% #)(\d+)(.*)');
    console.log('Looking for commit messages with %'+label.name);
    
    for (const i in github.context.payload.commits)
    {
      if (!github.context.payload.commits[i].message) continue;
      console.log('Commit message'+i+' - '+github.context.payload.commits[i].message);

      var regex = new RegExp('((%'+label+'% #)(\\d+))','gmi');
      var results = [...github.context.payload.commits[i].message.matchAll(regex)];
      console.log(results);
      if (result.length>0)
      {
         for (r in results)
         {
           var IssueNumber = parseInt(r[3]);
           if (isNaN(IssueNumber)) continue;
           
           client.issues.addLabels({
             owner: github.context.repo.owner,
             repo: github.context.repo.repo,
             issue_number: IssueNumber,
             labels: label
           })
         }
      }
    }
  }
}

main_run();

