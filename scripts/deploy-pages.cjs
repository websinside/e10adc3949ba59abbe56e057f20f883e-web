// Deploy the exact artifact returned by upload-pages-artifact. Avoid an
// additional artifact lookup, which was returning an empty list on this runner.
module.exports = async ({ github, context, core }) => {
  const artifactId = process.env.PAGES_ARTIFACT_ID;
  if (!/^\d+$/.test(artifactId || '')) throw new Error('Missing Pages artifact ID');
  const { owner, repo } = context.repo;
  const { data: deployment } = await github.request('POST /repos/{owner}/{repo}/pages/deployments', {
    owner, repo, artifact_id: artifactId, pages_build_version: context.sha,
    oidc_token: await core.getIDToken()
  });
  core.setOutput('page_url', deployment.page_url);
  const deploymentId = deployment.id || deployment.status_url?.split('/').pop() || context.sha;
  const failed = new Set(['deployment_failed','deployment_content_failed','deployment_cancelled','deployment_lost']);
  for (let attempt = 0; attempt < 60; attempt++) {
    const { data } = await github.request('GET /repos/{owner}/{repo}/pages/deployments/{deployment_id}', {
      owner, repo, deployment_id: deploymentId
    });
    if (data.status === 'succeed') { core.info('GitHub Pages published successfully'); return; }
    if (failed.has(data.status)) throw new Error('Pages: ' + data.status);
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
  throw new Error('Timed out waiting for GitHub Pages deployment');
};
