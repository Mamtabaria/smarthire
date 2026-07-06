const express = require("express");
const {
  getSkillGapData,
  getRoleRecommendations,
  assistantChat,
  generateRoadmapWithAI,
} = require("../controllers/skillController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/gap", authMiddleware(["user"]), getSkillGapData);
router.get("/recommendations", authMiddleware(["user"]), getRoleRecommendations);
router.post("/assistant-chat", authMiddleware(), assistantChat);
router.post("/roadmap-ai", authMiddleware(["user"]), generateRoadmapWithAI);

module.exports = router;
