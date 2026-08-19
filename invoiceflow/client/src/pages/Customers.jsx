import React, { useEffect, useState } from "react";

import { getCustomersFromInvoices } from "../services/customerService";

import "./Customers.css";

const Customers = () => {
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    country: "",
    notes: "",
  });

  const [savingCustomer, setSavingCustomer] = useState(false);
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;

    setCustomerForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();

    try {
      setSavingCustomer(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8000/api/customers", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(customerForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create customer");
      }

      // Close modal
      setShowCustomerModal(false);

      // Reset form
      setCustomerForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        address: "",
        city: "",
        country: "",
        notes: "",
      });

      // Reload customers
      await loadCustomers();
    } catch (error) {
      console.error("Create customer error:", error);
      setError(error.message);
    } finally {
      setSavingCustomer(false);
    }
  };

  // pdf
  const handleDownloadCustomersPDF = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required. Please login again.");
      }

      const response = await fetch("http://localhost:8000/api/customers/pdf", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(
          errorData.message || "Failed to generate customers PDF",
        );
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "customers-list.pdf";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Customer PDF download error:", error);

      alert(error.message || "Unable to download customers PDF");
    }
  };

  // =========================================
  // LOAD CUSTOMERS FROM INVOICES
  // =========================================

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCustomersFromInvoices();

      console.log("CUSTOMERS API RESPONSE:", data);
      console.log("CUSTOMERS ARRAY:", data);

      setCustomers(data || []);
    } catch (error) {
      console.error("Load customers error:", error);
      setError(error.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="customers-page">
        <div className="customers-loading">
          <div className="customers-spinner"></div>

          <p>Loading customers...</p>
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <div className="customers-page">
        <div className="customers-error">
          <h3>Unable to load customers</h3>

          <p>{error}</p>

          <button className="retry-button" onClick={loadCustomers}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="customers-page">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="customers-header">
        <button
          className="add-customer-btn"
          onClick={() => setShowCustomerModal(true)}
        >
          + Add Customer
        </button>

        <button
          className="download-customers-btn"
          onClick={handleDownloadCustomersPDF}
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

        <button className="refresh-customers-btn" onClick={loadCustomers}>
          ↻ Refresh
        </button>
      </div>

      {showCustomerModal && (
        <div
          className="customer-modal-overlay"
          onClick={() => setShowCustomerModal(false)}
        >
          <div className="customer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="customer-modal-header">
              <div>
                <h2>Add Customer</h2>
                <p>Create a new customer manually.</p>
              </div>

              <button
                className="customer-modal-close"
                onClick={() => setShowCustomerModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateCustomer}>
              <div className="customer-form-grid">
                <div className="customer-form-group">
                  <label>Name *</label>

                  <input
                    type="text"
                    name="name"
                    value={customerForm.name}
                    onChange={handleCustomerChange}
                    placeholder="Customer name"
                    required
                  />
                </div>

                <div className="customer-form-group">
                  <label>Email *</label>

                  <input
                    type="email"
                    name="email"
                    value={customerForm.email}
                    onChange={handleCustomerChange}
                    placeholder="customer@example.com"
                    required
                  />
                </div>

                <div className="customer-form-group">
                  <label>Phone</label>

                  <input
                    type="text"
                    name="phone"
                    value={customerForm.phone}
                    onChange={handleCustomerChange}
                    placeholder="Phone number"
                  />
                </div>

                <div className="customer-form-group">
                  <label>Company</label>

                  <input
                    type="text"
                    name="company"
                    value={customerForm.company}
                    onChange={handleCustomerChange}
                    placeholder="Company name"
                  />
                </div>

                <div className="customer-form-group customer-form-full">
                  <label>Address</label>

                  <input
                    type="text"
                    name="address"
                    value={customerForm.address}
                    onChange={handleCustomerChange}
                    placeholder="Street address"
                  />
                </div>

                <div className="customer-form-group">
                  <label>City</label>

                  <input
                    type="text"
                    name="city"
                    value={customerForm.city}
                    onChange={handleCustomerChange}
                    placeholder="City"
                  />
                </div>

                <div className="customer-form-group">
                  <label>Country</label>

                  <input
                    type="text"
                    name="country"
                    value={customerForm.country}
                    onChange={handleCustomerChange}
                    placeholder="Country"
                  />
                </div>

                <div className="customer-form-group customer-form-full">
                  <label>Notes</label>

                  <textarea
                    name="notes"
                    value={customerForm.notes}
                    onChange={handleCustomerChange}
                    placeholder="Additional notes..."
                    rows="4"
                  />
                </div>
              </div>

              <div className="customer-modal-actions">
                <button
                  type="button"
                  className="customer-cancel-btn"
                  onClick={() => setShowCustomerModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="customer-save-btn"
                  disabled={savingCustomer}
                >
                  {savingCustomer ? "Creating..." : "Create Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================
          CUSTOMER TABLE
      ===================================== */}

      {customers.length === 0 ? (
        <div className="empty-customers">
          <div className="empty-customer-icon">👥</div>

          <h3>No customers yet</h3>

          <p>
            Customers will automatically appear here when you create invoices.
          </p>
        </div>
      ) : (
        <div className="customers-table">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Address</th>
                <th>Invoices</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Outstanding</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => {
                const totalAmount = Number(customer.totalAmount || 0);
                const paidAmount = Number(customer.paidAmount || 0);
                const outstanding = Number(customer.outstanding || 0);

                return (
                  <tr key={customer._id || customer.customerEmail}>
                    <td>
                      <div className="customer-name-cell">
                        <div className="customer-avatar">
                          {customer.customerName?.charAt(0)?.toUpperCase() ||
                            "?"}
                        </div>

                        <div className="customer-info">
                          <strong>
                            {customer.customerName || "Unknown Customer"}
                          </strong>
                        </div>
                      </div>
                    </td>

                    <td>{customer.customerEmail || "—"}</td>

                    <td>{customer.customerAddress || "—"}</td>

                    <td>
                      <span className="invoice-count">
                        {customer.invoiceCount || 0}
                      </span>
                    </td>

                    <td>
                      <span className="total-amount">
                        Rs. {totalAmount.toLocaleString()}
                      </span>
                    </td>

                    <td>
                      <span className="paid-amount">
                        Rs. {paidAmount.toLocaleString()}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          outstanding > 0 ? "outstanding-amount" : "paid-status"
                        }
                      >
                        Rs. {outstanding.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Customers;
