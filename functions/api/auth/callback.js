export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing OAuth code', { status: 400 });
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await tokenRes.json();

  const msg = data.error
    ? `authorization:github:error:${JSON.stringify({ error: data.error })}`
    : `authorization:github:success:${JSON.stringify({ token: data.access_token, provider: 'github' })}`;

  const html = `<!doctype html>
<html>
<body>
<script>
  (function () {
    var msg = ${JSON.stringify(msg)};
    function receive(e) {
      window.opener.postMessage(msg, e.origin);
    }
    window.addEventListener('message', receive);
    if (window.opener) {
      window.opener.postMessage(msg, '*');
    }
  })();
</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
