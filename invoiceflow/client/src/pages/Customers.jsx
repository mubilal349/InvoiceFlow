import React, { useEffect, useState } from "react";

import { getCustomersFromInvoices } from "../services/customerService";

import "./Customers.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =========================================
  // LOAD CUSTOMERS FROM INVOICES
  // =========================================

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCustomersFromInvoices();

      setCustomers(data.customers || []);
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
        <div>
          <h1>Customers</h1>

          <p>View customers and their invoice activity.</p>
        </div>

        <button
          className="refresh-customers-btn"
          style={{ cursor: "pointer" }}
          onClick={loadCustomers}
        >
          ↻ Refresh
        </button>
      </div>

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

                const outstanding = totalAmount - paidAmount;

                return (
                  <tr key={customer._id || customer.customerEmail}>
                    {/* CUSTOMER */}

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

                    {/* EMAIL */}

                    <td>{customer.customerEmail || "—"}</td>

                    {/* ADDRESS */}

                    <td>{customer.customerAddress || "—"}</td>

                    {/* INVOICE COUNT */}

                    <td>
                      <span className="invoice-count">
                        {customer.invoiceCount || 0}
                      </span>
                    </td>

                    {/* TOTAL */}

                    <td>
                      <span className="total-amount">
                        Rs. {totalAmount.toLocaleString()}
                      </span>
                    </td>

                    {/* PAID */}

                    <td>
                      <span className="paid-amount">
                        Rs. {paidAmount.toLocaleString()}
                      </span>
                    </td>

                    {/* OUTSTANDING */}

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
