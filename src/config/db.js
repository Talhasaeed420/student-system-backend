const mongoose = require("mongoose");

module.exports = async function connectDB() {
  const { MONGO_URI, DB_NAME } = process.env;
  if (!MONGO_URI) throw new Error("MONGO_URI is not set in .env");
  if (!DB_NAME) throw new Error("DB_NAME is not set in .env");
  await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
  console.log(`MongoDB connected (db: ${DB_NAME})`);
};
