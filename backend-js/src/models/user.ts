import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { UserRole } from "../types";

export interface IUser extends Document {
  userId: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  mustResetPassword: boolean;
  resetToken?: string | undefined;
  resetTokenExpiry?: Date | undefined;
  refreshToken?: string | undefined;
}

const UserSchema = new Schema<IUser>({
  userId: { type: String, default: () => uuidv4(), unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // 1. ENSURE THIS IS password_hash (not password)
  password_hash: { type: String, required: true, select: false },
  role: { 
    type: String, 
    // 2. DOUBLE CHECK THESE STRINGS (No trailing spaces!)
    enum: ["Admin", "Operations", "Viewer"], 
    required: true 
  },
  created_at: { type: Date, default: Date.now },
  mustResetPassword: { type: Boolean, default: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  refreshToken: { type: String },
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);