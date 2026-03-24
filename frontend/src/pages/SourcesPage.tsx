import { useQuery } from "@tanstack/react-query";
import { BookOpen, Calendar } from "lucide-react";
import { api } from "@/lib/api";

export default function SourcesPage() {
  const { data: sources, isLoading } = useQuery({
    queryKey: ["sources"],
    queryFn: api.sources.list,
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Sources</h1>
        <p className="text-sm text-stone-500 mt-1">
          Ouvrages de référence du répertoire grégorien
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-stone-200 p-5 animate-pulse"
            >
              <div className="h-5 bg-stone-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-stone-100 rounded w-1/5" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sources?.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl border border-stone-200 p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-stone-900">
                    {s.title || "Sans titre"}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-stone-500">
                    {s.editor && <span>{s.editor}</span>}
                    {s.year && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {s.year}
                      </span>
                    )}
                    {s.period && (
                      <span className="bg-stone-100 px-2 py-0.5 rounded text-xs">
                        {s.period}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {sources?.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500">Aucune source trouvée.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
