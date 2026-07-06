const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    file: { type: String, required: true },
    skills: [{ type: String }],
    atsScore: { type: Number, default: 0 },
    parsedText: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model("Resume", resumeSchema);
