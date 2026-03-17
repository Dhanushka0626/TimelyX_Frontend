import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Bell,
  User,
  History,
  Users,
} from "lucide-react";

const DashboardLayout = ({ children, role }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* ROLE-BASED NAVIGATION*/

  const navigation = {
        student: {
      title: "Student Panel",
      links: [
        { to: "/student", label: "Dashboard", icon: LayoutDashboard, end: true },
        { to: "/student/timetable", label: "Timetable", icon: CalendarDays },
        { to: "/student/notices", label: "Notice Board", icon: Bell },
        { to: "/student/profile", label: "Profile", icon: User },
      ],
    },

        lecturer: {
      title: "Lecture Hall System",
      links: [
        { to: "/lecturer", label: "Dashboard", icon: LayoutDashboard, end: true },
        { to: "/lecturer/hall-availability", label: "Hall Availability", icon: CalendarDays },
        { to: "/lecturer/bookings", label: "My Bookings", icon: BookOpen },
        { to: "/lecturer/notices", label: "Notices", icon: Bell },
        { to: "/lecturer/profile", label: "Profile", icon: User },
      ],
    },

        hod: {
      title: "HOD Panel",
      links: [
        { to: "/hod", label: "Dashboard", icon: LayoutDashboard, end: true },
        { to: "/hod/hall-schedule", label: "Hall Schedule", icon: CalendarDays },
        { to: "/hod/history", label: "Approval History", icon: History },
            { to: "/hod/notices", label: "Notices", icon: Bell },
        { to: "/hod/profile", label: "Profile", icon: User },
      ],
    },

        to: {
      title: "TO Panel",
      links: [
        { to: "/to", label: "Dashboard", icon: LayoutDashboard, end: true },
        { to: "/to/pending-users", label: "Pending Users", icon: Users },
        { to: "/to/history", label: "Approval History", icon: History },
            { to: "/to/notices", label: "Notices", icon: Bell },
        { to: "/to/profile", label: "Profile", icon: User },
      ],
    },
  };

  const current = navigation[role];

  if (!current) {
    console.warn("Invalid role passed to DashboardLayout:", role);
    return <div>{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-20 left-4 z-50 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700"
        aria-label="Toggle mobile menu"
      >
        {mobileMenuOpen ? (
          <FiX size={24} className="text-gray-700 dark:text-slate-300" />
        ) : (
          <FiMenu size={24} className="text-gray-700 dark:text-slate-300" />
        )}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      {role === "lecturer" || role === "hod" || role === "to" || role === "student" ? (
        <aside className={`
          w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 p-6 transition-all
          md:block md:relative md:translate-x-0
          fixed inset-y-0 left-0 z-40 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <nav className="space-y-4 mt-16 md:mt-0">
            {current.links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "block bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-4 py-3 rounded-lg font-medium transition-colors"
                    : "block px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
      ) : (
        <aside className={`
          w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 px-6 py-8 flex flex-col transition-all
          md:flex md:relative md:translate-x-0
          fixed inset-y-0 left-0 z-40 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>

          {/* PANEL TITLE */}
          <h2 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-10 tracking-wide mt-16 md:mt-0">
            {current.title}
          </h2>

          {/* NAVIGATION */}
          <nav className="flex flex-col gap-2">
            {current.links.map((item) => (
              <div key={item.to} onClick={() => setMobileMenuOpen(false)}>
                <SidebarItem
                  to={item.to}
                  label={item.label}
                  Icon={item.icon}
                  end={item.end}
                />
              </div>
            ))}
          </nav>

        </aside>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <main className="p-4 sm:p-6 lg:p-10 dark:text-slate-100">
          {children}
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;

/* SIDEBAR ITEM */

const SidebarItem = ({ to, label, Icon, end }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200
        ${
          isActive
            ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-medium"
            : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-slate-100"
        }`
      }
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );
};