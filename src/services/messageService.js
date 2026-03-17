import API from '../api/axiosClient';

const messageService = {
  // returns array of notifications from backend, mapped to { id, title, content, createdAt, read }
  fetchMessages: async () => {
    const res = await API.get('/notifications');
    const data = res.data || [];
    const stored = (() => {
      try { return JSON.parse(localStorage.getItem('user')) || {}; } catch (e) { return {}; }
    })();
    const currentUserId = stored.id || stored._id || null;
    return data.map(n => ({
      id: n._id,
      title: n.message && n.message.length > 50 ? n.message.slice(0,50) + '...' : (n.message || 'Notice'),
      body: n.message,
      createdAt: n.createdAt,
      read: Array.isArray(n.readBy) && currentUserId ? n.readBy.map(String).includes(String(currentUserId)) : false,
      from: n.sender ? ((n.sender.firstName || '') + ' ' + (n.sender.lastName || '')).trim() : 'System'
    })).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  markRead: async (id) => {
    await API.put(`/notifications/${id}/read`);
    return true;
  },

  markAllRead: async () => {
    const res = await API.get('/notifications');
    const data = res.data || [];
    const promises = data.map(n => API.put(`/notifications/${n._id}/read`).catch(() => null));
    await Promise.all(promises);
    return true;
  },

  // returns number (promise)
  getUnreadCount: async () => {
    const res = await API.get('/notifications/unread-count');
    return res.data && typeof res.data.unreadCount === 'number' ? res.data.unreadCount : 0;
  }
};

export default messageService;
