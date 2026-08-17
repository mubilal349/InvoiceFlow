import React, { useEffect, useState } from "react";

import { getAnalytics } from "../services/analyticsService";

import "./Analytics.css";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);

  const [period, setPeriod] = useState("month");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =========================================
  // LOAD
  // =========================================

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      setError("");

      const data = await getAnalytics(period);

      setAnalytics(data.analytics);
    } catch (error) {
      console.error("Analytics error:", error);

      setError(error.message || "Unable to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  // =========================================
  // FORMAT
  // =========================================

  const money = (value) => {
    return Number(value || 0).toLocaleString();
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-loading">
          <div className="analytics-spinner"></div>

          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <div className="analytics-page">
        <div className="analytics-error">
          <h3>Unable to load analytics</h3>

          <p>{error}</p>

          <button onClick={loadAnalytics}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  // =========================================
  // DATA
  // =========================================

  const {
    revenue = 0,

    expenses = 0,

    profit = 0,

    invoiceCount = 0,

    expenseCount = 0,

    averageInvoice = 0,

    invoiceStatus = {},

    expenseCategories = [],

    topCustomers = [],

    monthlyData = [],
  } = analytics;

  const maxChartValue = Math.max(
    ...monthlyData.map((item) => Math.max(item.revenue, item.expenses)),

    100,
  );

  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="analytics-page">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="analytics-header">
        <div>
          <h1>Analytics</h1>

          <p>Understand your business performance and financial activity.</p>
        </div>

        <div className="analytics-actions">
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="month">This Month</option>

            <option value="lastMonth">Last Month</option>

            <option value="year">This Year</option>
          </select>

          <button onClick={loadAnalytics}>↻ Refresh</button>
        </div>
      </div>

      {/* =====================================
          FINANCIAL CARDS
      ===================================== */}

      <div className="analytics-stat-grid">
        {/* REVENUE */}

        <div className="analytics-stat-card">
          <div className="analytics-stat-top">
            <span>Revenue</span>

            <div className="analytics-icon revenue">💰</div>
          </div>

          <h2>Rs. {money(revenue)}</h2>

          <small>{invoiceCount} invoices</small>
        </div>

        {/* EXPENSES */}

        <div className="analytics-stat-card">
          <div className="analytics-stat-top">
            <span>Expenses</span>

            <div className="analytics-icon expense">💸</div>
          </div>

          <h2>Rs. {money(expenses)}</h2>

          <small>{expenseCount} records</small>
        </div>

        {/* PROFIT */}

        <div className="analytics-stat-card">
          <div className="analytics-stat-top">
            <span>Profit</span>

            <div className="analytics-icon profit">📈</div>
          </div>

          <h2 className={profit < 0 ? "negative" : ""}>Rs. {money(profit)}</h2>

          <small>Revenue − Expenses</small>
        </div>

        {/* AVERAGE */}

        <div className="analytics-stat-card">
          <div className="analytics-stat-top">
            <span>Average Invoice</span>

            <div className="analytics-icon average">🧾</div>
          </div>

          <h2>Rs. {money(averageInvoice)}</h2>

          <small>Per invoice</small>
        </div>
      </div>

      {/* =====================================
          REVENUE VS EXPENSES
      ===================================== */}

      <div className="analytics-card">
        <div className="analytics-card-header">
          <div>
            <h3>Revenue vs Expenses</h3>

            <p>Monthly financial performance</p>
          </div>

          <div className="chart-legend">
            <span>
              <i className="revenue-dot"></i>
              Revenue
            </span>

            <span>
              <i className="expense-dot"></i>
              Expenses
            </span>
          </div>
        </div>

        <div className="analytics-chart">
          {monthlyData.map((item, index) => {
            const revenueHeight = (item.revenue / maxChartValue) * 100;

            const expenseHeight = (item.expenses / maxChartValue) * 100;

            return (
              <div className="analytics-column" key={index}>
                <div className="analytics-bars">
                  <div
                    className="analytics-bar revenue-bar"
                    style={{
                      height: `${Math.max(
                        revenueHeight,
                        item.revenue > 0 ? 3 : 0,
                      )}%`,
                    }}
                    title={`Revenue: Rs. ${money(item.revenue)}`}
                  ></div>

                  <div
                    className="analytics-bar expense-bar"
                    style={{
                      height: `${Math.max(
                        expenseHeight,
                        item.expenses > 0 ? 3 : 0,
                      )}%`,
                    }}
                    title={`Expenses: Rs. ${money(item.expenses)}`}
                  ></div>
                </div>

                <span>{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================
          TWO COLUMN SECTION
      ===================================== */}

      <div className="analytics-two-column">
        {/* EXPENSE CATEGORIES */}

        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h3>Expenses by Category</h3>

              <p>Where your money is going</p>
            </div>
          </div>

          <div className="category-list">
            {expenseCategories.length === 0 ? (
              <div className="analytics-empty">No expenses recorded.</div>
            ) : (
              expenseCategories.map((item, index) => {
                const percentage =
                  expenses > 0 ? (item.amount / expenses) * 100 : 0;

                return (
                  <div className="category-item" key={index}>
                    <div className="category-info">
                      <span>{item.category}</span>

                      <strong>Rs. {money(item.amount)}</strong>
                    </div>

                    <div className="category-progress">
                      <div
                        style={{
                          width: `${percentage}%`,
                        }}
                      ></div>
                    </div>

                    <small>{percentage.toFixed(1)}%</small>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* INVOICE STATUS */}

        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h3>Invoice Status</h3>

              <p>Current invoice distribution</p>
            </div>
          </div>

          <div className="invoice-status-list">
            <div className="status-row">
              <span>
                <i className="status-paid"></i>
                Paid
              </span>

              <strong>{invoiceStatus.paid || 0}</strong>
            </div>

            <div className="status-row">
              <span>
                <i className="status-pending"></i>
                Pending
              </span>

              <strong>{invoiceStatus.pending || 0}</strong>
            </div>

            <div className="status-row">
              <span>
                <i className="status-overdue"></i>
                Overdue
              </span>

              <strong>{invoiceStatus.overdue || 0}</strong>
            </div>

            <div className="status-row">
              <span>
                <i className="status-draft"></i>
                Draft
              </span>

              <strong>{invoiceStatus.draft || 0}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================
          TOP CUSTOMERS
      ===================================== */}

      <div className="analytics-card">
        <div className="analytics-card-header">
          <div>
            <h3>Top Customers</h3>

            <p>Customers generating the most revenue</p>
          </div>
        </div>

        {topCustomers.length === 0 ? (
          <div className="analytics-empty">No customer data available.</div>
        ) : (
          <div className="top-customers-table">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>

                  <th>Invoices</th>

                  <th>Revenue</th>
                </tr>
              </thead>

              <tbody>
                {topCustomers.map((customer, index) => (
                  <tr key={index}>
                    <td>
                      <div className="analytics-customer">
                        <div>
                          {customer.customerName?.charAt(0)?.toUpperCase() ||
                            "?"}
                        </div>

                        <strong>{customer.customerName}</strong>
                      </div>
                    </td>

                    <td>{customer.invoices}</td>

                    <td>
                      <strong>Rs. {money(customer.revenue)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
