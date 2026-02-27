import express from "express";
import noteRouter from "./routes/note.js";

import mongoose from "mongoose";
import { Post } from "./models/index.js";

import cors from "cors";

// const express = require("express");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello nama saya shafa!");
});

app.get("/say/:greeting", (req, res) => {
  const { greeting } = req.params;
  res.send(greeting);
});

app.get("/login/:name", (req, res) => {
  const { name } = req.params;
  res.send(`Welcome Back ${name}!!`);
});

app.get("/coba", (req, res) => {
  res.status(401).send("Error nya 401!!!");
});

app.use("/notes", noteRouter);

const password = "shafapassword";
const url = `mongodb+srv://shafa_db_user:${password}@shafa-cluster0.ovodjwg.mongodb.net/shafa_notes?retryWrites=true&w=majority&appName=Shafa-Cluster0`;
mongoose
  .connect(url, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("Terhubung ke MongoDB..."))
  .catch((err) => console.error("Gagal koneksi:", err));

app.get("/api/posts", async (req, res) => {
  try {
    // Post.find() akan mengambil semua isi database kamu
    const data = await Post.find();
    res.json(data); // Kirim ke React dalam format JSON
  } catch (error) {
    res.status(500).json({ message: "Error ambil data", error });
  }
});

app.use((req, res, next) => {
  if (false) {
    next(new Error("salah"));
    return;
  }
  next();
});

app.use((err, req, res, next) => {
  // Ini akan menampilkan pesan error aslinya di Postman/Browser
  res.status(500).json({
    message: "Ada yang salah nih!",
    error: err.message,
  });
});

app.listen(5000, () => {
  console.log("Server jalan di http://localhost:5000");
});
