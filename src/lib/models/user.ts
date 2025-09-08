import { model , Schema , type Model , models } from "mongoose";
import { IUser } from "@/interface";

const userSchema = new Schema<IUser>({
  userId: { type: String, required: true, unique: true },
  role: { type: String, enum: ["participants", "member", "admin"], required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  teamId: { type: String, required: true, unique: true },
  region: { type: String, enum: ["hell", "earth"], required: true },
});

const User: Model<IUser> =
  models.User ?? model<IUser>("User", userSchema);

export default User;
