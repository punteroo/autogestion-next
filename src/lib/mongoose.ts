import mongoose from "mongoose";

/** Controls wether the connection was established or not. */
let connected: boolean = false;

export async function connect(): Promise<void> {
  if (!process.env.MONGODB_URI)
    throw new Error("Missing MongoDB connection string.");

  // Is there a connection already?
  if (connected) return;

  mongoose.set("strictQuery", true);

  try {
    // Create a new connection.
    await mongoose.connect(process.env.MONGODB_URI);

    // Set the connection as stable.
    connected = true;

    console.log("Connection to MongoDB established.");
  } catch (e) {
    console.error(`Failed to connect to MongoDB: ${e}`);
    throw e;
  }
}
