import Invoice from "../models/Invoice.js";
import PDFDocument from "pdfkit";

/*
=========================================
GET ALL INVOICES

ADMIN + USER
=========================================
*/

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      invoices,
    });
  } catch (error) {
    console.error("Get invoices error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoices",
    });
  }
};

/*
=========================================
GET SINGLE INVOICE

ADMIN + USER
=========================================
*/

export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    return res.status(200).json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error("Get invoice error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoice",
    });
  }
};

/*
=========================================
CREATE INVOICE

ADMIN ONLY
=========================================
*/

export const createInvoice = async (req, res) => {
  try {
    const {
      invoiceNumber,
      customerName,
      customerEmail,
      customerAddress,
      issueDate,
      dueDate,
      items,
      tax = 0,
      discount = 0,
      status = "Draft",
      notes = "",
    } = req.body;

    // ==============================
    // VALIDATION
    // ==============================

    if (!invoiceNumber || !customerName || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Invoice number, customer name and due date are required",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one invoice item is required",
      });
    }

    // ==============================
    // CHECK DUPLICATE
    // ==============================

    const existingInvoice = await Invoice.findOne({
      invoiceNumber: invoiceNumber.trim(),
    });

    if (existingInvoice) {
      return res.status(409).json({
        success: false,
        message: "Invoice number already exists",
      });
    }

    // ==============================
    // CALCULATE ITEMS
    // ==============================

    const calculatedItems = items.map((item) => {
      const quantity = Number(item.quantity);
      const price = Number(item.price);

      if (!item.description?.trim()) {
        throw new Error("Each invoice item must have a description");
      }

      if (quantity < 1) {
        throw new Error("Item quantity must be at least 1");
      }

      if (price < 0) {
        throw new Error("Item price cannot be negative");
      }

      return {
        description: item.description.trim(),
        quantity,
        price,
        total: quantity * price,
      };
    });

    // ==============================
    // CALCULATE SUBTOTAL
    // ==============================

    const subtotal = calculatedItems.reduce((sum, item) => sum + item.total, 0);

    // ==============================
    // TAX + DISCOUNT
    // ==============================

    const taxAmount = Math.max(0, Number(tax) || 0);

    const discountAmount = Math.max(0, Number(discount) || 0);

    // ==============================
    // FINAL TOTAL
    // ==============================

    const total = Math.max(0, subtotal + taxAmount - discountAmount);

    // ==============================
    // VALIDATE STATUS
    // ==============================

    const allowedStatuses = ["Draft", "Sent", "Paid", "Overdue", "Cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice status",
      });
    }

    // ==============================
    // CREATE INVOICE
    // ==============================

    const invoice = await Invoice.create({
      invoiceNumber: invoiceNumber.trim(),

      customerName: customerName.trim(),

      customerEmail: customerEmail?.trim().toLowerCase() || "",

      customerAddress: customerAddress?.trim() || "",

      items: calculatedItems,

      subtotal,

      tax: taxAmount,

      discount: discountAmount,

      total,

      issueDate: issueDate || new Date(),

      dueDate,

      status,

      notes: notes || "",

      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      invoice,
    });
  } catch (error) {
    console.error("CREATE INVOICE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create invoice",
    });
  }
};

/*
=========================================
UPDATE INVOICE

ADMIN ONLY
=========================================
*/

export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const {
      invoiceNumber,
      customerName,
      customerEmail,
      customerAddress,
      issueDate,
      dueDate,
      items,
      subtotal,
      tax,
      total,
      status,
      notes,
    } = req.body;

    invoice.invoiceNumber = invoiceNumber ?? invoice.invoiceNumber;

    invoice.customerName = customerName ?? invoice.customerName;

    invoice.customerEmail = customerEmail ?? invoice.customerEmail;

    invoice.customerAddress = customerAddress ?? invoice.customerAddress;

    invoice.issueDate = issueDate ?? invoice.issueDate;

    invoice.dueDate = dueDate ?? invoice.dueDate;

    invoice.items = items ?? invoice.items;

    invoice.subtotal = subtotal ?? invoice.subtotal;

    invoice.tax = tax ?? invoice.tax;

    invoice.total = total ?? invoice.total;

    invoice.status = status ?? invoice.status;

    invoice.notes = notes ?? invoice.notes;

    await invoice.save();

    return res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      invoice,
    });
  } catch (error) {
    console.error("Update invoice error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update invoice",
    });
  }
};

/*
=========================================
DELETE INVOICE

ADMIN ONLY
=========================================
*/

export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    await Invoice.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.error("Delete invoice error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete invoice",
    });
  }
};

export const downloadInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
    });

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${invoice.invoiceNumber}.pdf"`,
    );

    doc.pipe(res);

    // =========================
    // HEADER
    // =========================

    doc.fontSize(26).font("Helvetica-Bold").text("INVOICE", {
      align: "right",
    });

    doc.moveDown();

    doc
      .fontSize(11)
      .font("Helvetica")
      .text(`Invoice #: ${invoice.invoiceNumber}`, {
        align: "right",
      });

    doc.text(
      `Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}`,
      {
        align: "right",
      },
    );

    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, {
      align: "right",
    });

    doc.moveDown(2);

    // =========================
    // CUSTOMER
    // =========================

    doc.fontSize(14).font("Helvetica-Bold").text("Bill To");

    doc.fontSize(11).font("Helvetica").text(invoice.customerName);

    if (invoice.customerEmail) {
      doc.text(invoice.customerEmail);
    }

    if (invoice.customerAddress) {
      doc.text(invoice.customerAddress);
    }

    doc.moveDown(2);

    // =========================
    // TABLE HEADER
    // =========================

    const tableTop = doc.y;

    doc.font("Helvetica-Bold").text("Description", 50, tableTop);

    doc.text("Qty", 300, tableTop);

    doc.text("Price", 360, tableTop);

    doc.text("Total", 450, tableTop);

    doc
      .moveTo(50, tableTop + 18)
      .lineTo(545, tableTop + 18)
      .stroke();

    // =========================
    // ITEMS
    // =========================

    let y = tableTop + 30;

    doc.font("Helvetica");

    invoice.items.forEach((item) => {
      doc.text(item.description, 50, y, {
        width: 230,
      });

      doc.text(String(item.quantity), 300, y);

      doc.text(`Rs. ${Number(item.price).toLocaleString()}`, 360, y);

      doc.text(`Rs. ${Number(item.total).toLocaleString()}`, 450, y);

      y += 25;
    });

    doc.moveTo(50, y).lineTo(545, y).stroke();

    y += 25;

    // =========================
    // SUMMARY
    // =========================

    doc
      .font("Helvetica")
      .text(
        `Subtotal: Rs. ${Number(invoice.subtotal).toLocaleString()}`,
        350,
        y,
      );

    y += 20;

    doc.text(`Tax: Rs. ${Number(invoice.tax || 0).toLocaleString()}`, 350, y);

    y += 20;

    doc.text(
      `Discount: Rs. ${Number(invoice.discount || 0).toLocaleString()}`,
      350,
      y,
    );

    y += 25;

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(`TOTAL: Rs. ${Number(invoice.total).toLocaleString()}`, 350, y);

    // =========================
    // STATUS
    // =========================

    y += 35;

    doc.fontSize(11).font("Helvetica").text(`Status: ${invoice.status}`, 50, y);

    // =========================
    // NOTES
    // =========================

    if (invoice.notes) {
      y += 30;

      doc.font("Helvetica-Bold").text("Notes:", 50, y);

      y += 18;

      doc.font("Helvetica").text(invoice.notes, 50, y, {
        width: 495,
      });
    }

    // =========================
    // FOOTER
    // =========================

    doc
      .fontSize(9)
      .fillColor("gray")
      .text("Thank you for your business.", 50, 760, {
        align: "center",
        width: 495,
      });

    doc.end();
  } catch (error) {
    console.error("Download invoice PDF error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate invoice PDF",
      });
    }
  }
};
