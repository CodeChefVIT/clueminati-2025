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
    minlength: [9, "Registration Number must be at least 9 characters"],
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
});

const User: Model<IUser> = models.User ?? model<IUser>("User", userSchema);

export default User;
