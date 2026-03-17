import { useContext, useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import noticeService from "../../services/noticeService";
import API from "../../api/axiosClient";

const StudentNotices = () => {
  const { user } = useContext(AuthContext);
  const studentId = user?.id || user?._id;
  const location = useLocation();

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [openedNoticeId, setOpenedNoticeId] = useState(null);
  const autoOpenedNoticeIdRef = useRef(null);

  useEffect(() => {
    if (!user || !studentId) return;

    const fetchNotices = async () => {
      try {
        setLoading(true);
        const data = await noticeService.getStudentNotices(studentId);
        setNotices(data);
      } catch (err) {
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();

    const refresh = () => fetchNotices();
    const interval = setInterval(refresh, 15000);
    window.addEventListener('focus', refresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', refresh);
    };
  }, [user, studentId]);

  // Auto-open notice from URL param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const noticeId = params.get('noticeId');
    if (noticeId && autoOpenedNoticeIdRef.current !== noticeId) {
      autoOpenedNoticeIdRef.current = noticeId;
      setOpenedNoticeId(noticeId);
      handleViewNotice(noticeId);
    }
  }, [location.search]);

  const handleViewNotice = async (noticeId) => {
    const notice = notices.find(n => n.id === noticeId);
    if (!notice) return;

    // Set selected notice to display in modal
    setSelectedNotice(notice);

    // Mark as read if not already
    if (!notice.isRead) {
      try {
        await API.put(`/notifications/${noticeId}/read`);
        // Update local state
        setNotices(notices.map(n => 
          n.id === noticeId ? { ...n, isRead: true } : n
        ));
        // Notify navbar to refresh badge count
        window.dispatchEvent(new Event('studentDashboardChange'));
      } catch (err) {
        console.error('Failed to mark notice as read:', err);
      }
    }
  };

  const priorityStyles = {
    high: "border-l-4 border-red-500 bg-red-50 dark:bg-red-950/30",
    medium: "border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30",
    low: "border-l-4 border-green-500 bg-green-50 dark:bg-green-950/30",
  };

  const badgeStyles = {
    high: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300",
    medium: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300",
    low: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
  };

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
            className="block px-4 py-3 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Timetable
          </Link>

          <Link
            to="/student/notices"
            className="block bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-4 py-3 rounded-lg font-medium transition-colors"
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

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 text-gray-900 dark:text-slate-100">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
            Notice Board
          </h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">
            Important announcements and updates related to your schedule
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-8 transition-colors">

          {loading && (
            <p className="text-gray-500 dark:text-slate-400">Loading notifications...</p>
          )}

          {error && (
            <p className="text-red-500">{error}</p>
          )}

          {!loading && notices.length === 0 && (
            <p className="text-gray-500 dark:text-slate-400">
              No notifications available.
            </p>
          )}

          <div className="space-y-6">
            {!loading &&
              notices.map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => handleViewNotice(notice.id)}
                  className={`p-6 rounded-xl cursor-pointer transition ${
                    notice.isRead
                      ? (priorityStyles[notice.priority] || "bg-gray-50 dark:bg-slate-900/40")
                      : "bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                        {notice.title}
                      </h3>

                      <div className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                        {new Date(notice.date).toLocaleDateString()} • By {notice.author}

                        {!notice.isRead && (
                          <span className="ml-3 text-xs px-3 py-1 rounded-full bg-amber-600 dark:bg-amber-500 text-white font-medium">
                            New
                          </span>
                        )}

                        <span
                          className={`ml-3 text-xs px-3 py-1 rounded-full ${
                            badgeStyles[notice.priority] || "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {notice.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                    {notice.message}
                  </p>
                </div>
              ))}
          </div>

          {/* DETAIL MODAL */}
          {selectedNotice && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden transition-colors">
                {/* HEADER */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-start gap-4 flex-shrink-0">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100 break-words">
                      {selectedNotice.title || 'Notification'}
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedNotice.category && (
                        <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                          {selectedNotice.category}
                        </span>
                      )}
                      {selectedNotice.isRead && (
                        <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                          Read
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedNotice(null)}
                    className="text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 text-3xl font-light"
                  >
                    ×
                  </button>
                </div>

                {/* METADATA */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm flex-shrink-0 transition-colors">
                  <div className="min-w-0">
                    <p className="text-gray-500 dark:text-slate-400 font-medium text-xs sm:text-sm">From</p>
                    <p className="text-gray-900 dark:text-slate-100 mt-1 break-words text-sm">{selectedNotice.author || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-slate-400 font-medium">Sent Date</p>
                    <p className="text-gray-900 dark:text-slate-100 mt-1">{new Date(selectedNotice.date).toLocaleString()}</p>
                  </div>
                  {selectedNotice.readAt && (
                    <div>
                      <p className="text-gray-500 dark:text-slate-400 font-medium">Read Date</p>
                      <p className="text-gray-900 dark:text-slate-100 mt-1">{new Date(selectedNotice.readAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {/* CONTENT - SCROLLABLE */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 min-h-0">
                  <div className="text-gray-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words word-break">
                    {selectedNotice.message}
                  </div>
                </div>

                {/* FOOTER */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 flex justify-end gap-3 flex-shrink-0 transition-colors">
                  <button
                    onClick={() => setSelectedNotice(null)}
                    className="px-4 sm:px-6 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition font-medium text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </main>
    </div>
  );
};

export default StudentNotices;