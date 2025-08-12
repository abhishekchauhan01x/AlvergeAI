import 'dotenv/config';

const fetchFn = globalThis.fetch ? globalThis.fetch.bind(globalThis) : null;

export async function searchWeb(query) {
  const tavilyKey = process.env.TAVILY_API_KEY;
  if (!tavilyKey) {
    return null;
  }

  let doFetch = fetchFn;
  if (!doFetch) {
    try {
      const mod = await import('node-fetch');
      doFetch = mod.default;
    } catch {
      return null;
    }
  }

  try {
    const response = await doFetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: tavilyKey,
        query,
        search_depth: 'basic',
        include_answer: false,
        max_results: 5
      })
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const results = Array.isArray(data.results) ? data.results.slice(0, 3) : [];
    if (results.length === 0) return null;

    const lines = results.map((r, idx) => {
      const title = r.title || 'Result';
      const url = r.url || '';
      const snippet = (r.content || r.snippet || '').toString().slice(0, 300).replace(/\s+/g, ' ').trim();
      return `[${idx + 1}] ${title} - ${url}\n${snippet}`;
    });

    return `Web search results for: "${query}"\n${lines.join('\n\n')}`;
  } catch (_err) {
    return null;
  }
}

export default { searchWeb }; 