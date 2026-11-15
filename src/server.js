require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");

const app = express();

app.use(cors({ origin: (process.env.CORS_ORIGIN || "*").split(",").map((o) => o.trim()) }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/students", require("./routes/students"));

// Error handler (validation, duplicate keys, etc.)
app.use((err, _req, res, _next) => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return res.status(409).json({ message: `${field} already exists` });
  }
  if (err.name === "ValidationError")
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(", ") });
  if (err.name === "CastError") return res.status(400).json({ message: "Invalid id" });
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

async function seedAdmin() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;
  if (await User.findOne({ email: ADMIN_EMAIL.toLowerCase() })) return;
  await User.create({ email: ADMIN_EMAIL, password: await bcrypt.hash(ADMIN_PASSWORD, 10) });
  console.log(`Admin new created: ${ADMIN_EMAIL}`);
}

(async () => {
  try {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set in .env");
    await connectDB();
    await seedAdmin();
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`API running on http://localhost:${port}`));
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
})();
