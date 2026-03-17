import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import hodService from "../../services/hodService";
import API from "../../api/axiosClient";
import {
  Plus,
  Edit3,
  Trash2,
  Send,
  Bell,
} from "lucide-react";

const HODNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [lecturers, setLecturers] = useState([]);
  const [selectedLecturers, setSelectedLecturers] = useState([]);
  const [studentBatch, setStudentBatch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  const [form, setForm] = useState({
    title: "",
    message: "",
    audience: "students",
    priority: "medium",
  });

  const [openedNoticeId, setOpenedNoticeId] = useState(null);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const autoOpenedNoticeIdRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    fetchNotices();
    // fetch lecturers for selection
    (async () => {
      try {
        const l = await hodService.getUsersByRole('LECTURER');
        setLecturers(l || []);
      } catch (e) {
        console.error('Failed to fetch lecturers for notices');
      }
    })();
  }, []);

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

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const data = await hodService.getNotices();
      setNotices(data || []);
    } catch (err) {
      console.error("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

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
        window.dispatchEvent(new Event('hodDashboardChange'));
      } catch (err) {
        console.error('Failed to mark notice as read:', err);
      }
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.message) return;

    try {
      const payload = {};
      payload.message = `${form.title}\n\n${form.message}`;

      if (form.audience === 'lecturers') {
        if (selectedLecturers && selectedLecturers.length) {
          payload.explicitReceivers = selectedLecturers;
        } else {
          payload.receiverRole = 'LECTURER';
        }
      } else if (form.audience === 'students') {
        if (studentBatch) payload.batch = studentBatch;
        else payload.receiverRole = 'STUDENT';
      } else if (form.audience === 'all') {
        // fetch both lecturers and students and send explicit list
        const l = await hodService.getUsersByRole('LECTURER');
        const s = await hodService.getUsersByRole('STUDENT');
        const ids = [];
        if (Array.isArray(l)) ids.push(...l.map(x => x.id));
        if (Array.isArray(s)) ids.push(...s.map(x => x.id));
        payload.explicitReceivers = ids;
      }

      if (editingNotice) {
        await hodService.updateNotice(editingNotice.id, { message: payload.message });
      } else {
        await hodService.createNotice(payload);
      }

      resetModal();
      fetchNotices();
    } catch (err) {
      console.error("Submit failed");
    }
  };

  const handleDelete = async (id) => {
    await hodService.deleteNotice(id);
    fetchNotices();
  };

  const resetModal = () => {
    setShowModal(false);
    setEditingNotice(null);
    setForm({
      title: "",
      message: "",
      audience: "students",
      priority: "medium",
    });
    setSelectedLecturers([]);
    setStudentBatch("");
  };

  const openEdit = (notice) => {
    setEditingNotice(notice);
    setForm({
      title: notice.title || '',
      message: notice.message || '',
      audience: 'students',
      priority: notice.priority || 'medium'
    });
    setShowModal(true);
  };

  const incomingNotices = notices.filter(n => n.isIncoming);
  const publishedNotices = notices.filter(n => !n.isIncoming);

  return (
    <DashboardLayout role="hod">

      <div className="space-y-10">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-slate-100">
              Notice Management
            </h1>
            <p className="text-gray-500 dark:text-slate-400 mt-2">
              Manage incoming notifications and publish announcements
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition"
          >
            <Plus size={18} />
            Post New Notice
          </button>
        </div>

        {/* RECEIVED NOTICES */}
        {incomingNotices.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Received Notices</h2>
            <div className="space-y-4">
              {incomingNotices.map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => handleViewNotice(notice.id)}
                  className={`border rounded-2xl p-6 cursor-pointer transition ${
                    notice.isRead
                      ? 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700'
                      : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                  } hover:shadow-sm`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                        {notice.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                        From: {notice.author || 'Unknown'}
                      </p>
                    </div>
                    {!notice.isRead && (
                      <span className="px-3 py-1 bg-amber-600 text-white text-xs rounded-full font-medium">
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                    {notice.message}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-slate-500 mt-4">
                    {new Date(notice.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PUBLISHED NOTICES */}
        {loading ? (
          <p className="text-gray-500 dark:text-slate-400">Loading notices...</p>
        ) : publishedNotices.length === 0 ? (
          <p className="text-gray-500 dark:text-slate-400">No published notices yet.</p>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Published Notices</h2>
            <div className="space-y-6">
              {publishedNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6 transition-colors"
                >

                  <div className="flex justify-between items-start">

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                        {notice.title}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                        To {notice.receiverCount} recipient(s)
                      </p>
                    </div>

                    <span
                      className={`px-4 py-1 text-xs rounded-full font-medium
                        ${
                          notice.priority === "high"
                            ? "bg-red-100 text-red-600"
                            : notice.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                    >
                      {notice.priority || 'medium'}
                    </span>

                  </div>

                  <p className="mt-4 text-gray-700 dark:text-slate-300 leading-relaxed">
                    {notice.message}
                  </p>

                  <div className="flex justify-between items-center mt-6 text-sm">

                    <p className="text-gray-400 dark:text-slate-500">
                      Posted on {new Date(notice.date).toLocaleDateString()}
                    </p>

                    <div className="flex gap-6 items-center">

                      <button
                        onClick={() => openEdit(notice)}
                        className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <Edit3 size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(notice.id)}
                        className="flex items-center gap-1 text-red-600 hover:underline"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>

                    </div>

                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

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

        {showModal && (
          <NoticeModal
            form={form}
            setForm={setForm}
            editingNotice={editingNotice}
            onClose={resetModal}
            onSubmit={handleSubmit}
            lecturers={lecturers}
            selectedLecturers={selectedLecturers}
            setSelectedLecturers={setSelectedLecturers}
            studentBatch={studentBatch}
            setStudentBatch={setStudentBatch}
          />
        )}

      </div>
    </DashboardLayout>
  );
};

export default HODNotices;


const NoticeModal = ({ form, setForm, editingNotice, onClose, onSubmit, lecturers, selectedLecturers, setSelectedLecturers, studentBatch, setStudentBatch }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl w-full max-w-xl p-8 space-y-6 shadow-2xl transition-colors">

        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
          {editingNotice ? "Edit Notice" : "Create Notice"}
        </h2>

        <input
          type="text"
          placeholder="Notice Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 transition-colors"
        />

        <textarea
          rows="4"
          placeholder="Notice Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 transition-colors"
        />

        <div className="grid grid-cols-2 gap-4">

          <select
            value={form.audience}
            onChange={(e) => setForm({ ...form, audience: e.target.value })}
            className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2 transition-colors"
          >
            <option value="students">Students</option>
            <option value="lecturers">Lecturers</option>
            <option value="all">All</option>
          </select>

          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2 transition-colors"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

        </div>

        {/* Recipient selection */}
        {form.audience === 'lecturers' || form.audience === 'all' ? (
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">Select Lecturers</p>
            <div className="max-h-40 overflow-auto border border-gray-300 dark:border-slate-600 rounded p-2 grid grid-cols-2 gap-2">
              {Array.isArray(lecturers) && lecturers.length ? lecturers.map(l => (
                <label key={l.id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
                  <input type="checkbox" checked={selectedLecturers.includes(l.id)} onChange={(e) => {
                    if (e.target.checked) setSelectedLecturers([...selectedLecturers, l.id]);
                    else setSelectedLecturers(selectedLecturers.filter(id => id !== l.id));
                  }} />
                  <span>{l.name || l.email}</span>
                </label>
              )) : (
                <p className="text-sm text-gray-400 dark:text-slate-500">No lecturers found</p>
              )}
            </div>
          </div>
        ) : null}

        {form.audience === 'students' || form.audience === 'all' ? (
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">Target Student Batch (e.g. 2024) — leave empty to target all students</p>
            <input value={studentBatch} onChange={(e) => setStudentBatch(e.target.value)} placeholder="Batch or leave empty" className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2 transition-colors" />
          </div>
        ) : null}

        <div className="flex justify-end gap-4 pt-4">

          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg hover:opacity-90"
          >
            <Send size={16} />
            {editingNotice ? "Update" : "Publish"}
          </button>

        </div>

      </div>
    </div>
  );
};