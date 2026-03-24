export interface Chant {
  id: number;
  title: string;
  incipit: string | null;
  chant_type: string;
  mode: number | null;
  latin_text: string | null;
  source: string | null;
}

export interface Feast {
  id: number;
  name: string;
  latin_name: string | null;
  season: string;
  rank: string | null;
  day_of_year: number | null;
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export const api = {
  chants: {
    list: () => fetchJson<Chant[]>("/api/chants"),
    get: (id: number) => fetchJson<Chant>(`/api/chants/${id}`),
    create: (data: Omit<Chant, "id">) =>
      fetchJson<Chant>("/api/chants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
  },
  feasts: {
    list: () => fetchJson<Feast[]>("/api/feasts"),
    get: (id: number) => fetchJson<Feast>(`/api/feasts/${id}`),
    create: (data: Omit<Feast, "id">) =>
      fetchJson<Feast>("/api/feasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    chants: (id: number) => fetchJson<Chant[]>(`/api/feasts/${id}/chants`),
  },
};
