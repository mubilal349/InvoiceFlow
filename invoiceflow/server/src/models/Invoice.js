import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const invoiceSchema = new mongoose.Schema(
  {
    // =========================================
    // INVOICE
    // =========================================

    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // =========================================
    // CUSTOMER REFERENCE
    // =========================================

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },

    // =========================================
    // CUSTOMER SNAPSHOT
    // =========================================

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    customerAddress: {
      type: String,
      trim: true,
      default: "",
    },

    // =========================================
    // ITEMS
    // =========================================

    items: {
      type: [invoiceItemSchema],
      required: true,
    },

    // =========================================
    // AMOUNTS
    // =========================================

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    tax: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    // =========================================
    // DATES
    // =========================================

    issueDate: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    // =========================================
    // STATUS
    // =========================================

    status: {
      type: String,
      enum: ["Draft", "Sent", "Paid", "Overdue", "Pending", "Cancelled"],
      default: "Draft",
    },

    // =========================================
    // NOTES
    // =========================================

    notes: {
      type: String,
      default: "",
    },

    // =========================================
    // CREATED BY
    // =========================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Invoice", invoiceSchema);
