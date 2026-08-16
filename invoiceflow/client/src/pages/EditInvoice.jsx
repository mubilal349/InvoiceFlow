import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditInvoice.css";

const EditInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  const [items, setItems] = useState([]);

  // =========================================
  // GET INVOICE
  // =========================================

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`http://localhost:8000/api/invoices/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        throw new Error(data.message || "Failed to fetch invoice");
      }

      const invoice = data.invoice;

      setForm({
        invoiceNumber: invoice.invoiceNumber || "",
        customerName: invoice.customerName || "",
        customerEmail: invoice.customerEmail || "",
        customerAddress: invoice.customerAddress || "",
        issueDate: invoice.issueDate ? invoice.issueDate.split("T")[0] : "",
        dueDate: invoice.dueDate ? invoice.dueDate.split("T")[0] : "",
        tax: invoice.tax || 0,
        discount: invoice.discount || 0,
        status: invoice.status || "Draft",
        notes: invoice.notes || "",
      });

      setItems(
        (invoice.items || []).map((item) => ({
          description: item.description || "",
          quantity: item.quantity || 1,
          price: item.price || 0,
        })),
      );
    } catch (error) {
      console.error("FETCH INVOICE ERROR:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // FORM CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // ITEM CHANGE
  // =========================================

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

  // =========================================
  // ADD ITEM
  // =========================================

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

  // =========================================
  // REMOVE ITEM
  // =========================================

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // =========================================
  // CALCULATE TOTALS
  // =========================================

  const subtotal = items.reduce((sum, item) => {
    return sum + Number(item.quantity || 0) * Number(item.price || 0);
  }, 0);

  const tax = Number(form.tax || 0);
  const discount = Number(form.discount || 0);

  const total = Math.max(0, subtotal + tax - discount);

  // =========================================
  // UPDATE INVOICE
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`http://localhost:8000/api/invoices/${id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          invoiceNumber: form.invoiceNumber,
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          customerAddress: form.customerAddress,

          issueDate: form.issueDate,
          dueDate: form.dueDate,

          items: items.map((item) => ({
            description: item.description,
            quantity: Number(item.quantity),
            price: Number(item.price),
            total: Number(item.quantity) * Number(item.price),
          })),

          subtotal,

          tax,

          discount,

          total,

          status: form.status,

          notes: form.notes,
        }),
      });

      const data = await response.json();

      console.log("UPDATE INVOICE RESPONSE:", data);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");

          return;
        }

        if (response.status === 403) {
          setError("Only administrators can update invoices.");

          return;
        }

        throw new Error(data.message || "Failed to update invoice");
      }

      alert("Invoice updated successfully!");

      navigate("/invoices");
    } catch (error) {
      console.error("UPDATE INVOICE ERROR:", error);

      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="create-invoice-page">
        <h2>Loading invoice...</h2>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error && !form.invoiceNumber) {
    return (
      <div className="create-invoice-page">
        <div className="create-invoice-error">{error}</div>

        <button
          type="button"
          onClick={() => navigate("/invoices")}
          className="back-invoice-btn"
        >
          ← Back to Invoices
        </button>
      </div>
    );
  }

  // =========================================
  // UI
  // =========================================

  return (
    <div className="create-invoice-page">
      {/* HEADER */}

      <div className="create-invoice-header">
        <div>
          <h1>Edit Invoice</h1>

          <p>Update the invoice information below.</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/invoices")}
          className="back-invoice-btn"
        >
          ← Back to Invoices
        </button>
      </div>

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
              />
            </div>

            <div className="form-group">
              <label>Customer Address</label>

              <textarea
                name="customerAddress"
                value={form.customerAddress}
                onChange={handleChange}
                rows="3"
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

        {/* PAYMENT */}

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

            <div className="tax-row">
              <label>Discount</label>

              <input
                type="number"
                min="0"
                name="discount"
                value={form.discount}
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

          <button type="submit" disabled={saving} className="save-invoice-btn">
            {saving ? "Updating..." : "Update Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditInvoice;
