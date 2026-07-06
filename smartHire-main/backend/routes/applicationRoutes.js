const express = require("express");
const multer = require("multer");
const {
  applyToJob,
  getUserApplications,
  getClientApplicants,
  getApplicationResume,
  updateApplicationStatus,
  createWhatsAppMessage,
} = require("../controllers/applicationController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/apply", authMiddleware(["user"]), upload.single("resume"), applyToJob);
router.get("/my", authMiddleware(["user"]), getUserApplications);
router.get("/client", authMiddleware(["client"]), getClientApplicants);
router.get("/:id/resume", authMiddleware(), getApplicationResume);
router.patch("/:id/status", authMiddleware(["client"]), updateApplicationStatus);
router.post("/client/message", authMiddleware(["client"]), createWhatsAppMessage);

module.exports = router;
