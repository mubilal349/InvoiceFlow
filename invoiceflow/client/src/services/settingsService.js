const API_URL =
  "https://invoiceflow-backend-production-46c8.up.railway.app/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ==========================================
// GET SETTINGS
// ==========================================

export const getSettings = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load settings");
  }

  return data;
};

// ==========================================
// UPDATE SETTINGS
// ==========================================

export const updateSettings = async (settings) => {
  const response = await fetch(API_URL, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(settings),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update settings");
  }

  return data;
};

// ==========================================
// CHANGE PASSWORD
// ==========================================

export const changePassword = async (currentPassword, newPassword) => {
  const response = await fetch(`${API_URL}/password`, {
    method: "PUT",
    headers: getHeaders(),

    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to change password");
  }

  return data;
};
