import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import timetableService from "../../services/timetableService";

const StudentTimetable = () => {
  const { user } = useContext(AuthContext);
  const studentId = user?.id || user?._id;

  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !studentId) return;

    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const data = await timetableService.getStudentTimetable(studentId);
        setTimetable(data);
      } catch (err) {
        setError("Failed to load timetable.");
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [user, studentId]);

  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      // allow DOM render
      setTimeout(() => {
        try {
          const hash = location.hash;
          if (hash) {
            const id = decodeURIComponent(hash.replace('#',''));
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            // scroll to today's day if present
            const todayName = new Date().toLocaleDateString(undefined, { weekday: 'long' });
            const el = document.getElementById(todayName);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } catch (e) {
          // ignore
        }
      }, 120);
    }
  }, [loading, location]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex transition-colors">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 p-6 hidden md:block transition-colors">
        <nav className="space-y-4">

          <Link
            to="/student"
            className="block px-4 py-3 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Dashboard
          </Link>

          <Link
            to="/student/timetable"
            className="block bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Timetable
          </Link>

          <Link
            to="/student/notices"
            className="block px-4 py-3 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Notice Board
          </Link>

          <Link
            to="/student/profile"
            className="block px-4 py-3 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Profile
          </Link>

        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8 text-gray-900 dark:text-slate-100">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
            Weekly Timetable
          </h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">
            Your personalized class schedule
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-8 transition-colors">

          {loading && (
            <p className="text-gray-500 dark:text-slate-400">Loading timetable...</p>
          )}

          {error && (
            <p className="text-red-500">{error}</p>
          )}

          {!loading && timetable.length === 0 && (
            <p className="text-gray-500 dark:text-slate-400">
              No timetable assigned yet.
            </p>
          )}

          {!loading &&
            timetable.map((dayItem) => (
              <div key={dayItem.day} id={dayItem.day} className="mb-10">

                {/* DAY TITLE */}
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-slate-100">
                  {dayItem.day}
                </h3>

                <div className="space-y-4">
                  {dayItem.classes.map((classItem) => (
                    <div
                      key={classItem.id}
                      className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 rounded-lg p-5 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-sm transition-colors"
                    >
                      <div className="text-indigo-600 dark:text-indigo-400 font-medium md:w-40">
                        {classItem.startTime} - {classItem.endTime}
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-slate-100">
                          {classItem.subject}
                        </h4>
                        <p className="text-gray-500 dark:text-slate-400 text-sm">
                          {classItem.hall} • {classItem.lecturer}
                        </p>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            ))}

        </div>

      </main>
    </div>
  );
};

export default StudentTimetable;