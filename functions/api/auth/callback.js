export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing OAuth code', { status: 400 });
  }

  let msg;
  try {
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

    if (data.error) {
      msg = `authorization:github:error:${JSON.stringify({ error: data.error })}`;
    } else if (data.access_token) {
      msg = `authorization:github:success:${JSON.stringify({ token: data.access_token, provider: 'github' })}`;
    } else {
      msg = `authorization:github:error:${JSON.stringify({ error: 'no_token' })}`;
    }
  } catch (err) {
    msg = `authorization:github:error:${JSON.stringify({ error: 'token_exchange_failed' })}`;
  }

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
    window.close();
  })();
</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
