import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import bookingService from "../../services/bookingService";
import noticeService from "../../services/noticeService";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [todayClasses, setTodayClasses] = useState([]);
  const [weekClassesCount, setWeekClassesCount] = useState(0);
  const [notices, setNotices] = useState([]);
  const studentId = user?.id || user?._id;

  const todayName = new Date().toLocaleDateString(undefined, { weekday: "long" });
  const newNoticesLast7Days = notices.filter((n) => {
    try {
      return (Date.now() - new Date(n.date).getTime()) <= 7 * 24 * 60 * 60 * 1000;
    } catch (e) {
      return false;
    }
  }).length;

  useEffect(() => {
    if (!user || !studentId) return;

    const fetchData = async () => {
      try {
        const today = await bookingService.getTodayClasses(studentId);
        const week = await bookingService.getWeekClasses(studentId);
        const studentNotices = await noticeService.getStudentNotices(studentId);

        setTodayClasses(today);
        setWeekClassesCount(week.length);
        setNotices(studentNotices);
      } catch (error) {
        console.error("Dashboard data error:", error);
      }
    };

    fetchData();
  }, [user, studentId]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex transition-colors">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 p-6 hidden md:block transition-colors">
        <nav className="space-y-4">

          <Link
            to="/student"
            className="block bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Dashboard
          </Link>

          <Link
            to="/student/timetable"
            className="block px-4 py-3 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
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

        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-6">
          Student Dashboard
        </h1>

        {/* SUMMARY */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl shadow-sm transition-colors">
            <p className="text-gray-500 dark:text-slate-400">Today's Classes</p>
            <h2 className="text-3xl font-bold mt-2 text-gray-900 dark:text-slate-100">
              {todayClasses.length}
            </h2>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl shadow-sm transition-colors">
            <p className="text-gray-500 dark:text-slate-400">This Week Classes</p>
            <h2 className="text-3xl font-bold mt-2 text-gray-900 dark:text-slate-100">
              {weekClassesCount}
            </h2>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl shadow-sm transition-colors">
            <p className="text-gray-500 dark:text-slate-400">New Notices (last 7 days)</p>
            <h2 className="text-3xl font-bold mt-2 text-gray-900 dark:text-slate-100">
              {newNoticesLast7Days}
            </h2>
            <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Total: {notices.length}</p>
          </div>

        </div>

        {/* TODAY CLASSES */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-8 rounded-xl shadow-sm mb-10 transition-colors">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-slate-100">
            Today's Schedule
          </h2>

          {todayClasses.map((item) => (
            <div key={item.id} className="p-5 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 rounded-lg mb-4 transition-colors">
              <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                {item.time}
              </p>
              <h3 className="font-semibold text-gray-900 dark:text-slate-100">
                {item.subject}
              </h3>
              <p className="text-gray-500 dark:text-slate-400 text-sm">
                {item.hall} • {item.lecturer}
              </p>
            </div>
          ))}

          <div
            onClick={() => navigate(`/student/timetable#${todayName}`)}
            className="mt-6 text-center text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline"
          >
            View Full Timetable
          </div>
        </div>

      </main>
    </div>
  );
};

export default StudentDashboard;