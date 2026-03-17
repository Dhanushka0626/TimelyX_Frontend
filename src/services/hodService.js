import API from "../api/axiosClient";

const mapBookingToHistoryItem = (b) => {
  const ts = b.timeSlot || {};
  const hall = ts.hall || {};
  return {
    id: b.requestId || b._id,
    courseName: b.subject || b.courseName || "",
    hallName: hall.name || (b.hall && b.hall.name) || "",
    date: ts.date || b.date || "",
    startTime: ts.startTime || b.startTime || "",
    endTime: ts.endTime || b.endTime || "",
    students: b.targetBatch ? `Batch: ${b.targetBatch}` : (b.students || b.studentCount || "-"),
    decisionDate: b.updatedAt || b.decisionDate || null,
    status: (b.status || "").toString().toLowerCase(),
    rejectionReason: b.rejectionReason || "",
  };
};

const hodService = {

  getDashboardSummary: async () => {
    const res = await API.get("/hod/dashboard");
    return res.data;
  },

  getPendingRequests: async () => {
    const res = await API.get("/hod/pending");
    return res.data;
  },

  getRequests: async (status = 'PENDING') => {
    const res = await API.get(`/hod/requests?status=${encodeURIComponent(status)}`);
    const raw = res.data || [];
    return raw.map(mapBookingToHistoryItem);
  },

  updateRequestStatus: async (id, status, rejectionReason = "") => {
    const body = { status };
    if (status === "REJECTED") {
      body.rejectionReason = rejectionReason;
    }
    const res = await API.put(`/hod/request/${id}`, body);
    return res.data;
  },

  getHistory: async () => {
    const res = await API.get("/hod/history");
    const raw = res.data || [];
    return raw.map(mapBookingToHistoryItem);
  },

  getNotices: async () => {
    const res = await API.get("/hod/notices");
    return res.data;
  },

  getUsersByRole: async (role) => {
    const res = await API.get(`/users/by-role/${role}`);
    return res.data;
  },

  createNotice: async (data) => {
    const res = await API.post("/hod/notices", data);
    return res.data;
  },

  updateNotice: async (id, data) => {
    const res = await API.put(`/hod/notices/${id}`, data);
    return res.data;
  },

  deleteNotice: async (id) => {
    const res = await API.delete(`/hod/notices/${id}`);
    return res.data;
  },

  sendDecisionNotification: async ({ lecturerId, bookingId, status }) => {
    const res = await API.post("/hod/decision-notification", {
      lecturerId,
      bookingId,
      status,
    });
    return res.data;
  },

  bookHall: async (data) => {
    const res = await API.post("/hod/book-hall", data);
    return res.data;
  }

};

export default hodService;