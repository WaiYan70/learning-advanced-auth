import mongoose, { connect } from "mongoose";

export const connectDataBase = async () => {
  try {
    const mongodbConnectionString = process.env.MONGO_URL;
    if (!mongodbConnectionString) {
      console.error("These is not configuration/connection for mongodb");
    }
    mongoose.connection.on("connected", () => {
      console.log(`✅ Database connected`);
    });
    mongoose.connection.on("disconnected", () => {
      console.warn(`⚠️ Database disconnected:`);
    });
    mongoose.connection.on("error", () => {
      console.error(`❌ Database connection error:`);
    });
    const connectionStatus = await mongoose.connect(mongodbConnectionString, {
      dbName: "auth-users",
    });
    console.log(`MongoDB Connected to: ${connectionStatus.connection.host}`);
  } catch (error) {
    console.error("Failed to connect Mongo Database: ", error.message);
    process.exit(1);
  }
};
