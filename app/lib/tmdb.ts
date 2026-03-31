const API_TOKEN = process.env.TMDB_API_TOKEN;
const BASE_URL = process.env.TMDB_BASE_URL;

export async function search(query: string) {
  const response = await fetch(
    `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=1`,
    {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    },
  );
  if (!response.ok) throw new Error(`Search error: ${response.status}`);
  return response.json();
}

export async function details(id: string) {
  const response = await fetch(`${BASE_URL}/movie/${id}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });
  if (!response.ok) throw new Error(`Details error: ${response.status}`);
  return response.json();
}
