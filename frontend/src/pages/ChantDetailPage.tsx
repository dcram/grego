import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Music, Tag, User, BookOpen } from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api, OFFICE_PART_LABELS } from "@/lib/api";

export default function ChantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: chant, isLoading } = useQuery({
    queryKey: ["chant", id],
    queryFn: () => api.chants.get(Number(id)),
  });

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-stone-200 rounded w-1/4" />
          <div className="h-10 bg-stone-200 rounded w-2/3" />
          <div className="h-40 bg-stone-200 rounded" />
        </div>
      </div>
    );
  }

  if (!chant) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center py-20">
        <Music className="w-16 h-16 text-stone-300 mx-auto mb-4" />
        <p className="text-lg text-stone-500">Chant non trouvé.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Music className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-stone-900">
              {chant.incipit || "—"}
            </h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {chant.office_part && (
                <span className="inline-flex items-center text-xs font-medium bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                  {OFFICE_PART_LABELS[chant.office_part] || chant.office_part}
                </span>
              )}
              {chant.mode && (
                <span className="inline-flex items-center text-xs font-medium bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full">
                  Mode {chant.mode}
                  {chant.mode_var ? ` (${chant.mode_var})` : ""}
                </span>
              )}
              {chant.version && (
                <span className="inline-flex items-center text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                  {chant.version}
                </span>
              )}
              {chant.cantus_id && (
                <span className="inline-flex items-center text-xs font-mono bg-stone-50 text-stone-500 px-2.5 py-1 rounded-full">
                  Cantus {chant.cantus_id}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* GABC */}
          {chant.gabc && (
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wider mb-3">
                Notation GABC
              </h2>
              <pre className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-sm text-stone-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                {chant.gabc}
              </pre>
            </div>
          )}

          {/* Commentary */}
          {chant.commentary && (
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wider mb-3">
                Commentaire
              </h2>
              <p className="text-stone-700">{chant.commentary}</p>
            </div>
          )}

          {/* Remarks */}
          {chant.remarks && (
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wider mb-3">
                Remarques
              </h2>
              <p className="text-sm text-stone-600">{chant.remarks}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Tags */}
          {chant.tags.length > 0 && (
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-stone-400" />
                <h2 className="text-sm font-semibold text-stone-600">
                  Tags liturgiques
                </h2>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {chant.tags.map((t) => (
                  <Link
                    key={t.id}
                    to={`/chants?tag_id=${t.id}`}
                    className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full hover:bg-emerald-100 transition-colors"
                  >
                    {t.tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h2 className="text-sm font-semibold text-stone-600 mb-3">
              Informations
            </h2>
            <dl className="space-y-3 text-sm">
              {chant.transcriber && (
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <dt className="text-stone-400 text-xs">Transcripteur</dt>
                    <dd className="text-stone-700">{chant.transcriber}</dd>
                  </div>
                </div>
              )}
              {chant.cantus_id && (
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <dt className="text-stone-400 text-xs">Cantus ID</dt>
                    <dd className="text-stone-700 font-mono">
                      {chant.cantus_id}
                    </dd>
                  </div>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
