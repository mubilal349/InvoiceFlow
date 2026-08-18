import React from "react";
import "./Sidebar.css";
import logoIcon from "../assets/invoiceflow.jfif";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, onClose, activeTab, setActiveTab, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    onClose?.();
  };

  const handleSettings = () => {
    setActiveTab("settings");
    navigate("/settings");
    onClose?.();
  };

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-mobile-open" : ""}`}>
      {/* =========================================
          HEADER
      ========================================= */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-logo-wrapper">
            <img src={logoIcon} alt="InvoiceFlow Logo" className="brand-logo" />
          </div>

          <div className="brand-content">
            <span className="brand-name">InvoiceFlow</span>
            <span className="brand-tagline">Business Management</span>
          </div>
        </div>

        <button
          type="button"
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* =========================================
          NAVIGATION
      ========================================= */}
      <nav className="sidebar-nav">
        {/* MENU */}
        <div className="nav-section">
          <div className="nav-section-heading">
            <span className="nav-section-title">Workspace</span>
          </div>

          {/* Dashboard */}
          <button
            type="button"
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => handleNavigation("dashboard")}
          >
            <span className="nav-icon-wrapper">
              <svg
                className="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </span>

            <span className="nav-label">Dashboard</span>

            {activeTab === "dashboard" && (
              <span className="active-indicator"></span>
            )}
          </button>

          {/* Invoices */}
          <button
            type="button"
            className={`nav-item ${activeTab === "invoices" ? "active" : ""}`}
            onClick={() => handleNavigation("invoices")}
          >
            <span className="nav-icon-wrapper">
              <svg
                className="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </span>

            <span className="nav-label">Invoices</span>

            {activeTab === "invoices" && (
              <span className="active-indicator"></span>
            )}
          </button>

          {/* Customers */}
          <button
            type="button"
            className={`nav-item ${activeTab === "customers" ? "active" : ""}`}
            onClick={() => handleNavigation("customers")}
          >
            <span className="nav-icon-wrapper">
              <svg
                className="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>

            <span className="nav-label">Customers</span>

            {activeTab === "customers" && (
              <span className="active-indicator"></span>
            )}
          </button>

          {/* Expenses */}
          <button
            type="button"
            className={`nav-item ${activeTab === "expenses" ? "active" : ""}`}
            onClick={() => handleNavigation("expenses")}
          >
            <span className="nav-icon-wrapper">
              <svg
                className="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </span>

            <span className="nav-label">Expenses</span>

            {activeTab === "expenses" && (
              <span className="active-indicator"></span>
            )}
          </button>
        </div>

        {/* PREFERENCES */}
        <div className="nav-section">
          <div className="nav-section-heading">
            <span className="nav-section-title">Insights & Preferences</span>
          </div>

          {/* Analytics */}
          <button
            type="button"
            className={`nav-item ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => handleNavigation("analytics")}
          >
            <span className="nav-icon-wrapper">
              <svg
                className="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </span>

            <span className="nav-label">Analytics</span>

            {activeTab === "analytics" && (
              <span className="active-indicator"></span>
            )}
          </button>

          {/* Settings */}
          <button
            type="button"
            className={`nav-item ${
              location.pathname === "/settings" || activeTab === "settings"
                ? "active"
                : ""
            }`}
            onClick={handleSettings}
          >
            <span className="nav-icon-wrapper">
              <svg
                className="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.42 1.42-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2v-.08a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.42-1.42.06-.06A1.7 1.7 0 0 0 9.4 15a1.7 1.7 0 0 0-1.56-1.03H7v-2h.84A1.7 1.7 0 0 0 9.4 10a1.7 1.7 0 0 0-.34-1.88L9 8.06l1.42-1.42.06.06A1.7 1.7 0 0 0 12.36 7.04 1.7 1.7 0 0 0 13.4 5.48V5h2v.48a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.42 1.42-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.03H21v2h-.04A1.7 1.7 0 0 0 19.4 15z" />
              </svg>
            </span>

            <span className="nav-label">Settings</span>

            {(location.pathname === "/settings" ||
              activeTab === "settings") && (
              <span className="active-indicator"></span>
            )}
          </button>
        </div>
      </nav>

      {/* =========================================
          FOOTER
      ========================================= */}
      <div className="sidebar-footer">
        {/* PRO CARD */}
        <div className="pro-card">
          <div className="pro-card-top">
            <div className="pro-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 3l2.5 5.5L20 9l-4 4 1 5.5-5-2.7-5 2.7L8 13l-4-4 5.5-.5L12 3z" />
              </svg>
            </div>

            <span className="pro-badge">PRO</span>
          </div>

          <div className="pro-content">
            <p className="pro-title">InvoiceFlow Business</p>

            <p className="pro-subtitle">Unlimited invoices & reports</p>
          </div>

          <div className="pro-progress">
            <span></span>
          </div>

          <p className="pro-upgrade-text">
            Everything you need to manage your business.
          </p>
        </div>

        {/* LOGOUT */}
        <button type="button" className="logout-item" onClick={onLogout}>
          <span className="logout-icon-wrapper">
            <svg
              className="logout-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>

          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
