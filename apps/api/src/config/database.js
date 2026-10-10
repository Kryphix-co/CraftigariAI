import mongoose from "mongoose";
import { env } from "./env.js";
import { ApiError } from "../utils/ApiError.js";

let connectionPromise = null;

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (mongoose.connection.readyState === 0) connectionPromise = null;

  if (!env.mongodbUri) {
    throw new ApiError(503, "Database is not configured", {
      code: "DATABASE_NOT_CONFIGURED",
    });
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(env.mongodbUri, {
        serverSelectionTimeoutMS: env.mongodbServerSelectionTimeoutMs,
      })
      .then(() => mongoose.connection)
      .catch(() => {
        connectionPromise = null;
        throw new ApiError(503, "Database is unavailable", {
          code: "DATABASE_UNAVAILABLE",
        });
      });
  }

  return connectionPromise;
}

export async function disconnectFromDatabase() {
  connectionPromise = null;
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

export function getDatabaseState() {
  return mongoose.connection.readyState;
}
