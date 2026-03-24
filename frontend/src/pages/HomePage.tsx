import { useQuery } from "@tanstack/react-query";
import { Music, Tag, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";

function StatCard({
  icon: Icon,
  label,
  value,
  to,
  color,
}: {
  icon: typeof Music;
  label: string;
  value: number | undefined;
  to: string;
  color: string;
}) {
  return (
    <Link
      to={to}
      className="bg-white rounded-xl border border-stone-200 p-6 hover:shadow-md transition-shadow group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
      </div>
      <p className="text-3xl font-bold text-stone-900">
        {value !== undefined ? value.toLocaleString() : "..."}
      </p>
      <p className="text-sm text-stone-500 mt-1">{label}</p>
    </Link>
  );
}

export default function HomePage() {
  const { data: chants } = useQuery({
    queryKey: ["chants", { limit: 1 }],
    queryFn: () => api.chants.list({ limit: 200 }),
  });
  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: () => api.tags.list(),
  });
  const { data: sources } = useQuery({
    queryKey: ["sources"],
    queryFn: () => api.sources.list(),
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900">
          Répertoire grégorien
        </h1>
        <p className="text-stone-500 mt-2">
          Explorez le répertoire des chants grégoriens de la liturgie
          traditionnelle, issu de la base GregoBase.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={Music}
          label="Chants"
          value={chants?.length}
          to="/chants"
          color="bg-amber-600"
        />
        <StatCard
          icon={Tag}
          label="Tags liturgiques"
          value={tags?.length}
          to="/tags"
          color="bg-emerald-600"
        />
        <StatCard
          icon={BookOpen}
          label="Sources"
          value={sources?.length}
          to="/sources"
          color="bg-blue-600"
        />
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="text-lg font-semibold text-stone-900 mb-3">
          Recherche rapide
        </h2>
        <p className="text-sm text-stone-500 mb-4">
          Recherchez un chant par son incipit, filtrez par type (Introït,
          Graduel, Alléluia...) ou par mode.
        </p>
        <Link
          to="/chants"
          className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
        >
          <Music className="w-4 h-4" />
          Explorer les chants
        </Link>
      </div>
    </div>
  );
}
