import { model, Schema, type Document, type Model, models } from "mongoose";
import { IUser } from "../interfaces";

const userSchema = new Schema<IUser>({
  fullname: {
    type: String,
    required: [true, "Please provide a full name"],
  },
  reg_num: {
    type: String,
    required: [true, "Registration Number is required"],
    unique: true,
  },
  email: { 
    type: String, 
    required: [true, "Please provide an email"], 
    unique: true 
  },
  password: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ["admin", "core_member", "participant"],
    default: "participant",
    required: true,
  },
  region: {
    type: String,
    enum: ["hell", "earth"],
    required: false,
  },
  teamId: {
    type: String,
    required: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String,
    required: false,
  },
  verifyTokenExpiry: {
    type: Date,
    required: false,
  },
  forgotPasswordToken: {
    type: String,
    required: false,
  },
  forgotPasswordTokenExpiry: {
    type: Date,
    required: false,
  },
});

const User: Model<IUser> = models.User ?? model<IUser>("User", userSchema);

export default User;
