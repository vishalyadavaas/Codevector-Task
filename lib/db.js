import mongoose from "mongoose";
import pkg from '@next/env'
const { loadEnvConfig } = pkg;
import path from 'path';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const projectDir = path.resolve(__dirname, '..')
loadEnvConfig(projectDir);

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log("MongoDB is already connected");
        return;
    }

    await mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("MongoDB connected");
        })
        .catch((err) => {
            console.error("MongoDB connection error:", err);
        });
};
