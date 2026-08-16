import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./createInvoice.css";

const CreateInvoice = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    invoiceNumber: "",
    customerName: "",
    customerEmail: "",
    customerAddress: "",
    issueDate: "",
    dueDate: "",
    tax: 0,
    discount: 0,
    status: "Draft",
    notes: "",
  });

  const [items, setItems] = useState([
    {
      description: "",
      quantity: 1,
      price: 0,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==============================
  // HANDLE FORM INPUT
  // ==============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // HANDLE ITEM INPUT
  // ==============================

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  // ==============================
  // ADD ITEM
  // ==============================

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        description: "",
        quantity: 1,
        price: 0,
      },
    ]);
  };

  // ==============================
  // REMOVE ITEM
  // ==============================

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // ==============================
  // CALCULATIONS
  // ==============================

  const subtotal = items.reduce((total, item) => {
    return total + Number(item.quantity || 0) * Number(item.price || 0);
  }, 0);

  const tax = Number(form.tax || 0);

  const total = subtotal + tax;

  // ==============================
  // CREATE INVOICE
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token) {
        setError("Authentication required. Please login again.");
        return;
      }

      if (!user || user.role !== "admin") {
        setError("Only administrators can create invoices.");
        return;
      }

      const response = await fetch("http://localhost:8000/api/invoices", {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          invoiceNumber: form.invoiceNumber,
          customerName: form.customerName,
          customerEmail: form.customerEmail,

          issueDate: form.issueDate,
          dueDate: form.dueDate,

          items: items.map((item) => ({
            description: item.description,
            quantity: Number(item.quantity),
            price: Number(item.price),
          })),

          tax,
          status: form.status,
          notes: form.notes,
        }),
      });

      const data = await response.json();

      console.log("CREATE INVOICE RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create invoice");
      }

      alert("Invoice created successfully!");

      navigate("/invoices");
    } catch (error) {
      console.error("CREATE INVOICE ERROR:", error);

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-invoice-page">
      {/* HEADER */}

      <div className="create-invoice-header">
        <div>
          <h1>Create Invoice</h1>

          <p>Create a new invoice for your customer.</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/invoices")}
          className="back-invoice-btn"
        >
          ← Back to Invoices
        </button>
      </div>

      {/* ERROR */}

      {error && <div className="create-invoice-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* INVOICE INFORMATION */}

        <div className="create-invoice-card">
          <h2>Invoice Information</h2>

          <div className="create-invoice-grid">
            <div className="form-group">
              <label>Invoice Number</label>

              <input
                type="text"
                name="invoiceNumber"
                value={form.invoiceNumber}
                onChange={handleChange}
                placeholder="INV-001"
                required
              />
            </div>

            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="form-group">
              <label>Issue Date</label>

              <input
                type="date"
                name="issueDate"
                value={form.issueDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Due Date</label>

              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* CUSTOMER */}

        <div className="create-invoice-card">
          <h2>Customer Information</h2>

          <div className="create-invoice-grid">
            <div className="form-group">
              <label>Customer Name</label>

              <input
                type="text"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="Customer Name"
                required
              />
            </div>

            <div className="form-group">
              <label>Customer Email</label>

              <input
                type="email"
                name="customerEmail"
                value={form.customerEmail}
                onChange={handleChange}
                placeholder="customer@example.com"
              />
            </div>
          </div>
        </div>

        {/* ITEMS */}

        <div className="create-invoice-card">
          <div className="items-header">
            <h2>Invoice Items</h2>

            <button type="button" onClick={addItem} className="add-item-btn">
              + Add Item
            </button>
          </div>

          {items.map((item, index) => (
            <div className="invoice-item-row" key={index}>
              <div className="form-group item-description">
                <label>Description</label>

                <input
                  type="text"
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                  placeholder="Website development"
                  required
                />
              </div>

              <div className="form-group item-small">
                <label>Quantity</label>

                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group item-small">
                <label>Price</label>

                <input
                  type="number"
                  min="0"
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(index, "price", e.target.value)
                  }
                  required
                />
              </div>

              <div className="item-total">
                <span>Total</span>

                <strong>
                  Rs.{" "}
                  {(
                    Number(item.quantity || 0) * Number(item.price || 0)
                  ).toLocaleString()}
                </strong>
              </div>

              {items.length > 1 && (
                <button
                  type="button"
                  className="remove-item-btn"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* SUMMARY */}

        <div className="create-invoice-card">
          <h2>Payment Summary</h2>

          <div className="invoice-summary">
            <div>
              <span>Subtotal</span>

              <strong>Rs. {subtotal.toLocaleString()}</strong>
            </div>

            <div className="tax-row">
              <label>Tax</label>

              <input
                type="number"
                min="0"
                name="tax"
                value={form.tax}
                onChange={handleChange}
              />
            </div>

            <div className="invoice-grand-total">
              <span>Total</span>

              <strong>Rs. {total.toLocaleString()}</strong>
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>

            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Additional notes..."
              rows="4"
            />
          </div>
        </div>

        {/* ACTIONS */}

        <div className="create-invoice-actions">
          <button
            type="button"
            onClick={() => navigate("/invoices")}
            className="cancel-invoice-btn"
          >
            Cancel
          </button>

          <button type="submit" disabled={loading} className="save-invoice-btn">
            {loading ? "Creating..." : "Create Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;
