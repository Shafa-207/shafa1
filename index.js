import "dotenv/config"; // 1. Taruh di paling atas
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import noteRouter from "./routes/note.js";
import userRouter from "./routes/user.js";
import { Post } from "./models/index.js";

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;
console.log("Cek URI:", uri ? "Ada isinya" : "KOSONG/UNDEFINED!");

// 2. Middlewares
app.use(cors());
app.use(express.json());

// // Di file backend kamu
// const allowedOrigins = [
//   'http://localhost:3000', // Supaya masih bisa dicoba di laptop
//   'https://shafa-notes-kamu.vercel.app' // Alamat frontend kamu yang sudah online
// ];

// app.use(cors({
//   origin: allowedOrigins
// }))

// 3. Routes
app.get("/", (req, res) => {
  res.send("Hello nama saya shafa!");
});

app.use("/notes", noteRouter);
app.use("/user", userRouter);

app.get("/api/posts", async (req, res) => {
  try {
    const data = await Post.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error ambil data", error: error.message });
  }
});

// 4. Database Connection
mongoose
  .connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("Terhubung ke MongoDB..."))
  .catch((err) => console.error("Gagal koneksi:", err));

// 5. Error Handling Middleware (Selalu di akhir)
app.use((err, req, res, next) => {
  res.status(500).json({
    message: "Ada yang salah nih!",
    error: err.message,
  });
});

app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});
