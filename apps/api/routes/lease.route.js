// File: apps/api/routes/lease.route.js
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createLease,
  getLeases,
  getLease,
  updateLease,
  deleteLease,
  searchLeases
} from "../controllers/lease.controller.js";

const router = express.Router();

router.post("/", verifyToken, createLease);
router.get("/", verifyToken, getLeases);
router.get("/:id", verifyToken, getLease);
router.put("/:id", verifyToken, updateLease);
router.delete("/:id", verifyToken, deleteLease);
router.get("/search/autocomplete", searchLeases);

export default router;
