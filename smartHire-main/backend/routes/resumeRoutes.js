const express = require("express");
const multer = require("multer");
const { uploadAndAnalyzeResume, getMyResume, getJobRoles } = require("../controllers/resumeController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (file?.mimetype === "application/pdf") return cb(null, true);
    return cb(new Error("Only PDF files are allowed"));
  },
});

const uploadResumePdf = (req, res, next) => {
  upload.single("resume")(req, res, (error) => {
    if (error) return res.status(400).json({ message: error.message || "Invalid file upload" });
    return next();
  });
};

router.get("/job-roles", authMiddleware(["user"]), getJobRoles);
router.post("/analyze", authMiddleware(["user"]), uploadResumePdf, uploadAndAnalyzeResume);
router.get("/my", authMiddleware(["user"]), getMyResume);

module.exports = router;
