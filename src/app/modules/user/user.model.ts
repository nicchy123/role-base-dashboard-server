import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import { TUser } from "./user.interfaces";
import config from "../../config/config";

export const userSchema = new Schema<TUser>(
  {

    password: { type: String, maxLength: 20, select: 0 },

    email: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password!, Number(config.bcrypt_salt));
  next();
});

export const UserModel = model<TUser>("User", userSchema);
