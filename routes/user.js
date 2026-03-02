import { Router } from "express";
import { User } from "../models/index.js";
import bcrypt from "bcrypt"; // 1. Import bcrypt

const router = Router();

// Route GET: untuk melihat isi file JSON nyaaaa
router.get("/", async (req, res, next) => {
  try {
    const user = await User.find().select("-password"); // find() adalah fungsi Mongoose untuk ambil semua
    res.json(user);
  } catch (e) {
    next(e);
  }
});

// POST
router.post("/register", async (req, res, next) => {
  const { email, name, password } = req.body;

  try {
    // 1. Validasi: Pastikan semua field diisi
    if (!email || !name || !password) {
      return res.status(400).json({ message: "Semua data harus diisi!" });
    }

    // 2. Cek apakah email sudah terdaftar (Biar error-nya gak generic)
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email ini sudah terdaftar!" });
    }

    // 3. Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User
    const user = await User.create({
      email,
      name,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User berhasil didaftarkan",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (e) {
    next(e);
  }
});

// router/user.js atau server.js
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    // Gunakan bcrypt.compare untuk mengecek password terenkripsi
    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Password salah" });
    }
    // -------------------------

    res.status(200).json({
      success: true, // Tambahkan ini agar frontend kamu lebih mudah ngecek
      message: "Login Berhasil",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err });
  }
});

export default router;
