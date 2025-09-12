import { model, Schema, type Document, type Model, models } from "mongoose";
import { IUser } from "../interfaces";

const userSchema = new Schema<IUser>({
  fullname: { 
    type: String,
    required: [true, "Please provide a full name"],
  },
  email: { 
    type: String, 
    required: [true, "Please provide an email"], 
    unique: true 
  },
  password: { 
    type: String, 
    required: [true, "Please provide a password"],
  },
  role: {
    type: String,
    enum: ["admin", "core_member", "participant"],
    default: "participant",
    required: true,
  },
  region: {
    type: String,
    enum: ["indoor", "outdoor"],
    required: false,
  },
  teamId: { 
    type: String, 
    required: false 
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date
});

const User: Model<IUser> = models.User || model<IUser>("User", userSchema);

export default User;
