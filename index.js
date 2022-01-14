const core        = require('@actions/core');
const github      = require('@actions/github');
const githubToken = core.getInput('github-token')
const client      = github.getOctokit(githubToken)


//core.error('This is a bad error. This will also fail the build.')
//core.warning('Something went wrong, but it\'s not bad enough to fail the build.')
//core.notice('Something happened that you might want to know about.')

if (!github.context.payload) 
{
  throw new Error('No payload found in the context.')
}

if ((!github.context.payload.commits) || (!github.context.payload.commits.length)) 
{
  core.error('Skipping: no commits');
  return;
}

//TODO #3: Why this returns a empty list?
var labels = client.request('GET /repos/{owner}/{repo}/labels', {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
})

core.notice(labels);

//WHEN Issue/TODO #3 is done, uncoment this
/*if ((!labels) || (!labels.length)) 
{
  core.error('Skipping: no Labels');
  return;
}
for (label in labels)
{
  //var regex = new RegExp('((%'+label+'% #)(\\d+))','gmi');
*/
  var regex = new RegExp('((%([a-zA-Z][a-zA-Z0-9]+)% #)(\\d+))','gmi');
  //core.notice('Looking for commit messages with %'+label.name);
  
  for (const i in github.context.payload.commits)
  {
    if (!github.context.payload.commits[i].message) continue;
    core.notice('Commit message'+i+' - '+github.context.payload.commits[i].message);
    
    var results = [...github.context.payload.commits[i].message.matchAll(regex)];
    core.notice(results);
    if (results.length>0)
    {
      for (r in results)
      {
        var label = results[r][3];
        var IssueNumber = parseInt(results[r][4]);
        let exists = false;
        
        if (isNaN(IssueNumber)) continue;

        exists = false;
        try
        {
           client.request('GET /repos/{owner}/{repo}/labels/{name}', {
               owner: github.context.repo.owner,
               repo: github.context.repo.repo,
               name: label
           });
           exists = true;
        }
        catch
        {
          exists = false;
        }


        if (exists)
        {
          try
          {
            client.request('POST /repos/{owner}/{repo}/issues/{issue_number}/labels', {
              owner: github.context.repo.owner,
              repo: github.context.repo.repo,
              issue_number: IssueNumber,
              labels: [label]
            })
          }
          catch
          {
          }
        }
        else
        {
          core.warning('Skippinp label that dont exists: '+label);
        }
      }
    }
  //}
}