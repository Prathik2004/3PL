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
  resetToken?: string;
  resetTokenExpiry?: Date;
  refreshToken?: string;
}

const UserSchema = new Schema<IUser>({
  userId: {
    type: Schema.Types.String,
    default: () => uuidv4(),
    unique: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: {
    type: String,
    enum: ["Admin", "Operations", "Viewer"],
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  mustResetPassword: { type: Boolean, default: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  refreshToken: { type: String },
});

export default mongoose.model<IUser>("User", UserSchema);