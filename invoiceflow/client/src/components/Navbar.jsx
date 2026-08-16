import React from "react";
import "./Navbar.css";

const Navbar = ({ onToggleSidebar }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Mobile menu trigger */}
        <button
          className="mobile-menu-button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <span />
          <span />
          <span />
        </button>

        <div>
          <h2 className="navbar-title">InvoiceFlow</h2>
          <div className="navbar-subtitle">Business management</div>
        </div>
      </div>

      <div className="navbar-right">
        {/* User Info */}
        <div className="navbar-user">
          <div className="navbar-avatar">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="navbar-user-info">
            <span className="navbar-user-name">{user?.name || "User"}</span>
            <span className="navbar-user-role">{user?.role || "User"}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
