const express = require("express");
const { createJob, getAllJobs, getClientJobs } = require("../controllers/jobController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllJobs);
router.get("/client/my-jobs", authMiddleware(["client"]), getClientJobs);
router.post("/", authMiddleware(["client"]), createJob);

module.exports = router;
