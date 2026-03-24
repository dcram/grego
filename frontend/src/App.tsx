import { useQuery } from "@tanstack/react-query";
import { Route, Routes, Link } from "react-router-dom";
import { api } from "@/lib/api";

function ChantsPage() {
  const { data: chants, isLoading } = useQuery({
    queryKey: ["chants"],
    queryFn: api.chants.list,
  });

  if (isLoading)
    return <p className="p-6 text-gray-500">Chargement...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Chants</h2>
      {chants?.length === 0 && (
        <p className="text-gray-400">Aucun chant enregistré.</p>
      )}
      <ul className="space-y-2">
        {chants?.map((c) => (
          <li key={c.id} className="border rounded p-3">
            <span className="font-medium">{c.title}</span>
            <span className="ml-2 text-sm text-gray-500">
              {c.chant_type} {c.mode ? `(mode ${c.mode})` : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeastsPage() {
  const { data: feasts, isLoading } = useQuery({
    queryKey: ["feasts"],
    queryFn: api.feasts.list,
  });

  if (isLoading)
    return <p className="p-6 text-gray-500">Chargement...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Fêtes liturgiques</h2>
      {feasts?.length === 0 && (
        <p className="text-gray-400">Aucune fête enregistrée.</p>
      )}
      <ul className="space-y-2">
        {feasts?.map((f) => (
          <li key={f.id} className="border rounded p-3">
            <span className="font-medium">{f.name}</span>
            {f.latin_name && (
              <span className="ml-2 text-sm italic text-gray-500">
                {f.latin_name}
              </span>
            )}
            <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded">
              {f.season}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b px-6 py-3 flex gap-6 items-center">
        <Link to="/" className="text-lg font-bold">
          Grego
        </Link>
        <Link to="/chants" className="hover:underline">
          Chants
        </Link>
        <Link to="/feasts" className="hover:underline">
          Fêtes
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<ChantsPage />} />
        <Route path="/chants" element={<ChantsPage />} />
        <Route path="/feasts" element={<FeastsPage />} />
      </Routes>
    </div>
  );
}
