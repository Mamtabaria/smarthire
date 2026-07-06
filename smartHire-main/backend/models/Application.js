const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resume: { type: String, required: true },
    resumeMimeType: { type: String, default: "application/pdf" },
    resumeData: { type: Buffer, select: false },
    atsScore: { type: Number, default: 0 },
    skillMatch: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Rejected"],
      default: "Applied",
    },
    missingSkills: [{ type: String }],
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
