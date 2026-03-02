// ./models/schemas/board.js
import { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    email: String,
    name: String,
    password: String,
  },
  {
    timestamps: true,
  },
);

export default UserSchema;
