import express from "express";
import noteRouter from "./routes/note.js";

import mongoose from "mongoose";
import { Post } from "./models/index.js";

// const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello nama saya shafa!");
});

// app.listen(3000, () => {
//   console.log("Server jalan di http:localhost:3000");
// });

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
app.listen(3000, () => {
  console.log("Server jalan di http:localhost:3000");
});
