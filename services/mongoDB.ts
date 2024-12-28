import mongoose, { Connection } from "mongoose";

export async function dbConnect(): Promise<Connection | undefined> {
    try {
        if (!process.env.MONGODB_CONNECTION_STRING) {
            throw new Error("MONGODB_CONNECTION_STRING is not defined in environment variables.");
        }
        const conn = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log("Database connected successfully.");
        return conn.connection;
    } catch (err) {
        console.error("Database connection error:", err);
    }
};