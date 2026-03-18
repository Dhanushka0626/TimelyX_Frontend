import API from "../api/axiosClient";

const toService = {

  getDashboardSummary: async () => {
    const res = await API.get("/to/dashboard");
    return res.data;
  },

  getPendingUsers: async () => {
    const res = await API.get("/to/pending-users");
    return res.data;
  },

  updatePendingUser: async (id, payload) => {
    const res = await API.put(`/to/pending-users/${id}`, payload);
    return res.data;
  },

  approveUser: async (id, payload) => {
    const res = await API.put(`/to/approve/${id}`, payload);
    return res.data;
  },

  rejectUser: async (id, rejectionReason) => {
    const res = await API.put(`/to/reject/${id}`, { rejectionReason });
    return res.data;
  },

  getHistory: async () => {
    const res = await API.get("/to/history");
    return res.data;
  },

  getNotices: async () => {
    const res = await API.get("/to/notices");
    return res.data;
  },

  createNotice: async (data) => {
    const res = await API.post("/to/notices", data);
    return res.data;
  },

  updateNotice: async (id, data) => {
    const res = await API.put(`/to/notices/${id}`, data);
    return res.data;
  },

  deleteNotice: async (id) => {
    const res = await API.delete(`/to/notices/${id}`);
    return res.data;
  },

};

export default toService;