import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Music } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, OFFICE_PART_LABELS } from "@/lib/api";

export default function ChantsPage() {
  const [searchParams] = useSearchParams();
  const tagIdParam = searchParams.get("tag_id");

  const [search, setSearch] = useState("");
  const [officePart, setOfficePart] = useState("");
  const [mode, setMode] = useState("");

  const { data: chants, isLoading } = useQuery({
    queryKey: ["chants", { search, officePart, mode, tagIdParam }],
    queryFn: () =>
      api.chants.list({
        search: search || undefined,
        office_part: officePart || undefined,
        mode: mode || undefined,
        tag_id: tagIdParam ? Number(tagIdParam) : undefined,
        limit: 100,
      }),
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Chants</h1>
        <p className="text-sm text-stone-500 mt-1">
          {chants
            ? `${chants.length} résultat${chants.length > 1 ? "s" : ""}`
            : "Chargement..."}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6">
        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-stone-600">
          <Filter className="w-4 h-4" />
          Filtres
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Rechercher par incipit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg text-sm bg-stone-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
            />
          </div>
          <select
            value={officePart}
            onChange={(e) => setOfficePart(e.target.value)}
            className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-stone-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
          >
            <option value="">Tous les types</option>
            {Object.entries(OFFICE_PART_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-stone-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
          >
            <option value="">Tous les modes</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((m) => (
              <option key={m} value={String(m)}>
                Mode {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-stone-200 p-4 animate-pulse"
            >
              <div className="h-4 bg-stone-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-stone-100 rounded w-1/5" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {chants?.map((c) => (
            <Link
              key={c.id}
              to={`/chants/${c.id}`}
              className="flex items-center gap-4 bg-white rounded-xl border border-stone-200 px-5 py-4 hover:shadow-md hover:border-amber-200 transition group"
            >
              <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
                <Music className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-900 truncate">
                  {c.incipit || "—"}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {c.office_part && (
                    <span className="text-xs text-stone-500">
                      {OFFICE_PART_LABELS[c.office_part] || c.office_part}
                    </span>
                  )}
                </div>
              </div>
              {c.mode && (
                <span className="text-xs font-medium bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full flex-shrink-0">
                  Mode {c.mode}
                </span>
              )}
            </Link>
          ))}

          {chants?.length === 0 && (
            <div className="text-center py-12">
              <Music className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500">Aucun chant trouvé.</p>
              <p className="text-sm text-stone-400 mt-1">
                Essayez de modifier vos filtres.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
