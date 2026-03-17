import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Plus, Edit3, Trash2, Send, Bell, Users, MessageSquare, Calendar, Eye } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import toService from "../../services/toService";
import API from "../../api/axiosClient";
import { useToast } from "../../hooks/useToast";
import { useConfirm } from "../../hooks/useConfirm.jsx";

const TONotices = () => {
  const toast = useToast();
  const { confirm } = useConfirm();
  const location = useLocation();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    message: "",
    receiverRole: "all",
    batch: "",
  });

  const autoOpenedNoticeIdRef = useRef("");

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await toService.getNotices();
      setNotices(data || []);
    } catch (error) {
      console.error("Failed to fetch notices:", error);
      setError("Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  const receivedNotices = notices.filter((notice) => notice.isIncoming);

  const publishedNotices = notices.filter((notice) => !notice.isIncoming);

  const handleViewRequest = async (notice) => {
    setSelectedNotice(notice);
    if (notice.isRead) {
      return;
    }

    // Mark as read when viewing
    try {
      await API.put(`/notifications/${notice.id}/read`);
      setNotices((prev) =>
        prev.map((item) =>
          item.id === notice.id ? { ...item, isRead: true } : item
        )
      );
      window.dispatchEvent(new Event("toDashboardChange"));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const noticeId = params.get("noticeId");

    if (!noticeId || loading || autoOpenedNoticeIdRef.current === noticeId) {
      return;
    }

    const targetNotice = receivedNotices.find((notice) => String(notice.id) === String(noticeId));
    if (!targetNotice) {
      return;
    }

    autoOpenedNoticeIdRef.current = noticeId;
    handleViewRequest(targetNotice);
  }, [location.search, loading, receivedNotices]);

  const handleSubmit = async () => {
    if (!form.title) {
      toast.warning("Title is required");
      return;
    }
    
    if (!form.message) {
      toast.warning("Message is required");
      return;
    }

    try {
      if (editingNotice) {
        await toService.updateNotice(editingNotice.id, {
          title: form.title,
          message: form.message
        });
        toast.success("Notice updated successfully!");
      } else {
        await toService.createNotice({
          title: form.title,
          message: form.message,
          receiverRole: form.receiverRole,
          batch: form.batch
        });
        toast.success("Notice published successfully!");
      }

      resetModal();
      fetchNotices();
    } catch (error) {
      toast.error("Failed to publish notice. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirm("Are you sure you want to delete this notice?", {
      confirmText: "Delete",
      cancelText: "Cancel",
      danger: true,
    });
    
    if (!confirmed) return;

    try {
      await toService.deleteNotice(id);
      toast.success("Notice deleted successfully!");
      fetchNotices();
    } catch (error) {
      toast.error("Failed to delete notice. Please try again.");
    }
  };

  const resetModal = () => {
    setShowModal(false);
    setEditingNotice(null);
    setForm({ title: "", message: "", receiverRole: "all", batch: "" });
  };

  return (
    <DashboardLayout role="to">
      <div className="space-y-6">

        {/* HEADER  */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
              Notice Management
            </h1>
            <p className="text-gray-500 dark:text-slate-400 mt-2">
              Create and manage notices for students, lecturers, and staff
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg font-medium"
          >
            <Plus size={20} />
            Create Notice
          </button>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400 font-medium">Total Notices</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-1">{publishedNotices.length}</p>
              </div>
              <div className="bg-indigo-100 rounded-full p-3">
                <Bell className="text-indigo-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400 font-medium">Published This Month</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-1">
                  {publishedNotices.filter(n => {
                    const noticeDate = new Date(n.date);
                    const now = new Date();
                    return noticeDate.getMonth() === now.getMonth() && 
                           noticeDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <Calendar className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400 font-medium">Total Recipients</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-1">
                  {publishedNotices.reduce((sum, n) => sum + (n.receiverCount || 0), 0)}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400 font-medium">Received Notices</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-1">{receivedNotices.length}</p>
              </div>
              <div className="bg-amber-100 rounded-full p-3">
                <Users className="text-amber-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3">
            {success}
          </div>
        ) : null}

        {/* RECEIVED NOTICES */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm transition-colors">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Received Notices</h3>
          </div>

          <div className="p-6 space-y-4">
            {loading ? (
              <p className="text-gray-500 dark:text-slate-400">Loading received notices...</p>
            ) : receivedNotices.length === 0 ? (
              <p className="text-gray-500 dark:text-slate-400">No received notices.</p>
            ) : (
              receivedNotices.map((notice) => {
                const user = notice.targetUser || notice.senderUser || {};
                return (
                  <div key={notice.id} className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 rounded-xl p-5 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{new Date(notice.date).toLocaleString()}</p>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mt-1">
                          {notice.title || `${user.firstName || "User"} ${user.lastName || ""}`.trim()}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">{notice.message}</p>
                        {notice.category === "SIGNUP_REQUEST" ? (
                          <p className="text-sm text-gray-700 dark:text-slate-300 mt-2">Requested role: <span className="font-medium">{user.requestedRole || "STUDENT"}</span></p>
                        ) : null}
                        {!notice.isRead ? (
                          <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                            Unread
                          </span>
                        ) : null}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewRequest(notice)}
                          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* NOTICE LIST */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm transition-colors">
          
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Published Notices</h3>
          </div>

          <div className="p-6 space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
                <p className="text-gray-500 dark:text-slate-400 mt-3">Loading notices...</p>
              </div>
            ) : publishedNotices.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No notices published yet</p>
                <p className="text-sm mt-1">Click "Create Notice" to publish your first notice</p>
              </div>
            ) : (
              publishedNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 rounded-xl p-6 hover:shadow-md transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-indigo-100 dark:bg-indigo-900/40 rounded-full p-2">
                          <Bell size={18} className="text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                            {notice.title || "Notice"}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-slate-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(notice.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users size={12} />
                              {notice.receiverCount || 0} recipient{notice.receiverCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {notice.canEdit ? (
                        <>
                          <button
                            onClick={() => {
                              setEditingNotice(notice);
                              setForm({
                                title: notice.title || "",
                                message: notice.message || "",
                                receiverRole: "all",
                                batch: "",
                              });
                              setShowModal(true);
                            }}
                            className="p-2 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg transition-colors"
                            title="Edit notice"
                          >
                            <Edit3 size={18} />
                          </button>

                          <button
                            onClick={() => handleDelete(notice.id)}
                            className="p-2 text-gray-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                            title="Delete notice"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      ) : null}
                    </div>

                  </div>

                  <div className="ml-11 mt-3">
                    <p className="text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {notice.message}
                    </p>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>

        {/* MODAL */}
        {showModal && (
          <NoticeModal
            form={form}
            setForm={setForm}
            editingNotice={editingNotice}
            onClose={resetModal}
            onSubmit={handleSubmit}
          />
        )}

        {selectedNotice && (
          <RequestDetailsModal
            notice={selectedNotice}
            onClose={() => setSelectedNotice(null)}
          />
        )}

      </div>
    </DashboardLayout>
  );
};

export default TONotices;

const NoticeModal = ({ form, setForm, editingNotice, onClose, onSubmit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transition-colors">

        {/* HEADER */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 rounded-t-2xl">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
            {editingNotice ? "Edit Notice" : "Create New Notice"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            {editingNotice ? "Update the notice content" : "Compose and send a notice to users"}
          </p>
        </div>

        <div className="px-6 py-6 space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Notice Title (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Important System Update"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="6"
              placeholder="Enter your notice message here..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
              required
            />
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              {form.message.length} characters
            </p>
          </div>

          {/* Recipients Section - Only show when creating new notice */}
          {!editingNotice && (
            <div className="border-t border-gray-200 dark:border-slate-700 pt-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Recipients</h3>

              {/* Recipient Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Send To
                </label>
                <select
                  value={form.receiverRole}
                  onChange={(e) => setForm({ ...form, receiverRole: e.target.value, batch: "" })}
                  className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="all">All Users</option>
                  <option value="STUDENT">All Students</option>
                  <option value="LECTURER">All Lecturers</option>
                  <option value="HOD">All HODs</option>
                  <option value="TO">All TOs</option>
                </select>
              </div>

              {/* Batch Filter - Only for students */}
              {form.receiverRole === "STUDENT" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Specific Batch (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 2023, 2024"
                    value={form.batch}
                    onChange={(e) => setForm({ ...form, batch: e.target.value })}
                    className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                    Leave empty to send to all students
                  </p>
                </div>
              )}

              {/* Preview Recipients */}
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-700">
                  <Users size={16} />
                  <span className="text-sm font-medium">
                    {form.receiverRole === "all" 
                      ? "This notice will be sent to all users in the system"
                      : form.receiverRole === "STUDENT" && form.batch
                      ? `This notice will be sent to students in batch ${form.batch}`
                      : `This notice will be sent to all ${form.receiverRole.toLowerCase()}s`
                    }
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-700 px-6 py-4 rounded-b-2xl flex gap-3 justify-end transition-colors">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            <Send size={18} />
            {editingNotice ? "Update Notice" : "Publish Notice"}
          </button>
        </div>

      </div>
    </div>
  );
};

const RequestDetailsModal = ({ notice, onClose }) => {
  const user = notice.targetUser || notice.senderUser || {};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[98vh] sm:max-h-[95vh] overflow-hidden transition-colors">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-slate-700 flex items-start justify-between gap-4 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100 break-words">
              {notice.title || "Sign-up Request Details"}
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {notice.category && (
                <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                  {notice.category}
                </span>
              )}
              {notice.isRead && (
                <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                  Read
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 text-3xl leading-none flex-shrink-0"
          >
            x
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 min-h-0 space-y-6">
          {notice.message && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-slate-300 mb-2">Notification</h3>
              <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg text-gray-700 dark:text-slate-300 whitespace-pre-wrap break-words text-sm leading-relaxed">
                {notice.message}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-slate-300 mb-3">Sign-up Request Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg min-w-0">
                <span className="text-gray-500 block text-xs font-medium">First Name</span>
                <span className="font-medium text-gray-900 block mt-1 break-words">{user.firstName || "-"}</span>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg min-w-0">
                <span className="text-gray-500 block text-xs font-medium">Last Name</span>
                <span className="font-medium text-gray-900 block mt-1 break-words">{user.lastName || "-"}</span>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg min-w-0">
                <span className="text-gray-500 block text-xs font-medium">Email</span>
                <span className="font-medium text-gray-900 block mt-1 break-all text-xs">{user.email || "-"}</span>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg min-w-0">
                <span className="text-gray-500 block text-xs font-medium">Username</span>
                <span className="font-medium text-gray-900 block mt-1 break-words">{user.username || "-"}</span>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg min-w-0">
                <span className="text-gray-500 block text-xs font-medium">Requested Role</span>
                <span className="font-medium text-gray-900 block mt-1 break-words">{user.requestedRole || "STUDENT"}</span>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg min-w-0">
                <span className="text-gray-500 block text-xs font-medium">Department</span>
                <span className="font-medium text-gray-900 block mt-1 break-words">{user.department || "-"}</span>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg min-w-0">
                <span className="text-gray-500 block text-xs font-medium">Designation</span>
                <span className="font-medium text-gray-900 block mt-1 break-words">{user.designation || "-"}</span>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg min-w-0">
                <span className="text-gray-500 block text-xs font-medium">Batch</span>
                <span className="font-medium text-gray-900 block mt-1 break-words">{user.batch || "-"}</span>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg min-w-0">
                <span className="text-gray-500 block text-xs font-medium">Semester</span>
                <span className="font-medium text-gray-900 block mt-1 break-words">{user.semester || "-"}</span>
              </div>
              <div className="md:col-span-2 bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg min-w-0">
                <span className="text-gray-500 block text-xs font-medium">Courses</span>
                <span className="font-medium text-gray-900 block mt-1 break-words">
                  {Array.isArray(user.courses) && user.courses.length > 0 ? user.courses.join(", ") : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm flex-shrink-0 transition-colors">
          <div className="min-w-0">
            <p className="text-gray-500 font-medium text-xs sm:text-sm">From</p>
            <p className="text-gray-900 mt-1 break-words text-sm">{notice.author || "Unknown"}</p>
          </div>
          <div className="min-w-0">
            <p className="text-gray-500 font-medium text-xs sm:text-sm">Sent Date</p>
            <p className="text-gray-900 mt-1 break-words text-sm">{new Date(notice.date).toLocaleString()}</p>
          </div>
          <div className="min-w-0">
            <p className="text-gray-500 font-medium text-xs sm:text-sm">Category</p>
            <p className="text-gray-900 mt-1 break-words text-sm">{notice.category || "General"}</p>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 flex justify-end flex-shrink-0 transition-colors">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition font-medium text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};