import React, { useEffect, useMemo, useState } from "react";

import {
  getFinancialSummary,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../services/expenseService";

import { getInvoices } from "../services/invoiceService";

import "./Expenses.css";

// =====================================================
// EMPTY FORM
// =====================================================

const emptyForm = {
  title: "",
  description: "",
  amount: "",
  category: "Other",
  date: new Date().toISOString().split("T")[0],
  paymentMethod: "Cash",
  vendor: "",
  reference: "",
  notes: "",
  invoice: "",
};

// =====================================================
// COMPONENT
// =====================================================

const Expenses = () => {
  // ===================================================
  // EXPENSES
  // ===================================================

  const [expenses, setExpenses] = useState([]);

  // ===================================================
  // INVOICES
  // ===================================================

  const [invoices, setInvoices] = useState([]);

  // ===================================================
  // FINANCIAL SUMMARY
  // ===================================================

  const [financial, setFinancial] = useState({
    revenue: 0,
    expenses: 0,
    profit: 0,
  });

  // ===================================================
  // UI STATE
  // ===================================================

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);

  const [showDetails, setShowDetails] = useState(false);

  const [selectedExpense, setSelectedExpense] = useState(null);

  const [editingExpense, setEditingExpense] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [saving, setSaving] = useState(false);

  // ===================================================
  // LOAD INVOICES
  // ===================================================

  const loadInvoices = async () => {
    try {
      const data = await getInvoices();

      setInvoices(data.invoices || []);
    } catch (error) {
      console.error("Load invoices error:", error);
    }
  };

  // ===================================================
  // LOAD FINANCIAL SUMMARY
  // ===================================================

  const loadFinancialSummary = async () => {
    try {
      const data = await getFinancialSummary();

      setFinancial(
        data.financial || {
          revenue: 0,
          expenses: 0,
          profit: 0,
        },
      );
    } catch (error) {
      console.error("Financial summary error:", error);
    }
  };

  // ===================================================
  // LOAD EXPENSES
  // ===================================================

  const loadExpenses = async () => {
    try {
      setLoading(true);

      setError("");

      const data = await getExpenses();

      setExpenses(data.expenses || []);
    } catch (error) {
      console.error("Load expenses error:", error);

      setError(error.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    loadExpenses();

    loadInvoices();

    loadFinancialSummary();
  }, []);

  // ===================================================
  // FILTER EXPENSES
  // ===================================================

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const searchText = search.toLowerCase().trim();

      const title = expense.title?.toLowerCase() || "";

      const vendor = expense.vendor?.toLowerCase() || "";

      const invoiceNumber = expense.invoice?.invoiceNumber?.toLowerCase() || "";

      const matchesSearch =
        !searchText ||
        title.includes(searchText) ||
        vendor.includes(searchText) ||
        invoiceNumber.includes(searchText);

      const matchesCategory =
        categoryFilter === "All" || expense.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [expenses, search, categoryFilter]);

  // ===================================================
  // EXPENSE STATISTICS
  // ===================================================

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0,
  );

  const invoiceExpenses = expenses
    .filter((expense) => expense.invoice)
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

  const normalExpenses = totalExpenses - invoiceExpenses;

  // ===================================================
  // FORM CHANGE
  // ===================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===================================================
  // OPEN ADD MODAL
  // ===================================================

  const handleAdd = () => {
    setEditingExpense(null);

    setForm({
      ...emptyForm,
      date: new Date().toISOString().split("T")[0],
    });

    setShowModal(true);
  };

  // ===================================================
  // OPEN EDIT MODAL
  // ===================================================

  const handleEdit = (expense) => {
    setEditingExpense(expense);

    setForm({
      title: expense.title || "",

      description: expense.description || "",

      amount: expense.amount || "",

      category: expense.category || "Other",

      date: expense.date
        ? new Date(expense.date).toISOString().split("T")[0]
        : "",

      paymentMethod: expense.paymentMethod || "Cash",

      vendor: expense.vendor || "",

      reference: expense.reference || "",

      notes: expense.notes || "",

      invoice: expense.invoice?._id || "",
    });

    setShowModal(true);
  };

  // ===================================================
  // SAVE EXPENSE
  // ===================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        ...form,

        amount: Number(form.amount),

        invoice: form.invoice || null,
      };

      // UPDATE

      if (editingExpense) {
        await updateExpense(editingExpense._id, payload);
      }

      // CREATE
      else {
        await createExpense(payload);
      }

      // CLOSE

      setShowModal(false);

      setEditingExpense(null);

      setForm({
        ...emptyForm,
        date: new Date().toISOString().split("T")[0],
      });

      // REFRESH EXPENSES

      await loadExpenses();

      // REFRESH FINANCIAL SUMMARY

      await loadFinancialSummary();
    } catch (error) {
      console.error("Save expense error:", error);

      alert(error.message || "Failed to save expense");
    } finally {
      setSaving(false);
    }
  };

  // ===================================================
  // DELETE EXPENSE
  // ===================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteExpense(id);

      // REFRESH EXPENSES

      await loadExpenses();

      // REFRESH FINANCIAL SUMMARY

      await loadFinancialSummary();
    } catch (error) {
      console.error("Delete expense error:", error);

      alert(error.message || "Failed to delete expense");
    }
  };

  // ===================================================
  // REFRESH EVERYTHING
  // ===================================================

  const handleRefresh = async () => {
    await Promise.all([loadExpenses(), loadInvoices(), loadFinancialSummary()]);
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="expenses-page">
        <div className="expenses-loading">
          <div className="expenses-spinner"></div>

          <p>Loading expenses...</p>
        </div>
      </div>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (error) {
    return (
      <div className="expenses-page">
        <div className="expenses-error">
          <h3>Unable to load expenses</h3>

          <p>{error}</p>

          <button className="retry-button" onClick={loadExpenses}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <div className="expenses-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="expenses-header">
        <div>
          <h1>Expenses</h1>

          <p>Manage your business expenses and invoice-related costs.</p>
        </div>

        <div className="expenses-header-actions">
          <button className="refresh-expenses-btn" onClick={handleRefresh}>
            ↻ Refresh
          </button>

          <button className="add-expense-btn" onClick={handleAdd}>
            + Add Expense
          </button>
        </div>
      </div>

      {/* =================================================
          EXPENSE STATISTICS
      ================================================= */}

      <div className="expense-stat-grid">
        {/* TOTAL */}

        <div className="expense-stat-card">
          <div className="expense-stat-icon">💰</div>

          <div>
            <span>Total Expenses</span>

            <strong>Rs. {totalExpenses.toLocaleString()}</strong>
          </div>
        </div>

        {/* INVOICE EXPENSES */}

        <div className="expense-stat-card">
          <div className="expense-stat-icon">🧾</div>

          <div>
            <span>Invoice Expenses</span>

            <strong>Rs. {invoiceExpenses.toLocaleString()}</strong>
          </div>
        </div>

        {/* NORMAL EXPENSES */}

        <div className="expense-stat-card">
          <div className="expense-stat-icon">🏢</div>

          <div>
            <span>Normal Expenses</span>

            <strong>Rs. {normalExpenses.toLocaleString()}</strong>
          </div>
        </div>

        {/* RECORDS */}

        <div className="expense-stat-card">
          <div className="expense-stat-icon">📊</div>

          <div>
            <span>Records</span>

            <strong>{expenses.length}</strong>
          </div>
        </div>
      </div>

      {/* =================================================
          FINANCIAL SUMMARY
      ================================================= */}

      <div className="financial-summary">
        {/* HEADER */}

        <div className="financial-summary-header">
          <div>
            <h3>Financial Summary</h3>

            <p>Revenue, expenses and profit overview.</p>
          </div>
        </div>

        {/* CARDS */}

        <div className="financial-summary-grid">
          {/* REVENUE */}

          <div className="financial-card revenue-card">
            <div className="financial-card-icon">💰</div>

            <div className="financial-card-content">
              <span>Revenue</span>

              <strong>
                Rs. {Number(financial.revenue || 0).toLocaleString()}
              </strong>
            </div>
          </div>

          {/* EXPENSES */}

          <div className="financial-card expense-card">
            <div className="financial-card-icon">💸</div>

            <div className="financial-card-content">
              <span>Expenses</span>

              <strong>
                Rs. {Number(financial.expenses || 0).toLocaleString()}
              </strong>
            </div>
          </div>

          {/* PROFIT */}

          <div className="financial-card profit-card">
            <div className="financial-card-icon">📈</div>

            <div className="financial-card-content">
              <span>Profit</span>

              <strong className={financial.profit < 0 ? "negative-profit" : ""}>
                Rs. {Number(financial.profit || 0).toLocaleString()}
              </strong>
            </div>
          </div>
        </div>

        {/* FORMULA */}

        {/* <div className="profit-formula">
          <span>Revenue</span>

          <strong>−</strong>

          <span>Expenses</span>

          <strong>=</strong>

          <span>Profit</span>
        </div> */}
      </div>

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="expenses-toolbar">
        {/* SEARCH */}

        <div className="expense-search">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* CATEGORY */}

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>

          <option>Project Cost</option>

          <option>Office</option>

          <option>Utilities</option>

          <option>Rent</option>

          <option>Salaries</option>

          <option>Marketing</option>

          <option>Travel</option>

          <option>Equipment</option>

          <option>Software</option>

          <option>Maintenance</option>

          <option>Taxes</option>

          <option>Other</option>
        </select>
      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="expenses-summary">
        <span>
          Showing <strong>{filteredExpenses.length}</strong> of{" "}
          <strong>{expenses.length}</strong> expenses
        </span>

        {search && (
          <span>
            Search: <strong>{search}</strong>
          </span>
        )}
      </div>

      {/* =================================================
          EMPTY
      ================================================= */}

      {filteredExpenses.length === 0 ? (
        <div className="empty-expenses">
          <div className="empty-expense-icon">💸</div>

          <h3>No expenses found</h3>

          <p>
            {expenses.length === 0
              ? "Start adding your business expenses."
              : "Try changing your search or filter."}
          </p>

          {expenses.length === 0 && (
            <button className="add-expense-btn" onClick={handleAdd}>
              + Add Expense
            </button>
          )}
        </div>
      ) : (
        /* =================================================
            EXPENSE TABLE
        ================================================= */

        <div className="expenses-table">
          <table>
            <thead>
              <tr>
                <th>Expense</th>

                <th>Category</th>

                <th>Invoice</th>

                <th>Vendor</th>

                <th>Date</th>

                <th>Amount</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense._id}>
                  {/* EXPENSE */}

                  <td>
                    <div className="expense-name-cell">
                      <div className="expense-icon">💸</div>

                      <div>
                        <strong>{expense.title}</strong>

                        {expense.description && (
                          <small>{expense.description}</small>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* CATEGORY */}

                  <td>
                    <span className="expense-category">{expense.category}</span>
                  </td>

                  {/* INVOICE */}

                  <td>
                    {expense.invoice ? (
                      <span className="linked-invoice">
                        {expense.invoice.invoiceNumber ||
                          expense.invoice.number ||
                          "Invoice"}
                      </span>
                    ) : (
                      <span className="no-invoice">No Invoice</span>
                    )}
                  </td>

                  {/* VENDOR */}

                  <td>{expense.vendor || "—"}</td>

                  {/* DATE */}

                  <td>
                    {expense.date
                      ? new Date(expense.date).toLocaleDateString()
                      : "—"}
                  </td>

                  {/* AMOUNT */}

                  <td>
                    <span className="expense-amount">
                      Rs. {Number(expense.amount || 0).toLocaleString()}
                    </span>
                  </td>

                  {/* ACTIONS */}

                  <td>
                    <div className="expense-actions">
                      <button
                        className="view-expense-btn"
                        onClick={() => {
                          setSelectedExpense(expense);

                          setShowDetails(true);
                        }}
                      >
                        View
                      </button>

                      <button
                        className="edit-expense-btn"
                        onClick={() => handleEdit(expense)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-expense-btn"
                        onClick={() => handleDelete(expense._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (
        <div className="expense-modal-overlay">
          <div className="expense-modal">
            {/* HEADER */}

            <div className="expense-modal-header">
              <div>
                <h2>{editingExpense ? "Edit Expense" : "Add Expense"}</h2>

                <p>
                  {editingExpense
                    ? "Update expense information."
                    : "Create a business expense. Invoice linking is optional."}
                </p>
              </div>

              <button
                className="expense-modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            {/* FORM */}

            <form className="expense-form" onSubmit={handleSubmit}>
              <div className="expense-form-grid">
                {/* TITLE */}

                <div className="expense-form-group">
                  <label>Expense Title *</label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Office Rent"
                    required
                  />
                </div>

                {/* AMOUNT */}

                <div className="expense-form-group">
                  <label>Amount *</label>

                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                {/* CATEGORY */}

                <div className="expense-form-group">
                  <label>Category</label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option>Project Cost</option>

                    <option>Office</option>

                    <option>Utilities</option>

                    <option>Rent</option>

                    <option>Salaries</option>

                    <option>Marketing</option>

                    <option>Travel</option>

                    <option>Equipment</option>

                    <option>Software</option>

                    <option>Maintenance</option>

                    <option>Taxes</option>

                    <option>Other</option>
                  </select>
                </div>

                {/* DATE */}

                <div className="expense-form-group">
                  <label>Date</label>

                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                  />
                </div>

                {/* PAYMENT */}

                <div className="expense-form-group">
                  <label>Payment Method</label>

                  <select
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleChange}
                  >
                    <option>Cash</option>

                    <option>Bank Transfer</option>

                    <option>Credit Card</option>

                    <option>Debit Card</option>

                    <option>Other</option>
                  </select>
                </div>

                {/* VENDOR */}

                <div className="expense-form-group">
                  <label>Vendor</label>

                  <input
                    name="vendor"
                    value={form.vendor}
                    onChange={handleChange}
                    placeholder="Vendor / supplier"
                  />
                </div>

                {/* INVOICE */}

                <div className="expense-form-group">
                  <label>
                    Invoice
                    <span className="optional">Optional</span>
                  </label>

                  <select
                    name="invoice"
                    value={form.invoice}
                    onChange={handleChange}
                  >
                    <option value="">No Invoice</option>

                    {invoices.map((invoice) => (
                      <option key={invoice._id} value={invoice._id}>
                        {invoice.invoiceNumber || invoice.number || invoice._id}

                        {" — "}

                        {invoice.customerName ||
                          invoice.customerEmail ||
                          "Customer"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* REFERENCE */}

                <div className="expense-form-group">
                  <label>Reference</label>

                  <input
                    name="reference"
                    value={form.reference}
                    onChange={handleChange}
                    placeholder="Reference number"
                  />
                </div>

                {/* DESCRIPTION */}

                <div className="expense-form-group full">
                  <label>Description</label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the expense..."
                  />
                </div>

                {/* NOTES */}

                <div className="expense-form-group full">
                  <label>Notes</label>

                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Additional notes..."
                  />
                </div>
              </div>

              {/* FORM ACTIONS */}

              <div className="expense-form-actions">
                <button
                  type="button"
                  className="cancel-expense-btn"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-expense-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingExpense
                      ? "Update Expense"
                      : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================
          DETAILS MODAL
      ================================================= */}

      {showDetails && selectedExpense && (
        <div className="expense-modal-overlay">
          <div className="expense-details-modal">
            {/* HEADER */}

            <div className="expense-modal-header">
              <div>
                <h2>Expense Details</h2>

                <p>Complete expense information</p>
              </div>

              <button
                className="expense-modal-close"
                onClick={() => setShowDetails(false)}
              >
                ×
              </button>
            </div>

            {/* CONTENT */}

            <div className="expense-details-content">
              {/* TITLE */}

              <div className="expense-detail-title">
                <div className="expense-icon large">💸</div>

                <div>
                  <h3>{selectedExpense.title}</h3>

                  <span>
                    Rs. {Number(selectedExpense.amount || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* DETAILS */}

              <div className="expense-detail-grid">
                <div>
                  <span>Category</span>

                  <strong>{selectedExpense.category}</strong>
                </div>

                <div>
                  <span>Payment Method</span>

                  <strong>{selectedExpense.paymentMethod}</strong>
                </div>

                <div>
                  <span>Vendor</span>

                  <strong>{selectedExpense.vendor || "—"}</strong>
                </div>

                <div>
                  <span>Date</span>

                  <strong>
                    {selectedExpense.date
                      ? new Date(selectedExpense.date).toLocaleDateString()
                      : "—"}
                  </strong>
                </div>

                <div>
                  <span>Invoice</span>

                  <strong>
                    {selectedExpense.invoice
                      ? selectedExpense.invoice.invoiceNumber ||
                        selectedExpense.invoice.number ||
                        "Linked Invoice"
                      : "No Invoice"}
                  </strong>
                </div>

                <div>
                  <span>Reference</span>

                  <strong>{selectedExpense.reference || "—"}</strong>
                </div>
              </div>

              {/* DESCRIPTION */}

              {selectedExpense.description && (
                <div className="expense-detail-section">
                  <h4>Description</h4>

                  <p>{selectedExpense.description}</p>
                </div>
              )}

              {/* NOTES */}

              {selectedExpense.notes && (
                <div className="expense-detail-section">
                  <h4>Notes</h4>

                  <p>{selectedExpense.notes}</p>
                </div>
              )}
            </div>

            {/* ACTIONS */}

            <div className="expense-details-actions">
              <button
                className="cancel-expense-btn"
                onClick={() => setShowDetails(false)}
              >
                Close
              </button>

              <button
                className="edit-expense-btn"
                onClick={() => {
                  setShowDetails(false);

                  handleEdit(selectedExpense);
                }}
              >
                Edit Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
