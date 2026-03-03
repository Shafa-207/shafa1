import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // 1. Ambil token dari header 'Authorization'
  const authHeader = req.headers.authorization;

  // Header biasanya formatnya: "Bearer <token>"
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    // 2. Verifikasi token menggunakan Secret Key yang sama dengan saat Login
    jwt.verify(
      token,
      process.env.JWT_SECRET || "rahasia_kamu",
      (err, decoded) => {
        if (err) {
          // Jika token salah atau sudah expired
          return res.status(403).json({
            success: false,
            message: "Token tidak valid atau sudah kadaluarsa!",
          });
        }

        // 3. Jika token valid, simpan data user ke object 'req'
        // Agar route selanjutnya tahu siapa user yang sedang mengakses
        req.user = decoded;

        // Lanjut ke fungsi berikutnya (Controller)
        next();
      },
    );
  } else {
    // Jika tidak ada token di header
    res.status(401).json({
      success: false,
      message: "Anda belum login, akses ditolak!",
    });
  }
};
