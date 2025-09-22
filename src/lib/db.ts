import mongoose from "mongoose";

declare global {
  var mongoose: { conn: mongoose.Mongoose | null; promise: Promise<mongoose.Mongoose> | null } | undefined;
}

let cached = global.mongoose;

cached ??= global.mongoose = { conn: null, promise: null };

export async function connectToDatabase(){
  const MONGODB_URI = process.env.MONGODB_URI; 

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  if (cached?.conn) {
    return cached.conn;
  }

  if (cached && !cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      maxConnecting: 2,
      bufferCommands: true,
    }).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached!.conn = await cached!.promise;
    if(cached?.conn)console.log("mongo connected")
  } catch (e) {
    cached!.promise = null;
    throw e;
  }
  return cached!.conn;
}