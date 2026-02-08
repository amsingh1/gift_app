import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Bell, Gift, Users, BookmarkPlus, CheckCheck, Calendar } from 'lucide-react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../services/api';
import './NotificationsPage.css';

const ICONS = {
  gift_reserved: BookmarkPlus,
  gift_unreserved: BookmarkPlus,
  list_shared: Users,
  event_reminder: Calendar,
  gift_added: Gift,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const { refreshNotifications } = useOutletContext();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      fetchNotifications();
      refreshNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      fetchNotifications();
      refreshNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = (notification) => {
    if (!notification.isRead) {
      handleMarkRead(notification.id);
    }
    if (notification.relatedEventId) {
      navigate(`/event/${notification.relatedEventId}`);
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return <div className="text-center text-muted" style={{ padding: '60px 0' }}>Loading notifications...</div>;
  }

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p className="text-muted">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-secondary" onClick={handleMarkAllRead}>
            <CheckCheck size={16} />
            Mark all read
          </button>
        )}
      </div>

      <div className="notifications-list card">
        {notifications.map((n) => {
          const Icon = ICONS[n.type] || Bell;
          return (
            <div
              key={n.id}
              className={`notification-item ${n.isRead ? '' : 'unread'}`}
              onClick={() => handleClick(n)}
            >
              <div className={`notification-icon ${n.type}`}>
                <Icon size={16} />
              </div>
              <div className="notification-content">
                <p className="notification-message">{n.message}</p>
                <span className="notification-time">{timeAgo(n.createdAt)}</span>
              </div>
              {!n.isRead && <div className="notification-dot" />}
            </div>
          );
        })}

        {notifications.length === 0 && (
          <div className="empty-state">
            <Bell size={48} />
            <h3>No notifications</h3>
            <p>When someone interacts with your wishlists, you'll see it here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
