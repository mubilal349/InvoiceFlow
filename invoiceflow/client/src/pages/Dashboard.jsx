import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Invoice from "./Invoices";
import Customers from "./Customers";
import "./Dashboard.css";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("dashboard");

  const [invoices, setInvoices] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    // clear auth state — adjust to however you store it
    localStorage.removeItem("authToken");
    // or: clearAuthCookie(); dispatch(logoutAction()); signOut(); etc.

    // redirect to login
    window.location.href = "/login";
    // or if using react-router: navigate("/login");
  };

  const paidInvoices = invoices.filter(
    (invoice) => invoice.status?.toLowerCase() === "paid",
  ).length;

  const pendingInvoices = invoices.filter(
    (invoice) => invoice.status?.toLowerCase() === "pending",
  ).length;

  const totalRevenue = invoices
    .filter((invoice) => invoice.status?.toLowerCase() === "paid")
    .reduce((total, invoice) => {
      return total + Number(invoice.total || invoice.amount || 0);
    }, 0);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8000/api/invoices", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setInvoices(data.invoices || data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div className="app-layout">
      {/* =========================================
          SIDEBAR OVERLAY FOR MOBILE
      ========================================= */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* =========================================
          SIDEBAR
      ========================================= */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* =========================================
          MAIN AREA
      ========================================= */}
      <div className="main-area">
        {/* NAVBAR */}
        <Navbar onToggleSidebar={toggleSidebar} />

        {/* =========================================
            DASHBOARD CONTENT
        ========================================= */}
        <main className="dashboard-page">
          {/* =========================================
              DASHBOARD TAB
          ========================================= */}
          {activeTab === "dashboard" && (
            <>
              {/* PAGE HEADER */}
              <div className="dashboard-header">
                <div>
                  <h1>Dashboard</h1>

                  <p>
                    Welcome back, {user?.name || "User"}. Here's what's
                    happening with your business.
                  </p>
                </div>

                <button className="primary-button">+ Create Invoice</button>
              </div>

              {/* =========================================
                  STATS
              ========================================= */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-top">
                    <span className="stat-label">Total Revenue</span>

                    <div className="stat-icon green">$</div>
                  </div>

                  <h2>${totalRevenue.toFixed(2)}</h2>

                  <span className="stat-change positive">
                    {totalRevenue > 0
                      ? "Revenue from paid invoices"
                      : "No revenue recorded"}
                  </span>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span className="stat-label">Pending Invoices</span>

                    <div className="stat-icon red">!</div>
                  </div>

                  <h2>{pendingInvoices}</h2>

                  <span className="stat-change">
                    {pendingInvoices > 0
                      ? `${pendingInvoices} Pending invoice${
                          pendingInvoices !== 1 ? "s" : ""
                        }`
                      : "No Pending invoices"}
                  </span>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span className="stat-label">Paid Invoices</span>

                    <div className="stat-icon blue">✓</div>
                  </div>

                  <h2>{paidInvoices}</h2>

                  <span className="stat-change positive">
                    {paidInvoices > 0
                      ? `${paidInvoices} paid invoice${paidInvoices !== 1 ? "s" : ""}`
                      : "No paid invoices"}
                  </span>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span className="stat-label">Total Expenses</span>

                    <div className="stat-icon red">↓</div>
                  </div>

                  <h2>$0.00</h2>

                  <span className="stat-change">No expenses recorded</span>
                </div>
              </div>

              {/* =========================================
                  LOWER SECTION
              ========================================= */}
              <div className="dashboard-grid">
                {/* RECENT INVOICES */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <div>
                      <h3>Recent Invoices</h3>
                      <p>Your latest invoice activity</p>
                    </div>

                    <button
                      className="text-button"
                      onClick={() => setActiveTab("invoices")}
                    >
                      View all
                    </button>
                  </div>

                  {invoices.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">▤</div>

                      <h4>No invoices yet</h4>

                      <p>Create your first invoice to get started.</p>

                      <button
                        className="secondary-button"
                        onClick={() => setActiveTab("invoices")}
                      >
                        View Invoices
                      </button>
                    </div>
                  ) : (
                    <div className="recent-invoices">
                      {/* HEADER */}
                      <div className="recent-invoices-header">
                        <span>Invoice</span>
                        <span>Date</span>
                        <span>Amount</span>
                        <span>Status</span>
                      </div>

                      {invoices
                        .slice()
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt || b.issueDate) -
                            new Date(a.createdAt || a.issueDate),
                        )
                        .slice(0, 5)
                        .map((invoice) => {
                          const status =
                            invoice.status?.toLowerCase() || "pending";

                          return (
                            <div
                              className="recent-invoice-row"
                              key={invoice._id}
                            >
                              {/* INVOICE */}
                              <div className="recent-invoice-info">
                                <div className="invoice-mini-icon">#</div>

                                <div className="invoice-details">
                                  <strong>
                                    {invoice.invoiceNumber || "Invoice"}
                                  </strong>

                                  <span>
                                    {invoice.customerName || "Unknown Customer"}
                                  </span>
                                </div>
                              </div>

                              {/* DATE */}
                              <div className="recent-invoice-date">
                                {invoice.issueDate
                                  ? new Date(
                                      invoice.issueDate,
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : "-"}
                              </div>

                              {/* AMOUNT */}
                              <div className="recent-invoice-amount">
                                Rs.{" "}
                                {Number(invoice.total || 0).toLocaleString()}
                              </div>

                              {/* STATUS */}
                              <div className="recent-invoice-status">
                                <span className={`invoice-status ${status}`}>
                                  {status}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>

                {/* QUICK ACTIONS */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <div>
                      <h3>Quick Actions</h3>

                      <p>Common tasks</p>
                    </div>
                  </div>

                  <div className="quick-actions">
                    <button
                      className="quick-action"
                      onClick={() => setActiveTab("invoices")}
                    >
                      <span className="quick-icon purple">+</span>

                      <div>
                        <strong>Create Invoice</strong>

                        <small>Create and send a new invoice</small>
                      </div>
                    </button>

                    <button
                      className="quick-action"
                      onClick={() => setActiveTab("customers")}
                    >
                      <span className="quick-icon blue">♙</span>

                      <div>
                        <strong>Add Customer</strong>

                        <small>Add a new customer</small>
                      </div>
                    </button>

                    <button className="quick-action">
                      <span className="quick-icon green">$</span>

                      <div>
                        <strong>Record Expense</strong>

                        <small>Track a business expense</small>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* =========================================
                  BUSINESS OVERVIEW
              ========================================= */}
              <div className="dashboard-card overview-card">
                <div className="card-header">
                  <div>
                    <h3>Business Overview</h3>

                    <p>Your financial activity will appear here.</p>
                  </div>

                  <select className="period-select">
                    <option>This month</option>

                    <option>Last month</option>

                    <option>This year</option>
                  </select>
                </div>

                <div className="chart-placeholder">
                  <div className="chart-line"></div>

                  <span>No financial data available yet</span>

                  <small>Start creating invoices to see your overview.</small>
                </div>
              </div>
            </>
          )}

          {/* =========================================
              INVOICES TAB
          ========================================= */}
          {activeTab === "invoices" && <Invoice />}

          {/* =========================================
             CUSTOMERS TAB
          ========================================= */}
          {activeTab === "customers" && <Customers />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
