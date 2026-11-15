const router = require("express").Router();
const Student = require("../models/Student");
const auth = require("../middleware/auth");

router.use(auth);

// GET /api/students?search=&status=&page=1&limit=10
router.get("/", async (req, res) => {
  const { search = "", status, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: rx }, { rollNo: rx }, { email: rx }, { course: rx }];
  }
  const p = Math.max(parseInt(page) || 1, 1);
  const l = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
  const [data, total] = await Promise.all([
    Student.find(filter).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l),
    Student.countDocuments(filter),
  ]);
  res.json({ data, total, page: p, pages: Math.ceil(total / l) });
});

router.get("/stats", async (_req, res) => {
  const [total, active, graduated, suspended] = await Promise.all([
    Student.countDocuments(),
    Student.countDocuments({ status: "active" }),
    Student.countDocuments({ status: "graduated" }),
    Student.countDocuments({ status: "suspended" }),
  ]);
  res.json({ total, active, graduated, suspended });
});

router.get("/:id", async (req, res) => {
  const s = await Student.findById(req.params.id);
  if (!s) return res.status(404).json({ message: "Student not found" });
  res.json(s);
});

router.post("/", async (req, res) => {
  const s = await Student.create(req.body);
  res.status(201).json(s);
});

router.put("/:id", async (req, res) => {
  const s = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!s) return res.status(404).json({ message: "Student not found" });
  res.json(s);
});

router.delete("/:id", async (req, res) => {
  const s = await Student.findByIdAndDelete(req.params.id);
  if (!s) return res.status(404).json({ message: "Student not found" });
  res.json({ message: "Student deleted" });
});

module.exports = router;
