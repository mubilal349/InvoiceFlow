import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Invoice from "./Invoices";
import "./Dashboard.css";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("dashboard");

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

                  <h2>$0.00</h2>

                  <span className="stat-change positive">
                    ↑ 0% <span>from last month</span>
                  </span>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span className="stat-label">Pending Invoices</span>

                    <div className="stat-icon orange">◷</div>
                  </div>

                  <h2>0</h2>

                  <span className="stat-change">No pending invoices</span>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span className="stat-label">Paid Invoices</span>

                    <div className="stat-icon blue">✓</div>
                  </div>

                  <h2>0</h2>

                  <span className="stat-change positive">
                    ↑ 0% <span>from last month</span>
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

                    <button className="quick-action">
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
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
