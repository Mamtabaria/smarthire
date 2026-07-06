const Job = require("../models/Job");

const createJob = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      clientId: req.user.id,
      skillsRequired: req.body.skillsRequired || [],
    };
    const job = await Job.create(payload);
    return res.status(201).json(job);
  } catch (error) {
    return res.status(500).json({ message: "Could not create job", error: error.message });
  }
};

const getAllJobs = async (_req, res) => {
  try {
    const jobs = await Job.find().populate("clientId", "name email").sort({ createdAt: -1 });
    return res.json(jobs);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch jobs", error: error.message });
  }
};

const getClientJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ clientId: req.user.id }).sort({ createdAt: -1 });
    return res.json(jobs);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch client jobs", error: error.message });
  }
};

module.exports = { createJob, getAllJobs, getClientJobs };
