import { Router } from "express";
import {
  createTransaction,
  handleNotification,
  checkStatus,
} from "../utils/midtrans.js";

const router = Router();

// ===============================
// Endpoint buat transaksi
// ===============================
router.post("/create", createTransaction);

// ===============================
// Endpoint notifikasi dari Midtrans
// ===============================
router.post("/notification", handleNotification);

// ===============================
// Endpoint untuk cek status transaksi (opsional)
// ===============================
router.get("/status/:order_id", checkStatus);

export default router;
