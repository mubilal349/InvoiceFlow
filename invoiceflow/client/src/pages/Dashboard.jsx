import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Invoice from "./Invoices";
import Customers from "./Customers";
import "./Dashboard.css";
import Expenses from "./Expenses";
import Analytics from "./Analytics";

import { getInvoices } from "../services/invoiceService";

import { getFinancialSummary } from "../services/expenseService";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("dashboard");

  const [invoices, setInvoices] = useState([]);

  const [financial, setFinancial] = useState({
    revenue: 0,
    expenses: 0,
    profit: 0,
  });

  // BUSINESS OVERVIEW STATE
  const [overviewPeriod, setOverviewPeriod] = useState("month");

  const [overviewData, setOverviewData] = useState([]);

  const [overviewProfit, setOverviewProfit] = useState(0);

  const [chartMax, setChartMax] = useState(100);

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString();
  };

  const getDateRange = () => {
    const now = new Date();

    let startDate;
    let endDate;

    if (overviewPeriod === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);

      endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
    } else if (overviewPeriod === "lastMonth") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);

      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    }

    return {
      startDate,
      endDate,
    };
  };

  const loadBusinessOverview = async () => {
    try {
      const [invoiceResponse, financialResponse] = await Promise.all([
        getInvoices(),

        getFinancialSummary(),
      ]);

      const invoices = invoiceResponse?.invoices || [];

      const financial = financialResponse?.financial || {
        revenue: 0,
        expenses: 0,
        profit: 0,
      };

      const { startDate, endDate } = getDateRange();

      const filteredInvoices = invoices.filter((invoice) => {
        const invoiceDate = new Date(
          invoice.createdAt || invoice.date || invoice.invoiceDate,
        );

        return invoiceDate >= startDate && invoiceDate <= endDate;
      });

      /*
    =========================================
    CREATE CHART PERIODS
    =========================================
    */

      let periods = [];

      if (overviewPeriod === "year") {
        periods = Array.from({ length: 12 }, (_, index) => {
          return {
            label: new Date(2000, index, 1).toLocaleString("default", {
              month: "short",
            }),

            month: index,

            revenue: 0,

            expenses: 0,
          };
        });
      } else {
        const daysInMonth = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          0,
        ).getDate();

        /*
      For month view use weekly
      data instead of 30+ bars.
      */

        periods = [
          {
            label: "Week 1",
            start: 1,
            end: 7,
            revenue: 0,
            expenses: 0,
          },

          {
            label: "Week 2",
            start: 8,
            end: 14,
            revenue: 0,
            expenses: 0,
          },

          {
            label: "Week 3",
            start: 15,
            end: 21,
            revenue: 0,
            expenses: 0,
          },

          {
            label: "Week 4",
            start: 22,
            end: daysInMonth,
            revenue: 0,
            expenses: 0,
          },
        ];
      }

      /*
    =========================================
    ADD INVOICE REVENUE
    =========================================
    */

      filteredInvoices.forEach((invoice) => {
        const date = new Date(
          invoice.createdAt || invoice.date || invoice.invoiceDate,
        );

        /*
        Try common invoice amount fields
        */

        const amount = Number(
          invoice.totalAmount ??
            invoice.total ??
            invoice.grandTotal ??
            invoice.amount ??
            0,
        );

        if (overviewPeriod === "year") {
          periods[date.getMonth()].revenue += amount;
        } else {
          const day = date.getDate();

          const period = periods.find(
            (item) => day >= item.start && day <= item.end,
          );

          if (period) {
            period.revenue += amount;
          }
        }
      });

      /*
    =========================================
    EXPENSE DATA
    =========================================
    */

      /*
    We get total expenses from the
    financial summary.

    If your backend returns detailed
    expenses, you can later use those
    records for exact period filtering.
    */

      const totalExpenses = Number(financial.expenses || 0);

      /*
    =========================================
    DISTRIBUTE EXPENSES
    =========================================
    */

      if (overviewPeriod === "year") {
        /*
      If backend doesn't provide
      monthly expenses, temporarily
      show total expense in the
      current month.

      */

        const currentMonth = new Date().getMonth();

        if (currentMonth >= 0 && currentMonth < periods.length) {
          periods[currentMonth].expenses = totalExpenses;
        }
      } else {
        /*
      For month view we show the
      total expenses in the current
      period.

      */

        periods[0].expenses = totalExpenses;
      }

      /*
    =========================================
    CALCULATE MAX
    =========================================
    */

      const maximum = Math.max(
        ...periods.map((item) => Math.max(item.revenue, item.expenses)),

        100,
      );

      setChartMax(maximum);

      setOverviewData(periods);

      /*
    =========================================
    PROFIT
    =========================================
    */

      const revenue = filteredInvoices.reduce((sum, invoice) => {
        return (
          sum +
          Number(
            invoice.totalAmount ??
              invoice.total ??
              invoice.grandTotal ??
              invoice.amount ??
              0,
          )
        );
      }, 0);

      setOverviewProfit(revenue - totalExpenses);
    } catch (error) {
      console.error("Business overview error:", error);

      setOverviewData([]);
    }
  };

  useEffect(() => {
    loadBusinessOverview();
  }, [overviewPeriod]);

  const user = JSON.parse(localStorage.getItem("user"));

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    loadFinancialSummary();
  }, []);

  // EXPENSES FUNCTION

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

                  <h2>Rs{totalRevenue.toFixed(2)}</h2>

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

                  <h2>
                    Rs. {Number(financial?.expenses || 0).toLocaleString()}
                  </h2>

                  <span className="stat-change">
                    {Number(financial?.expenses || 0) > 0
                      ? "Total expenses recorded"
                      : "No expenses recorded"}
                  </span>
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

                    <button
                      className="quick-action"
                      onClick={() => setActiveTab("expenses")}
                    >
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
                {/* HEADER */}

                <div className="card-header">
                  <div>
                    <h3>Business Overview</h3>

                    <p>Your financial activity will appear here.</p>
                  </div>

                  <select
                    className="period-select"
                    value={overviewPeriod}
                    onChange={(e) => setOverviewPeriod(e.target.value)}
                  >
                    <option value="month">This month</option>

                    <option value="lastMonth">Last month</option>

                    <option value="year">This year</option>
                  </select>
                </div>

                {/* FINANCIAL CHART */}

                <div className="business-chart">
                  {/* Y AXIS */}

                  <div className="chart-y-axis">
                    <span>Rs. {formatAmount(chartMax)}</span>

                    <span>Rs. {formatAmount(chartMax * 0.75)}</span>

                    <span>Rs. {formatAmount(chartMax * 0.5)}</span>

                    <span>Rs. {formatAmount(chartMax * 0.25)}</span>

                    <span>Rs. 0</span>
                  </div>

                  {/* CHART AREA */}

                  <div className="chart-area">
                    {/* GRID */}

                    <div className="chart-grid">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                    {/* BARS */}

                    <div className="chart-bars">
                      {overviewData.map((item, index) => {
                        const revenueHeight =
                          chartMax > 0 ? (item.revenue / chartMax) * 100 : 0;

                        const expenseHeight =
                          chartMax > 0 ? (item.expenses / chartMax) * 100 : 0;

                        return (
                          <div className="chart-column" key={index}>
                            <div className="chart-bars-wrapper">
                              {/* REVENUE */}

                              <div
                                className="chart-bar revenue-bar"
                                style={{
                                  height: `${Math.max(
                                    revenueHeight,
                                    item.revenue > 0 ? 3 : 0,
                                  )}%`,
                                }}
                                title={`Revenue: Rs. ${item.revenue.toLocaleString()}`}
                              ></div>

                              {/* EXPENSE */}

                              <div
                                className="chart-bar expense-bar"
                                style={{
                                  height: `${Math.max(
                                    expenseHeight,
                                    item.expenses > 0 ? 3 : 0,
                                  )}%`,
                                }}
                                title={`Expenses: Rs. ${item.expenses.toLocaleString()}`}
                              ></div>
                            </div>

                            {/* LABEL */}

                            <span className="chart-label">{item.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* LEGEND */}

                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-dot revenue-dot"></span>

                    <span>Revenue</span>
                  </div>

                  <div className="legend-item">
                    <span className="legend-dot expense-dot"></span>

                    <span>Expenses</span>
                  </div>

                  <div className="chart-total">
                    <span>Profit</span>

                    <strong
                      className={overviewProfit < 0 ? "negative-profit" : ""}
                    >
                      Rs. {overviewProfit.toLocaleString()}
                    </strong>
                  </div>
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

          {/* =========================================
             Expenses TAB
          ========================================= */}

          {activeTab === "expenses" && <Expenses />}

          {/* =========================================
             Analytics TAB
          ========================================= */}

          {activeTab === "analytics" && <Analytics />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
