import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  History,
  Bell,
  User,
} from "lucide-react";

const TOLayout = () => {
  const links = [
    { to: "/to", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/to/pending-users", label: "Pending Users", icon: Users },
    { to: "/to/history", label: "Approval History", icon: History },
    { to: "/to/notices", label: "Notices", icon: Bell },
    { to: "/to/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">

      {/* SIDEBAR - student style */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 p-6 hidden md:block transition-colors">
        <nav className="space-y-4">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive
                  ? "block bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-4 py-3 rounded-lg font-medium transition-colors"
                  : "block px-4 py-3 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 text-gray-900 dark:text-slate-100">
        <Outlet />
      </main>

    </div>
  );
};

export default TOLayout;