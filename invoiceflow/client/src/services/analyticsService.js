const API_URL =
  "https://invoiceflow-backend-production-46c8.up.railway.app/api/analytics";

const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getAnalytics = async (period = "month") => {
  const response = await fetch(`${API_URL}?period=${period}`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load analytics");
  }

  return data;
};
