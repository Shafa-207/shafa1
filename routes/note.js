import { Router } from "express";
// Wajib pakai ekstensi .js di akhir path
// import * as Note from "../models/note.js";
import { Post } from "../models/index.js";

const router = Router();

// Route GET: untuk melihat isi file JSON nyaaaa
router.get("/", async (req, res, next) => {
  try {
    const notes = await Post.find(); // find() adalah fungsi Mongoose untuk ambil semua
    res.json(notes);
  } catch (e) {
    next(e);
  }
});

// Route Detail (GET)
router.get("/:id", async (req, res, next) => {
  try {
    // 1. Ambil ID dari URL (req.params.id)
    // 2. Cari dokumennya di MongoDB pakai Post.findById
    const note = await Post.findById(req.params.id);

    // 3. Jika datanya tidak ada di database
    if (!note) {
      return res
        .status(404)
        .json({ message: "Note tidak ditemukan di MongoDB" });
    }

    // 4. Kirim hasilnya ke Postman
    res.json(note);
  } catch (e) {
    // Jika ID yang dimasukkan formatnya salah (bukan ObjectId MongoDB)
    next(e);
  }
});

// POST: Tambah data baru ke MongoDB
router.post("/", async (req, res, next) => {
  const { title, content } = req.body;
  try {
    const note = await Post.create({ title, content });
    res.status(201).json(note);
  } catch (e) {
    next(e);
  }
});

// Route PUT: Kalo kita mau ngubah ISI data di MongoDB
router.put("/:id", async (req, res, next) => {
  const { title, content } = req.body;

  try {
    // 1. Ambil ID dari URL (req.params.id) - ID MongoDB itu String, bukan Number
    // 2. Gunakan findByIdAndUpdate untuk mencari & mengubah data sekaligus
    const updatedNote = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content }, // Data baru yang mau dimasukkan
      { new: true, runValidators: true }, // Opsi: 'new' supaya dia balikin data yang SUDAH diupdate
    );

    // 3. Jika ID yang dicari tidak ada di database
    if (!updatedNote) {
      return res.status(404).json({ message: "Note tidak ditemukan" });
    }

    // 4. Kirim hasil yang sudah diupdate ke Postman
    res.json(updatedNote);
  } catch (e) {
    // Menangkap error jika ID formatnya salah atau koneksi putus
    next(e);
  }
});

// DELETE: kalo kita mau hapus data di MongoDB
router.delete("/:id", async (req, res, next) => {
  try {
    // 1. Langsung hapus berdasarkan ID dari URL (req.params.id)
    // 2. Kita pakai 'await' karena menghapus di cloud butuh waktu
    const deletedNote = await Post.findByIdAndDelete(req.params.id);

    // 3. Cek apakah datanya memang ada sebelum dihapus
    if (!deletedNote) {
      return res
        .status(404)
        .json({ message: "Data tidak ditemukan, gagal hapus" });
    }

    // 4. Jika berhasil, kirim respon sukses
    res.json({
      result: "success",
      message: "Data berhasil dihapus dari MongoDB",
      deletedData: deletedNote, // Opsional: nampilin data apa yang barusan dihapus
    });
  } catch (e) {
    // Menangkap error jika format ID salah (bukan ObjectId)
    next(e);
  }
});

// Menggunakan default export untuk router
export default router;
