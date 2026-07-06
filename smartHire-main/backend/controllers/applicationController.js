const Application = require("../models/Application");
const Job = require("../models/Job");
const Message = require("../models/Message");
const User = require("../models/User");
const { parseResumeBuffer } = require("../utils/resumeParser");
const { getAtsScore } = require("../utils/atsScore");
const { getSkillGap } = require("../utils/skillGap");

const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!req.file) return res.status(400).json({ message: "Resume PDF is required" });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const { skills } = await parseResumeBuffer(req.file.buffer);
    const { atsScore, skillMatch } = getAtsScore(skills, job.skillsRequired);
    const missingSkills = getSkillGap(skills, job.skillsRequired);

    const application = await Application.create({
      jobId,
      userId: req.user.id,
      resume: req.file.originalname,
      resumeMimeType: req.file.mimetype || "application/pdf",
      resumeData: req.file.buffer,
      atsScore,
      skillMatch,
      missingSkills,
      status: "Applied",
    });

    return res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already applied to this job" });
    }
    return res.status(500).json({ message: "Application failed", error: error.message });
  }
};

const getApplicationResume = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id)
      .select("+resumeData resumeMimeType resume")
      .populate("jobId", "clientId")
      .populate("userId", "_id");

    if (!application) return res.status(404).json({ message: "Application not found" });

    const isOwnerUser = String(application?.userId?._id) === String(req.user.id);
    const isOwnerClient = String(application?.jobId?.clientId) === String(req.user.id);
    if (!isOwnerUser && !isOwnerClient) return res.status(403).json({ message: "Forbidden" });

    if (!application.resumeData?.length) {
      return res.status(404).json({ message: "Resume file not available" });
    }

    res.setHeader("Content-Type", application.resumeMimeType || "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=\"${application.resume || "resume.pdf"}\"`);
    return res.send(application.resumeData);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch resume", error: error.message });
  }
};

const getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id })
      .populate("jobId", "title company location")
      .sort({ createdAt: -1 });
    return res.json(applications);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch applications", error: error.message });
  }
};

const getClientApplicants = async (req, res) => {
  try {
    const jobs = await Job.find({ clientId: req.user.id }).select("_id");
    const jobIds = jobs.map((job) => job._id);
    const applicants = await Application.find({ jobId: { $in: jobIds } })
      .populate("userId", "name phone email")
      .populate("jobId", "title company")
      .sort({ atsScore: -1 });

    return res.json(applicants);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch applicants", error: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Application.findByIdAndUpdate(id, { status }, { new: true });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Could not update status", error: error.message });
  }
};

const createWhatsAppMessage = async (req, res) => {
  try {
    const { userIds, message } = req.body;
    const users = await User.find({ _id: { $in: userIds } }).select("phone name");
    const links = users
      .filter((u) => !!u.phone)
      .map((u) => ({
        userId: u._id,
        name: u.name,
        link: `https://wa.me/${u.phone}?text=${encodeURIComponent(message)}`,
      }));

    await Message.create({ clientId: req.user.id, userIds, message });

    return res.json({ links });
  } catch (error) {
    return res.status(500).json({ message: "Could not generate message links", error: error.message });
  }
};

module.exports = {
  applyToJob,
  getUserApplications,
  getClientApplicants,
  getApplicationResume,
  updateApplicationStatus,
  createWhatsAppMessage,
};
