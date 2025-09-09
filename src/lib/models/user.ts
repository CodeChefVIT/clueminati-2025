import { model, Schema, type Document, type Model, models } from "mongoose";
import { IUser } from "../interfaces";

const userSchema = new Schema<IUser>({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false},
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

  teamId: { type: String, required: false },
});

const User: Model<IUser> = models.User ?? model<IUser>("User", userSchema);

export default User;
