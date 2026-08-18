const API_URL =
  "https://invoiceflow-backend-production-46c8.up.railway.app/api";

// ============================================
// GET ALL INVOICES
// ============================================

export const getInvoices = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load invoices");
  }

  return data;
};
