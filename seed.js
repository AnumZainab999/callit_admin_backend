import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import Order from "./models/Order.js"; 

dotenv.config(); // load .env

// Read JSON file manually
const orders = JSON.parse(fs.readFileSync("./orders.json", "utf-8"));

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

  

    // insert new orders
    await Order.insertMany(orders);
    console.log("Seed data inserted successfully!");

    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

seedData();
