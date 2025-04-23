import mongoose from "mongoose";

export const connectDataBase = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (error) {
    console.log("Error Connection on MongoDB");
    process.exit(1);
  }
};
