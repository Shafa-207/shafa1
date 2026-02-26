import mongoose from "mongoose";
// WAJIB pakai ekstensi .js di akhir jika menggunakan type: module
import PostSchema from "./schemas/board.js";

export const Post = mongoose.model("Post", PostSchema);
