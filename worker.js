addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*'
      }
    })
  }

  const url = new URL(request.url)
  const target = url.searchParams.get('url')

  if (!target) {
    return new Response(JSON.stringify({status: 'ok'}), {
      headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
    })
  }

  try {
    const resp = await fetch(target, {
      method: request.method,
      headers: request.headers,
      body: request.method === 'POST' ? await request.text() : undefined
    })
    const text = await resp.text()
    return new Response(text, {
      status: resp.status,
      headers: {'Content-Type': resp.headers.get('Content-Type') || 'application/json', 'Access-Control-Allow-Origin': '*'}
    })
  } catch(e) {
    return new Response(JSON.stringify({error: e.message}), {
      status: 500,
      headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
    })
  }
}
