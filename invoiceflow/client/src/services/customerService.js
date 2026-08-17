const API_URL = "http://localhost:8000/api/invoices";

export const getCustomersFromInvoices = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/customers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load customers");
  }

  return data;
};
