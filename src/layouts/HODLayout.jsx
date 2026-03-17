import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  History,
  Bell,
  User,
} from "lucide-react";

const HODLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">

      {/* SIDEBAR - student style */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 p-6 hidden md:block transition-colors">
        <nav className="space-y-4">

          <NavLink
            to="/hod"
            end
            className={({ isActive }) =>
              isActive
                ? "block bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-4 py-3 rounded-lg font-medium transition-colors"
                : "block px-4 py-3 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/hod/hall-schedule"
            className={({ isActive }) =>
              isActive
                ? "block bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-4 py-3 rounded-lg font-medium transition-colors"
                : "block px-4 py-3 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            }
          >
            Hall Schedule
          </NavLink>

          <NavLink
            to="/hod/history"
            className={({ isActive }) =>
              isActive
                ? "block bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-4 py-3 rounded-lg font-medium transition-colors"
                : "block px-4 py-3 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            }
          >
            History
          </NavLink>

          <NavLink
            to="/hod/notices"
            className={({ isActive }) =>
              isActive
                ? "block bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-4 py-3 rounded-lg font-medium transition-colors"
                : "block px-4 py-3 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            }
          >
            Notices
          </NavLink>

          <NavLink
            to="/hod/profile"
            className={({ isActive }) =>
              isActive
                ? "block bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-4 py-3 rounded-lg font-medium transition-colors"
                : "block px-4 py-3 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            }
          >
            Profile
          </NavLink>

        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-8 text-gray-900 dark:text-slate-100">
        <Outlet />
      </main>

    </div>
  );
};

const SidebarItem = ({ to, icon, label, end }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg transition
      ${
        isActive
          ? "bg-indigo-50 text-indigo-600 font-medium"
          : "text-gray-600 hover:bg-gray-100"
      }`
    }
  >
    {icon}
    {label}
  </NavLink>
);

export default HODLayout;