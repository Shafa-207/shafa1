import { Router } from "express";
import { User } from "../models/index.js";
import bcrypt from "bcrypt"; // 1. Import bcrypt

const router = Router();

// Route GET: untuk melihat isi file JSON nyaaaa
router.get("/", async (req, res, next) => {
  try {
    const user = await User.find(); // find() adalah fungsi Mongoose untuk ambil semua
    res.json(user);
  } catch (e) {
    next(e);
  }
});

// Route Detail (GET)
router.get("/:id", async (req, res, next) => {
  try {
    // 1. Ambil ID dari URL (req.params.id)
    // 2. Cari dokumennya di MongoDB pakai Post.findById
    const user = await User.findById(req.params.id);

    // 3. Jika datanya tidak ada di database
    if (!user) {
      return res
        .status(404)
        .json({ message: "User tidak ditemukan di MongoDB" });
    }

    // 4. Kirim hasilnya ke Postman
    res.json(user);
  } catch (e) {
    // Jika ID yang dimasukkan formatnya salah (bukan ObjectId MongoDB)
    next(e);
  }
});

// POST
router.post("/register", async (req, res, next) => {
  const { email, name, password } = req.body;

  try {
    // 2. Acak password (hashing)
    // Angka 10 adalah 'saltRounds' (semakin tinggi semakin aman tapi lambat)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Simpan user dengan password yang SUDAH DI-HASH
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
        // Jangan balikin password (walaupun sudah dihash) ke respon JSON demi keamanan
      },
    });
  } catch (e) {
    next(e);
  }
});

export default router;
