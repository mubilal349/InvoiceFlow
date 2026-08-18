import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getSettings,
  updateSettings,
  changePassword,
} from "../services/settingsService";

import "./Settings.css";

const defaultSettings = {
  profile: {
    name: "",
    email: "",
    phone: "",
    companyName: "",
    companyAddress: "",
    city: "",
    country: "",
    taxNumber: "",
  },

  invoice: {
    currency: "USD",
    invoicePrefix: "INV-",
    defaultTax: 0,
    paymentTerms: 30,
    defaultNotes: "",
    footerText: "Thank you for your business.",
  },

  notifications: {
    emailNotifications: true,
    invoiceCreated: true,
    paymentReceived: true,
    paymentReminder: true,
    dueDateReminder: true,
  },

  security: {
    sessionTimeout: 30,
    loginNotifications: true,
  },

  appearance: {
    theme: "light",
    language: "English",
  },
};

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(defaultSettings);

  const [activeSection, setActiveSection] = useState("profile");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ==========================================
  // LOAD SETTINGS
  // ==========================================

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);

      const data = await getSettings();

      if (data.settings) {
        setSettings({
          ...defaultSettings,
          ...data.settings,
        });
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,

      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // ==========================================
  // SAVE SETTINGS
  // ==========================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      await updateSettings(settings);

      // Update local user data
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        user.name = settings.profile.name;
        user.email = settings.profile.email;

        localStorage.setItem("user", JSON.stringify(user));
      }

      setMessage("Settings saved successfully.");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // PASSWORD
  // ==========================================

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setError("Please fill all password fields.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setSaving(true);

      await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setMessage("Password changed successfully.");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="settings-loading">
        <div className="settings-spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="settings-page">
      {/* HEADER */}

      <div className="settings-header">
        <div>
          <h1>Settings</h1>

          <p>Manage your InvoiceFlow account and preferences.</p>
        </div>

        <div className="settings-header-actions">
          <button
            className="back-dashboard-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>

          <button
            className="save-settings-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* ALERTS */}

      {message && <div className="settings-success">✓ {message}</div>}

      {error && <div className="settings-error">✕ {error}</div>}

      <div className="settings-layout">
        {/* SIDEBAR */}

        <div className="settings-menu">
          <button
            className={activeSection === "profile" ? "active" : ""}
            onClick={() => setActiveSection("profile")}
          >
            👤
            <span>Profile & Business</span>
          </button>

          <button
            className={activeSection === "invoice" ? "active" : ""}
            onClick={() => setActiveSection("invoice")}
          >
            🧾
            <span>Invoice Settings</span>
          </button>

          <button
            className={activeSection === "notifications" ? "active" : ""}
            onClick={() => setActiveSection("notifications")}
          >
            🔔
            <span>Notifications</span>
          </button>

          <button
            className={activeSection === "security" ? "active" : ""}
            onClick={() => setActiveSection("security")}
          >
            🔐
            <span>Security</span>
          </button>

          <button
            className={activeSection === "appearance" ? "active" : ""}
            onClick={() => setActiveSection("appearance")}
          >
            🎨
            <span>Appearance</span>
          </button>
        </div>

        {/* CONTENT */}

        <div className="settings-content">
          {/* PROFILE */}

          {activeSection === "profile" && (
            <section className="settings-card">
              <div className="section-title">
                <h2>Profile & Business</h2>
                <p>Manage your personal and business information.</p>
              </div>

              <div className="settings-grid">
                <div className="form-group">
                  <label>Full Name</label>

                  <input
                    type="text"
                    value={settings.profile.name}
                    onChange={(e) =>
                      handleChange("profile", "name", e.target.value)
                    }
                    placeholder="Muhammad Bilal"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>

                  <input
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) =>
                      handleChange("profile", "email", e.target.value)
                    }
                    placeholder="example@email.com"
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>

                  <input
                    type="text"
                    value={settings.profile.phone}
                    onChange={(e) =>
                      handleChange("profile", "phone", e.target.value)
                    }
                    placeholder="+92 300 0000000"
                  />
                </div>

                <div className="form-group">
                  <label>Company Name</label>

                  <input
                    type="text"
                    value={settings.profile.companyName}
                    onChange={(e) =>
                      handleChange("profile", "companyName", e.target.value)
                    }
                    placeholder="Your Company"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Business Address</label>

                  <input
                    type="text"
                    value={settings.profile.companyAddress}
                    onChange={(e) =>
                      handleChange("profile", "companyAddress", e.target.value)
                    }
                    placeholder="Business address"
                  />
                </div>

                <div className="form-group">
                  <label>City</label>

                  <input
                    type="text"
                    value={settings.profile.city}
                    onChange={(e) =>
                      handleChange("profile", "city", e.target.value)
                    }
                    placeholder="City"
                  />
                </div>

                <div className="form-group">
                  <label>Country</label>

                  <input
                    type="text"
                    value={settings.profile.country}
                    onChange={(e) =>
                      handleChange("profile", "country", e.target.value)
                    }
                    placeholder="Country"
                  />
                </div>

                <div className="form-group">
                  <label>Tax / VAT Number</label>

                  <input
                    type="text"
                    value={settings.profile.taxNumber}
                    onChange={(e) =>
                      handleChange("profile", "taxNumber", e.target.value)
                    }
                    placeholder="Tax number"
                  />
                </div>
              </div>
            </section>
          )}

          {/* INVOICE */}

          {activeSection === "invoice" && (
            <section className="settings-card">
              <div className="section-title">
                <h2>Invoice Settings</h2>

                <p>Configure default values used when creating invoices.</p>
              </div>

              <div className="settings-grid">
                <div className="form-group">
                  <label>Currency</label>

                  <select
                    value={settings.invoice.currency}
                    onChange={(e) =>
                      handleChange("invoice", "currency", e.target.value)
                    }
                  >
                    <option value="USD">USD - US Dollar</option>

                    <option value="PKR">PKR - Pakistani Rupee</option>

                    <option value="EUR">EUR - Euro</option>

                    <option value="GBP">GBP - British Pound</option>

                    <option value="AED">AED - UAE Dirham</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Invoice Prefix</label>

                  <input
                    type="text"
                    value={settings.invoice.invoicePrefix}
                    onChange={(e) =>
                      handleChange("invoice", "invoicePrefix", e.target.value)
                    }
                    placeholder="INV-"
                  />
                </div>

                <div className="form-group">
                  <label>Default Tax (%)</label>

                  <input
                    type="number"
                    min="0"
                    value={settings.invoice.defaultTax}
                    onChange={(e) =>
                      handleChange(
                        "invoice",
                        "defaultTax",
                        Number(e.target.value),
                      )
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Payment Terms</label>

                  <select
                    value={settings.invoice.paymentTerms}
                    onChange={(e) =>
                      handleChange(
                        "invoice",
                        "paymentTerms",
                        Number(e.target.value),
                      )
                    }
                  >
                    <option value="7">7 Days</option>
                    <option value="15">15 Days</option>
                    <option value="30">30 Days</option>
                    <option value="45">45 Days</option>
                    <option value="60">60 Days</option>
                    <option value="90">90 Days</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Default Invoice Notes</label>

                  <textarea
                    value={settings.invoice.defaultNotes}
                    onChange={(e) =>
                      handleChange("invoice", "defaultNotes", e.target.value)
                    }
                    placeholder="Enter default invoice notes..."
                  />
                </div>

                <div className="form-group full-width">
                  <label>Invoice Footer</label>

                  <textarea
                    value={settings.invoice.footerText}
                    onChange={(e) =>
                      handleChange("invoice", "footerText", e.target.value)
                    }
                    placeholder="Thank you for your business."
                  />
                </div>
              </div>
            </section>
          )}

          {/* NOTIFICATIONS */}

          {activeSection === "notifications" && (
            <section className="settings-card">
              <div className="section-title">
                <h2>Notifications</h2>

                <p>Choose which notifications you want to receive.</p>
              </div>

              <div className="toggle-list">
                <Toggle
                  title="Email Notifications"
                  description="Receive important InvoiceFlow notifications by email."
                  checked={settings.notifications.emailNotifications}
                  onChange={(value) =>
                    handleChange("notifications", "emailNotifications", value)
                  }
                />

                <Toggle
                  title="Invoice Created"
                  description="Notify you when a new invoice is created."
                  checked={settings.notifications.invoiceCreated}
                  onChange={(value) =>
                    handleChange("notifications", "invoiceCreated", value)
                  }
                />

                <Toggle
                  title="Payment Received"
                  description="Notify you when an invoice payment is received."
                  checked={settings.notifications.paymentReceived}
                  onChange={(value) =>
                    handleChange("notifications", "paymentReceived", value)
                  }
                />

                <Toggle
                  title="Payment Reminder"
                  description="Receive reminders for pending payments."
                  checked={settings.notifications.paymentReminder}
                  onChange={(value) =>
                    handleChange("notifications", "paymentReminder", value)
                  }
                />

                <Toggle
                  title="Due Date Reminder"
                  description="Receive reminders when invoice due dates are approaching."
                  checked={settings.notifications.dueDateReminder}
                  onChange={(value) =>
                    handleChange("notifications", "dueDateReminder", value)
                  }
                />
              </div>
            </section>
          )}

          {/* SECURITY */}

          {activeSection === "security" && (
            <>
              <section className="settings-card">
                <div className="section-title">
                  <h2>Security</h2>

                  <p>Manage your account security preferences.</p>
                </div>

                <div className="form-group">
                  <label>Session Timeout</label>

                  <select
                    value={settings.security.sessionTimeout}
                    onChange={(e) =>
                      handleChange(
                        "security",
                        "sessionTimeout",
                        Number(e.target.value),
                      )
                    }
                  >
                    <option value="5">5 Minutes</option>
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">60 Minutes</option>
                    <option value="120">120 Minutes</option>
                  </select>
                </div>

                <div className="security-toggle">
                  <Toggle
                    title="Login Notifications"
                    description="Notify me when a new login occurs."
                    checked={settings.security.loginNotifications}
                    onChange={(value) =>
                      handleChange("security", "loginNotifications", value)
                    }
                  />
                </div>
              </section>

              <section className="settings-card password-card">
                <div className="section-title">
                  <h2>Change Password</h2>

                  <p>Update your account password.</p>
                </div>

                <form onSubmit={handlePasswordChange}>
                  <div className="form-group">
                    <label>Current Password</label>

                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>New Password</label>

                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirm New Password</label>

                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="password-btn"
                    disabled={saving}
                  >
                    {saving ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </section>
            </>
          )}

          {/* APPEARANCE */}

          {activeSection === "appearance" && (
            <section className="settings-card">
              <div className="section-title">
                <h2>Appearance</h2>

                <p>Customize how InvoiceFlow looks and behaves.</p>
              </div>

              <div className="form-group">
                <label>Theme</label>

                <select
                  value={settings.appearance.theme}
                  onChange={(e) =>
                    handleChange("appearance", "theme", e.target.value)
                  }
                >
                  <option value="light">Light</option>

                  <option value="dark">Dark</option>

                  <option value="system">System Default</option>
                </select>
              </div>

              <div className="form-group">
                <label>Language</label>

                <select
                  value={settings.appearance.language}
                  onChange={(e) =>
                    handleChange("appearance", "language", e.target.value)
                  }
                >
                  <option value="English">English</option>

                  <option value="Urdu">Urdu</option>
                </select>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// TOGGLE COMPONENT
// ==========================================

const Toggle = ({ title, description, checked, onChange }) => {
  return (
    <div className="toggle-row">
      <div className="toggle-info">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>

      <label className="switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />

        <span className="slider"></span>
      </label>
    </div>
  );
};

export default Settings;
