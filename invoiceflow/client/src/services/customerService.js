const API_URL = "http://localhost:8000/api/invoices/customers";

export const getCustomersFromInvoices = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required. Please login again.");
  }

  const response = await fetch(API_URL, {
    method: "GET",

    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${token}`,
    },
  });

  console.log("CUSTOMERS STATUS:", response.status);

  const data = await response.json();

  console.log("CUSTOMERS RESPONSE:", data);

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch customers");
  }

  return data.customers || [];
};
