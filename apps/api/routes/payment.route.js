// File: apps/api/routes/payment.route.js
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createPayment,
  getPayments,
  getPayment,
  updatePayment,
  deletePayment
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/", verifyToken, createPayment);
router.get("/", verifyToken, getPayments);
router.get("/:id", verifyToken, getPayment);
router.put("/:id", verifyToken, updatePayment);
router.delete("/:id", verifyToken, deletePayment);

export default router;
