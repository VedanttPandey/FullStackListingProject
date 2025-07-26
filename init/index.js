const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../modelss/listingg.js");

const mongoUrl = "mongodb://localhost:27017/wanderlust";

async function main() {
  try {
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB!");

    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"68765c930c537560e3a73f93"}))
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");

     await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (err) {
    console.error("Connection error:", err);
  }
}

main();
