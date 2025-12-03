import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import Order from "./models/Order.js";

dotenv.config();

// Read JSON file manually
const orders = JSON.parse(fs.readFileSync("./orders.json", "utf-8"));

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // ✅ Delete all previous records
    await Order.deleteMany({});
    console.log("Old data removed");

    // Upsert orders
    const operations = orders.map(order => ({
      updateOne: {
        filter: { orderId: order.orderId },
        update: { $set: order },
        upsert: true
      }
    }));

    await Order.bulkWrite(operations);
    console.log("Seed data inserted/updated successfully!");

    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

seedData();
