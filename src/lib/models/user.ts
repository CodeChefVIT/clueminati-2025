import { model , Schema, type Document, type Model , models } from "mongoose";

export interface IUser extends Document {
  userId: string;
  role: string;
  username: string;
  email: string;
  password: string;
  teamId: string;
  region: string;
}

const userSchema = new Schema<IUser>({
  userId: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  teamId: { type: String, required: true, unique: true },
  region: { type: String, required: true },
});

const User: Model<IUser> =
  models.User ?? model<IUser>("User", userSchema);

export default User;
