import React, { useEffect, useState } from "react";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../services/notificationService";

import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [open, setOpen] = useState(false);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();

      setNotifications(data.notifications || []);

      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Notification error:", error);
    }
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(loadNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRead = async (notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id);

        await loadNotifications();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();

      await loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);

      await loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "INVOICE_CREATED":
        return "🧾";

      case "INVOICE_PAID":
        return "💰";

      case "INVOICE_OVERDUE":
        return "⚠️";

      case "EXPENSE_ADDED":
        return "💸";

      default:
        return "🔔";
    }
  };

  const getTime = (date) => {
    const diff = Date.now() - new Date(date).getTime();

    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    return `${days}d ago`;
  };

  return (
    <div className="notifications-wrapper">
      <button className="notification-bell" onClick={() => setOpen(!open)}>
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <div>
              <h3>Notifications</h3>

              <span>{unreadCount} unread</span>
            </div>

            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead}>Mark all read</button>
            )}
          </div>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="notifications-empty">
                <div>🔔</div>

                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-item ${
                    !notification.isRead ? "unread" : ""
                  }`}
                  onClick={() => handleRead(notification)}
                >
                  <div className="notification-icon">
                    {getIcon(notification.type)}
                  </div>

                  <div className="notification-content">
                    <strong>{notification.title}</strong>

                    <p>{notification.message}</p>

                    <small>{getTime(notification.createdAt)}</small>
                  </div>

                  <button
                    className="notification-delete"
                    onClick={(e) => {
                      e.stopPropagation();

                      handleDelete(notification._id);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
