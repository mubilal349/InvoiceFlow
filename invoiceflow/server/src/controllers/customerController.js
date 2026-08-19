import mongoose from "mongoose";
import Customer from "../models/Customer.js";
import Invoice from "../models/Invoice.js";
import PDFDocument from "pdfkit";

// =========================================
// GET ALL CUSTOMERS WITH INVOICE SUMMARY
// =========================================

export const getCustomers = async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};

    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { company: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      };
    }

    const customers = await Customer.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const customerData = await Promise.all(
      customers.map(async (customer) => {
        const invoices = await Invoice.find({
          createdBy: req.user._id,
          $or: [
            { customer: customer._id },
            {
              customerEmail: customer.email.toLowerCase(),
            },
          ],
        }).lean();

        const invoiceCount = invoices.length;

        const totalAmount = invoices.reduce((sum, invoice) => {
          return sum + Number(invoice.total || 0);
        }, 0);

        const paidAmount = invoices
          .filter((invoice) => invoice.status === "Paid")
          .reduce((sum, invoice) => {
            return sum + Number(invoice.total || 0);
          }, 0);

        const outstanding = totalAmount - paidAmount;

        return {
          ...customer,

          // Fields your frontend expects
          customerName: customer.name,
          customerEmail: customer.email,
          customerAddress: customer.address,

          invoiceCount,
          totalAmount,
          paidAmount,
          outstanding,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      count: customerData.length,
      customers: customerData,
    });
  } catch (error) {
    console.error("Get customers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
      error: error.message,
    });
  }
};

// =========================================
// GET SINGLE CUSTOMER
// =========================================

export const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error("Get customer error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch customer",
    });
  }
};

// =========================================
// CREATE CUSTOMER
// =========================================

export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, company, address, city, country, notes } =
      req.body;

    // Required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Customer name and email are required",
      });
    }

    // Check duplicate email
    const existingCustomer = await Customer.findOne({
      email: email.toLowerCase(),
    });

    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        message: "A customer with this email already exists",
      });
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      company,
      address,
      city,
      country,
      notes,
      createdBy: req.user._id,
    });

    const populatedCustomer = await Customer.findById(customer._id).populate(
      "createdBy",
      "name email",
    );

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer: populatedCustomer,
    });
  } catch (error) {
    console.error("Create customer error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create customer",
    });
  }
};

// =========================================
// UPDATE CUSTOMER
// =========================================

export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const { name, email, phone, company, address, city, country, notes } =
      req.body;

    // Check if email belongs to another customer
    if (email) {
      const existingCustomer = await Customer.findOne({
        email: email.toLowerCase(),
        _id: { $ne: req.params.id },
      });

      if (existingCustomer) {
        return res.status(409).json({
          success: false,
          message: "Another customer already uses this email",
        });
      }
    }

    customer.name = name ?? customer.name;
    customer.email = email?.toLowerCase() ?? customer.email;
    customer.phone = phone ?? customer.phone;
    customer.company = company ?? customer.company;
    customer.address = address ?? customer.address;
    customer.city = city ?? customer.city;
    customer.country = country ?? customer.country;
    customer.notes = notes ?? customer.notes;

    await customer.save();

    const updatedCustomer = await Customer.findById(customer._id).populate(
      "createdBy",
      "name email",
    );

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("Update customer error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update customer",
    });
  }
};

// =========================================
// DELETE CUSTOMER
// =========================================

export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Check if customer has invoices
    const invoiceCount = await Invoice.countDocuments({
      customer: customer._id,
    });

    if (invoiceCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "This customer cannot be deleted because they have existing invoices",
      });
    }

    await Customer.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("Delete customer error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete customer",
    });
  }
};

// =========================================
// GET CUSTOMER INVOICES
// =========================================

export const getCustomerInvoices = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const invoices = await Invoice.find({
      customer: customer._id,
    })
      .populate("customer", "name email phone company")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: invoices.length,
      invoices,
    });
  } catch (error) {
    console.error("Get customer invoices error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch customer invoices",
    });
  }
};

export const downloadCustomersPDF = async (req, res) => {
  try {
    const customers = await Customer.find({
      createdBy: req.user._id,
    }).sort({ name: 1 });

    if (!customers || customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No customers found",
      });
    }

    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
    });

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="customers-list.pdf"',
    );

    doc.pipe(res);

    const pageWidth = doc.page.width;
    const margin = 40;
    const contentWidth = pageWidth - margin * 2;

    const dark = "#111827";
    const gray = "#6b7280";
    const border = "#d1d5db";

    // =========================================
    // HEADER
    // =========================================

    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .fillColor(dark)
      .text("CUSTOMERS", margin, 45);

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(gray)
      .text(`Customer List • ${new Date().toLocaleDateString()}`, margin, 78);

    doc
      .moveTo(margin, 105)
      .lineTo(pageWidth - margin, 105)
      .lineWidth(1)
      .strokeColor(dark)
      .stroke();

    // =========================================
    // SUMMARY
    // =========================================

    let y = 125;

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(dark)
      .text(`Total Customers: ${customers.length}`, margin, y);

    y += 35;

    // =========================================
    // TABLE
    // =========================================

    const columns = {
      customer: margin,
      email: 170,
      phone: 315,
      company: 415,
    };

    const widths = {
      customer: 120,
      email: 135,
      phone: 90,
      company: 110,
    };

    const drawTableHeader = () => {
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(gray)
        .text("CUSTOMER", columns.customer, y, {
          width: widths.customer,
        })
        .text("EMAIL", columns.email, y, {
          width: widths.email,
        })
        .text("PHONE", columns.phone, y, {
          width: widths.phone,
        })
        .text("COMPANY", columns.company, y, {
          width: widths.company,
        });

      doc
        .moveTo(margin, y + 17)
        .lineTo(pageWidth - margin, y + 17)
        .lineWidth(1)
        .strokeColor(dark)
        .stroke();

      y += 28;
    };

    drawTableHeader();

    // =========================================
    // CUSTOMER ROWS
    // =========================================

    customers.forEach((customer) => {
      // New page if needed
      if (y > 730) {
        doc.addPage();

        y = 45;

        drawTableHeader();
      }

      const rowStartY = y;

      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(dark)
        .text(customer.name || "Unknown", columns.customer, y, {
          width: widths.customer,
        });

      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(dark)
        .text(customer.email || "—", columns.email, y, {
          width: widths.email,
        });

      doc.text(customer.phone || "—", columns.phone, y, {
        width: widths.phone,
      });

      doc.text(customer.company || "—", columns.company, y, {
        width: widths.company,
      });

      y += 30;

      doc
        .moveTo(margin, y - 8)
        .lineTo(pageWidth - margin, y - 8)
        .lineWidth(0.5)
        .strokeColor(border)
        .stroke();
    });

    // =========================================
    // FOOTER
    // =========================================

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(gray)
      .text("Generated from InvoiceFlow", margin, 770, {
        align: "center",
        width: contentWidth,
      });

    doc.end();
  } catch (error) {
    console.error("Download customers PDF error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate customers PDF",
      });
    }
  }
};
