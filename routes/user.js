import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/index.js";
import { verifyToken } from "../middleware/auth.js"; // Pastikan path dan ekstensi .js benar

const router = Router();

// --- ROUTE LOGIN ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    // WAJIB pakai await di sini!
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Password salah" });
    }

    // BUAT TOKEN JWT
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload
      process.env.JWT_SECRET || "rahasia_kamu", // Secret Key
      { expiresIn: "1d" }, // Masa berlaku token
    );

    res.status(200).json({
      success: true,
      message: "Login Berhasil",
      token: token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: err.message });
  }
});

// --- ROUTE REGISTER ---
router.post("/register", async (req, res, next) => {
  const { email, name, password } = req.body;
  try {
    if (!email || !name || !password) {
      return res.status(400).json({ message: "Semua data harus diisi!" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email ini sudah terdaftar!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      name,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "rahasia_kamu",
      { expiresIn: "1d" },
    );

    res.status(201).json({
      success: true,
      message: "User berhasil didaftarkan",
      token: token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (e) {
    next(e);
  }
});

// --- ROUTE PROTECTED ---
router.get("/profile", verifyToken, (req, res) => {
  // Data user didapat dari middleware verifyToken (req.user = decoded)
  res.json({ message: "Halo!", user: req.user });
});

// --- ROUTE GET ALL USERS (Tanpa Password) ---
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (e) {
    next(e);
  }
});

export default router;
