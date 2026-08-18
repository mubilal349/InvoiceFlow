const API_URL =
  "https://invoiceflow-backend-production-46c8.up.railway.app/api/notifications";

const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// =========================================
// GET ALL NOTIFICATIONS
// =========================================

export const getNotifications = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load notifications");
  }

  return data;
};

// =========================================
// MARK ONE READ
// =========================================

export const markNotificationAsRead = async (id) => {
  const response = await fetch(`${API_URL}/read/${id}`, {
    method: "PUT",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update notification");
  }

  return data;
};

// =========================================
// MARK ALL READ
// =========================================

export const markAllNotificationsAsRead = async () => {
  const response = await fetch(`${API_URL}/read-all`, {
    method: "PUT",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update notifications");
  }

  return data;
};

// =========================================
// DELETE
// =========================================

export const deleteNotification = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete notification");
  }

  return data;
};
