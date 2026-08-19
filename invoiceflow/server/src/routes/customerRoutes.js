import express from "express";

import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerInvoices,
  downloadCustomersPDF,
} from "../controllers/customerController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// =========================================
// VIEW CUSTOMERS
// =========================================

router.get("/", authMiddleware, getCustomers);

// =========================================
// DOWNLOAD CUSTOMERS PDF
// IMPORTANT: MUST BE BEFORE /:id
// =========================================

router.get("/pdf", authMiddleware, downloadCustomersPDF);

// =========================================
// SINGLE CUSTOMER
// =========================================

router.get("/:id", authMiddleware, getCustomer);

router.get("/:id/invoices", authMiddleware, getCustomerInvoices);

// =========================================
// ADMIN CUSTOMER MANAGEMENT
// =========================================

router.post("/", authMiddleware, adminMiddleware, createCustomer);

router.put("/:id", authMiddleware, adminMiddleware, updateCustomer);

router.delete("/:id", authMiddleware, adminMiddleware, deleteCustomer);

export default router;
