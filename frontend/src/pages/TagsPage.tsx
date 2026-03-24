import { useQuery } from "@tanstack/react-query";
import { Search, Tag } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";

export default function TagsPage() {
  const [search, setSearch] = useState("");

  const { data: tags, isLoading } = useQuery({
    queryKey: ["tags", search],
    queryFn: () => api.tags.list(search || undefined),
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Tags liturgiques</h1>
        <p className="text-sm text-stone-500 mt-1">
          {tags
            ? `${tags.length} tag${tags.length > 1 ? "s" : ""}`
            : "Chargement..."}
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Rechercher un tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg text-sm bg-stone-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
          />
        </div>
      </div>

      {/* Tags cloud */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-stone-200 p-6 animate-pulse">
          <div className="flex gap-2 flex-wrap">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="h-8 bg-stone-200 rounded-full"
                style={{ width: `${60 + Math.random() * 80}px` }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          {tags && tags.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {tags.map((t) => (
                <Link
                  key={t.id}
                  to={`/chants?tag_id=${t.id}`}
                  className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full text-sm hover:bg-emerald-100 hover:border-emerald-300 transition-colors"
                >
                  <Tag className="w-3 h-3" />
                  {t.tag}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Tag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500">Aucun tag trouvé.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
