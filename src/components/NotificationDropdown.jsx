import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, AlertCircle } from 'lucide-react';
import API from '../api/axiosClient';

/**
 * Generic NotificationDropdown component for all roles
 * @param {string} endpoint - API endpoint to fetch notifications from (e.g., '/notifications', '/hod/notices', '/student/:id/notices')
 * @param {string} noticePageUrl - URL path to navigate to when clicking a notification (e.g., '/hod/notices', '/student/notices')
 * @param {function} onClose - Callback when dropdown should close
 * @param {function} onNotificationRead - Callback when notification is read
 */
const NotificationDropdown = ({ 
  endpoint, 
  noticePageUrl, 
  onClose, 
  onNotificationRead 
}) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await API.get(endpoint);
      const data = res.data || [];
      const mapped = (data || [])
        .filter(n => n.isIncoming && !n.isRead)
        .map(n => ({
          id: n.id,
          title: n.title || 'Notification',
          message: n.message || '',
          category: n.category || 'GENERAL',
          createdAt: n.date,
          read: false,
          sender: n.senderUser,
          targetUser: n.targetUser
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setNotifications(mapped);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [endpoint]);

  const handleNotificationClick = async (notificationId) => {
    if (!notificationId) {
      console.error('No notification ID provided');
      return;
    }

    if (onClose) {
      onClose();
    }
    navigate(`${noticePageUrl}?noticeId=${encodeURIComponent(notificationId)}`);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (category) => {
    if (category === 'SIGNUP_REQUEST') {
      return <AlertCircle size={16} className="text-amber-600" />;
    }
    return <Bell size={16} className="text-blue-600" />;
  };

  return (
    <div className="w-96 max-w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
        {unreadCount > 0 && (
          <span className="inline-block px-2 py-1 text-xs font-bold bg-amber-600 text-white rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto divide-y divide-gray-200">
        {loading ? (
          <div className="p-4 text-center text-sm text-gray-500">Loading notifications…</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No notifications</p>
          </div>
        ) : (
          notifications.slice(0, 6).map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id)}
              className="p-4 cursor-pointer transition bg-white hover:bg-gray-50"
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 pt-1">
                  {getNotificationIcon(notification.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm truncate text-gray-900 font-semibold">
                      {notification.title}
                    </p>
                    <div className="flex-shrink-0 w-2 h-2 bg-amber-600 rounded-full" />
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {notification.message}
                  </p>
                  {notification.targetUser && (
                    <p className="text-xs text-gray-500 mb-1">
                      {notification.targetUser.firstName} {notification.targetUser.lastName || ''}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    {new Date(notification.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="border-t border-gray-200 p-3 bg-gray-50 text-center">
          <Link
            to={noticePageUrl}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            onClick={() => onClose && onClose()}
          >
            Open all notices
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
