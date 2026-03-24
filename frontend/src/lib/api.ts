export interface ChantListItem {
  id: number;
  incipit: string | null;
  office_part: string | null;
  mode: string | null;
}

export interface Tag {
  id: number;
  tag: string;
}

export interface ChantDetail extends ChantListItem {
  cantus_id: string | null;
  version: string | null;
  mode_var: string | null;
  transcriber: string | null;
  commentary: string | null;
  gabc: string | null;
  gabc_verses: string | null;
  remarks: string | null;
  tags: Tag[];
}

export interface Source {
  id: number;
  year: number | null;
  period: string | null;
  editor: string | null;
  title: string | null;
}

// Labels lisibles pour les types de pièces
export const OFFICE_PART_LABELS: Record<string, string> = {
  in: "Introït",
  gr: "Graduel",
  al: "Alléluia",
  tr: "Trait",
  of: "Offertoire",
  co: "Communion",
  an: "Antienne",
  re: "Répons",
  hy: "Hymne",
  se: "Séquence",
  ky: "Kyrie",
  gl: "Gloria",
  cr: "Credo",
  sa: "Sanctus",
  ag: "Agnus Dei",
};

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export const api = {
  chants: {
    list: (params?: {
      office_part?: string;
      mode?: string;
      search?: string;
      tag_id?: number;
      limit?: number;
      offset?: number;
    }) => {
      const sp = new URLSearchParams();
      if (params?.office_part) sp.set("office_part", params.office_part);
      if (params?.mode) sp.set("mode", params.mode);
      if (params?.search) sp.set("search", params.search);
      if (params?.tag_id) sp.set("tag_id", String(params.tag_id));
      if (params?.limit) sp.set("limit", String(params.limit));
      if (params?.offset) sp.set("offset", String(params.offset));
      const qs = sp.toString();
      return fetchJson<ChantListItem[]>(`/api/chants${qs ? `?${qs}` : ""}`);
    },
    get: (id: number) => fetchJson<ChantDetail>(`/api/chants/${id}`),
  },
  tags: {
    list: (search?: string) => {
      const qs = search ? `?search=${encodeURIComponent(search)}` : "";
      return fetchJson<Tag[]>(`/api/tags${qs}`);
    },
    chants: (id: number) => fetchJson<ChantListItem[]>(`/api/tags/${id}/chants`),
  },
  sources: {
    list: () => fetchJson<Source[]>("/api/sources"),
  },
};
