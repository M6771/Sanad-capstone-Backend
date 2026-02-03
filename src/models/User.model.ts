import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: number;
  address?: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    phone: { type: Number },
    address: { type: String },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", UserSchema);
