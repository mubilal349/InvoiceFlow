import React, { useEffect, useState } from "react";
import "./Invoice.css";
import api from "../services/api";

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/invoices");

      console.log("Invoices response:", response.data);

      setInvoices(response.data.invoices || response.data.data || []);
    } catch (error) {
      console.error("Invoice fetch error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load invoices",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDownloadPDF = async (invoiceId, invoiceNumber) => {
    try {
      const response = await fetch(
        `https://invoiceflow-backend-production-46c8.up.railway.app/api/invoices${invoiceId}/pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `${invoiceNumber}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download error:", error);

      alert("Unable to download invoice PDF");
    }
  };

  //   Delete function
  const handleDeleteInvoice = async (invoiceId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `https://invoiceflow-backend-production-46c8.up.railway.app/api/invoices/${invoiceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete invoice");
      }

      setInvoices((prevInvoices) =>
        prevInvoices.filter((invoice) => invoice._id !== invoiceId),
      );

      alert("Invoice deleted successfully");
    } catch (error) {
      console.error("Delete invoice error:", error);

      alert(error.message);
    }
  };

  const handleCreateInvoice = () => {
    window.location.href = "/create-invoice";
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      invoice.invoiceNumber?.toLowerCase().includes(searchValue) ||
      invoice.customerName?.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "All" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalInvoices = invoices.length;

  const paidInvoices = invoices.filter(
    (invoice) => invoice.status?.toLowerCase() === "paid",
  ).length;

  const pendingInvoices = invoices.filter(
    (invoice) => invoice.status?.toLowerCase() === "pending",
  ).length;

  const totalRevenue = invoices
    .filter((invoice) => invoice.status?.toLowerCase() === "paid")
    .reduce((total, invoice) => total + Number(invoice.total || 0), 0);

  if (loading) {
    return (
      <div className="invoice-page">
        <div className="invoice-loading">
          <div className="invoice-spinner"></div>

          <h3>Loading invoices</h3>

          <p>Please wait while we fetch your invoices.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="invoice-page">
      {/* =========================================
          HEADER
      ========================================= */}
      <div className="invoice-header">
        <div className="invoice-title-area">
          <div className="invoice-page-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="14" y2="17" />
            </svg>
          </div>

          <div>
            <h1>Invoices</h1>

            <p>Manage your invoices and payments.</p>
          </div>
        </div>

        {user?.role === "admin" && (
          <button className="create-invoice-btn" onClick={handleCreateInvoice}>
            <span className="plus-icon">+</span>
            Create Invoice
          </button>
        )}
      </div>

      {/* =========================================
          ERROR
      ========================================= */}
      {error && (
        <div className="invoice-error">
          <span>!</span>

          <div>
            <strong>Unable to load invoices</strong>

            <p>{error}</p>
          </div>

          <button onClick={fetchInvoices}>Retry</button>
        </div>
      )}

      {/* =========================================
          STATISTICS
      ========================================= */}
      <div className="invoice-stats">
        <div className="invoice-stat-card">
          <div className="invoice-stat-icon purple">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>

          <div>
            <span>Total Invoices</span>
            <strong>{totalInvoices}</strong>
          </div>
        </div>

        <div className="invoice-stat-card">
          <div className="invoice-stat-icon green">✓</div>

          <div>
            <span>Paid Invoices</span>
            <strong>{paidInvoices}</strong>
          </div>
        </div>

        <div className="invoice-stat-card">
          <div className="invoice-stat-icon orange">◷</div>

          <div>
            <span>Pending</span>
            <strong>{pendingInvoices}</strong>
          </div>
        </div>

        <div className="invoice-stat-card">
          <div className="invoice-stat-icon blue">$</div>

          <div>
            <span>Paid Revenue</span>
            <strong>Rs. {totalRevenue.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* =========================================
          INVOICE CARD
      ========================================= */}
      <div className="invoice-card">
        {/* TOOLBAR */}
        <div className="invoice-toolbar">
          <div className="invoice-toolbar-title">
            <h2>All Invoices</h2>

            <span>{filteredInvoices.length} invoices</span>
          </div>

          <div className="invoice-filters">
            {/* SEARCH */}
            <div className="invoice-search">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />

                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>

              <input
                type="text"
                placeholder="Search invoices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* STATUS */}
            <select
              className="invoice-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* =========================================
            DESKTOP TABLE
        ========================================= */}
        <div className="invoice-table-wrapper">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="7" className="invoice-empty">
                    <div className="empty-invoice-icon">▤</div>

                    <h3>No invoices found</h3>

                    <p>
                      {search || statusFilter !== "All"
                        ? "Try changing your search or filter."
                        : "Create your first invoice to get started."}
                    </p>

                    {user?.role === "admin" &&
                      !search &&
                      statusFilter === "All" && (
                        <button
                          className="empty-create-btn"
                          onClick={handleCreateInvoice}
                        >
                          + Create Invoice
                        </button>
                      )}
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td>
                      <div className="invoice-number">
                        <div className="invoice-small-icon">#</div>

                        <strong>{invoice.invoiceNumber}</strong>
                      </div>
                    </td>

                    <td>
                      <div className="customer-name">
                        {invoice.customerName}
                      </div>
                    </td>

                    <td>{new Date(invoice.issueDate).toLocaleDateString()}</td>

                    <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>

                    <td>
                      <strong className="invoice-total">
                        Rs. {Number(invoice.total || 0).toLocaleString()}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`invoice-status ${
                          invoice.status?.toLowerCase() || ""
                        }`}
                      >
                        <span className="status-dot"></span>

                        {invoice.status}
                      </span>
                    </td>

                    <td>
                      <div className="invoice-actions">
                        {/* PDF - EVERYONE */}
                        <button
                          className="pdf-button"
                          onClick={() =>
                            handleDownloadPDF(
                              invoice._id,
                              invoice.invoiceNumber,
                            )
                          }
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />

                            <polyline points="7 10 12 15 17 10" />

                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          PDF
                        </button>

                        {/* ADMIN ONLY */}
                        {user?.role === "admin" && (
                          <>
                            <button
                              className="edit-invoice-btn"
                              onClick={() =>
                                (window.location.href = `/edit-invoice/${invoice._id}`)
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="delete-invoice-btn"
                              onClick={() => handleDeleteInvoice(invoice._id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* =========================================
            MOBILE CARDS
        ========================================= */}
        <div className="invoice-mobile-list">
          {filteredInvoices.length === 0 ? (
            <div className="mobile-empty">
              <div className="empty-invoice-icon">▤</div>

              <h3>No invoices found</h3>

              <p>No invoices match your search.</p>
            </div>
          ) : (
            filteredInvoices.map((invoice) => (
              <div className="invoice-mobile-card" key={invoice._id}>
                <div className="mobile-invoice-top">
                  <div className="invoice-number">
                    <div className="invoice-small-icon">#</div>

                    <strong>{invoice.invoiceNumber}</strong>
                  </div>

                  <span
                    className={`invoice-status ${
                      invoice.status?.toLowerCase() || ""
                    }`}
                  >
                    <span className="status-dot"></span>

                    {invoice.status}
                  </span>
                </div>

                <div className="mobile-customer">
                  <span>Customer</span>

                  <strong>{invoice.customerName}</strong>
                </div>

                <div className="mobile-invoice-details">
                  <div>
                    <span>Issue Date</span>

                    <strong>
                      {new Date(invoice.issueDate).toLocaleDateString()}
                    </strong>
                  </div>

                  <div>
                    <span>Due Date</span>

                    <strong>
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </strong>
                  </div>
                </div>

                <div className="mobile-invoice-bottom">
                  <div>
                    <span>Total</span>

                    <strong>
                      Rs. {Number(invoice.total || 0).toLocaleString()}
                    </strong>
                  </div>

                  <button
                    className="pdf-button"
                    onClick={() =>
                      handleDownloadPDF(invoice._id, invoice.invoiceNumber)
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download PDF
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Invoice;
