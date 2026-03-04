// ./models/schemas/board.js
import { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Bonus: menghapus spasi yang tidak sengaja di awal/akhir
      lowercase: true, // Bonus: menyimpan email selalu dalam huruf kecil
    },
    name: { type: String, required: true },
    password: { type: String, required: true },
    // Tambahkan field ini untuk melacak status reset
    passwordReset: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default UserSchema;
