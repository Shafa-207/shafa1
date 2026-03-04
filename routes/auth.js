import { Router } from "express";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/mailer.js";
import { User } from "../models/index.js"; // Asumsi pake Mongoose

const router = Router();

router.post("/reset-password", async (req, res) => {
  const { email } = req.body;

  // 1. Generate password angka 8 digit
  const tempPassword = Math.floor(Math.random() * 10 ** 8)
    .toString()
    .padStart(8, "0");

  // 2. Hash password sementara dengan bcryptjs
  const salt = await bcrypt.genSalt(10);
  const hashedTempPassword = await bcrypt.hash(tempPassword, salt);

  try {
    // 3. Update DB
    // Opsi { new: true } mengembalikan dokumen SETELAH diupdate
    const user = await User.findOneAndUpdate(
      { email }, // 1. Cari user yang emailnya ini
      {
        password: hashedTempPassword, // 2. Ganti passwordnya jadi hash tadi
        passwordReset: true, // 3. Pasang "tanda" wajib ganti password
      },
      { new: true }, // 4. Berikan data user yang TERBARU setelah diupdate
    );

    if (!user) {
      return res.status(404).send("Email tidak terdaftar");
    }

    // 4. Kirim email
    // Kita kirim 'tempPassword' (plain text), BUKAN 'hashedTempPassword'
    await sendEmail(
      email,
      "Reset Kata Sandi",
      `Gunakan password sementara ini untuk login: ${tempPassword}. Anda wajib menggantinya setelah login.`,
    );

    res.send("Password baru telah dikirim ke email Anda.");
  } catch (error) {
    console.error(error); // Penting untuk debugging
    res.status(500).send("Terjadi kesalahan sistem.");
  }
});

export default router;
