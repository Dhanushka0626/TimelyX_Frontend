import API from "../api/axiosClient";

/*const lecturerService = {
  getDashboardSummary: async (lecturerId) => {
    const response = await API.get(
      `/lecturer/${lecturerId}/dashboard-summary`
    );
    return response.data;
  },

  getRecentBookings: async (lecturerId) => {
    const response = await API.get(
      `/lecturer/${lecturerId}/recent-bookings`
    );
    return response.data;
  },
};

export default lecturerService;*/









// src/services/lecturerService.js


const isBackendAvailable = true; 

const lecturerService = {

  getDashboardSummary: async (lecturerId) => {
    if (!isBackendAvailable) {
      return { pendingRequests: 0, approvedBookings: 0, activeNotices: 0, monthlyBookings: 0 };
    }

    // backend exposes /dashboard for current user
    const resp = await API.get(`/dashboard`);
    // fetch notifications list so dashboard 'activeNotices' matches the Notices page
    const notes = await API.get(`/notifications`);
    const data = resp.data || {};
    return {
      pendingRequests: data.pending || 0,
      approvedBookings: data.approved || 0,
      activeNotices: Array.isArray(notes?.data) ? notes.data.length : (notes?.data?.unreadCount ?? 0),
      monthlyBookings: data.approved || 0
    };
  },

  getRecentBookings: async (lecturerId) => {
    if (!isBackendAvailable) return [];

    const response = await API.get(`/bookings`);
    const bookings = response.data || [];
    // map booking objects to UI shape and normalize statuses to Title case
    const normalizeStatus = (s) => {
      if (!s) return "Pending";
      const lower = String(s).toLowerCase();
      if (lower === 'approved') return 'Approved';
      if (lower === 'rejected') return 'Rejected';
      return 'Pending';
    };

    return bookings.map(b => ({
      id: b._id,
      subject: b.subject,
      hall: b.timeSlot && b.timeSlot.hall ? (b.timeSlot.hall.name || b.timeSlot.hall) : null,
      date: b.timeSlot ? b.timeSlot.date : null,
      time: b.timeSlot ? b.timeSlot.startTime : null,
      status: normalizeStatus(b.status)
    }));
  },

  searchAvailableHalls: async ({ date, startTime, endTime, capacity }) => {
    if (!isBackendAvailable) return [];
    const response = await API.post(`/lecture-halls/search`, { date, startTime, endTime, capacity });
    return response.data;
  },

  bookHall: async ({ hallId, date, startTime, endTime, subject, targetBatch, capacity }) => {
    if (!isBackendAvailable) return { message: 'ok' };
    const body = { hallId, date, startTime, endTime, subject };
    if (targetBatch) body.targetBatch = targetBatch;
    if (capacity) body.capacity = capacity;
    const response = await API.post(`/bookings/range`, body);
    return response.data;
  }

};

export default lecturerService;