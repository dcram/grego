import { Music, Tag, BookOpen, Home } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", icon: Home, label: "Accueil" },
  { to: "/chants", icon: Music, label: "Chants" },
  { to: "/tags", icon: Tag, label: "Tags liturgiques" },
  { to: "/sources", icon: BookOpen, label: "Sources" },
];

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-stone-200 bg-white flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-600 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-stone-900 leading-tight">
                Grego
              </h1>
              <p className="text-xs text-stone-400">Chants grégoriens</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link-active" : "sidebar-link-inactive"}`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200">
          <p className="text-xs text-stone-400">
            Source : GregoBase
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
