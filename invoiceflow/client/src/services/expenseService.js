const API_URL =
  "https://invoiceflow-backend-production-46c8.up.railway.app/api";

// =====================================================
// HELPER
// =====================================================

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// =====================================================
// GET ALL EXPENSES
// =====================================================

export const getExpenses = async () => {
  const response = await fetch(`${API_URL}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load expenses");
  }

  return data;
};

// =====================================================
// GET FINANCIAL SUMMARY
// =====================================================

export const getFinancialSummary = async () => {
  const response = await fetch(`${API_URL}/summary`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load financial summary");
  }

  return data;
};

// =====================================================
// GET SINGLE EXPENSE
// =====================================================

export const getExpenseById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load expense");
  }

  return data;
};

// =====================================================
// CREATE EXPENSE
// =====================================================

export const createExpense = async (expenseData) => {
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(expenseData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create expense");
  }

  return data;
};

// =====================================================
// UPDATE EXPENSE
// =====================================================

export const updateExpense = async (id, expenseData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(expenseData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update expense");
  }

  return data;
};

// =====================================================
// DELETE EXPENSE
// =====================================================

export const deleteExpense = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete expense");
  }

  return data;
};
