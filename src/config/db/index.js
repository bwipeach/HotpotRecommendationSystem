const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/Hotpot_manage_dev");
    console.log("Connected");
  } catch (error) {
    console.log("error");
  }
}

module.exports = { connect };
