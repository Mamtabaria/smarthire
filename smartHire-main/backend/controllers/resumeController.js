const Resume = require("../models/Resume");
const axios = require("axios");
const { parseResumeBuffer, extractSkillsFromText } = require("../utils/resumeParser");
const { getAtsScore } = require("../utils/atsScore");
const { getSkillGap } = require("../utils/skillGap");

const JOB_BOARD_API = "https://arbeitnow.com/api/job-board-api";
const RAPIDAPI_HOST = "resume-rating-api.p.rapidapi.com";

const normalizeScore = (value) => {
  if (value === null || value === undefined) return null;
  const num = Number(String(value).replace(/[^\d.]/g, ""));
  if (!Number.isFinite(num)) return null;
  if (num <= 1) return Math.max(0, Math.min(100, Math.round(num * 100)));
  return Math.max(0, Math.min(100, Math.round(num)));
};

const parseRapidAtsScore = (payload) => {
  const candidates = [
    payload?.score,
    payload?.atsScore,
    payload?.ats_score,
    payload?.rating,
    payload?.globalScore,
    payload?.overallScore,
    payload?.scores?.overall,
    payload?.scores?.total,
    payload?.data?.score,
    payload?.data?.atsScore,
    payload?.data?.ats_score,
    payload?.data?.rating,
    payload?.data?.globalScore,
    payload?.data?.overallScore,
    payload?.data?.scores?.overall,
    payload?.data?.scores?.total,
    payload?.result?.score,
    payload?.result?.atsScore,
    payload?.result?.ats_score,
    payload?.result?.rating,
    payload?.result?.globalScore,
    payload?.result?.overallScore,
    payload?.result?.scores?.overall,
    payload?.result?.scores?.total,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeScore(candidate);
    if (normalized !== null) return normalized;
  }
  return null;
};

const getRapidApiAtsScore = async ({ parsedText, jobDescription = "" }) => {
  if (!process.env.RAPIDAPI_KEY) return null;

  const bodyAttempts = [
    { resume: parsedText, job_description: jobDescription },
    { resume_text: parsedText, job_description: jobDescription },
    { resumeText: parsedText, jobDescription },
    { text: parsedText, job_description: jobDescription },
  ];

  let lastError = null;

  for (const body of bodyAttempts) {
    try {
      const { data } = await axios.post(`https://${RAPIDAPI_HOST}/api/resume-rating`, body, {
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": process.env.RAPIDAPI_HOST || RAPIDAPI_HOST,
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        },
        timeout: 30000,
      });

      const score = parseRapidAtsScore(data);
      if (score !== null) return score;
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    console.warn("RapidAPI ATS call failed:", lastError?.response?.status || lastError.message);
  }
  return null;
};

const uploadAndAnalyzeResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Resume PDF is required" });
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF resumes are allowed" });
    }

    const {
      targetSkills: targetSkillsRaw = "",
      jobTitle = "",
      companyName = "",
      jobDescription = "",
      jobTags = "",
    } = req.body;

    const targetSkills = [
      ...new Set(
        [
          ...extractSkillsFromText(jobDescription),
          ...extractSkillsFromText(`${jobTitle} ${companyName}`),
          ...extractSkillsFromText(jobTags),
          ...targetSkillsRaw
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        ].filter(Boolean)
      ),
    ];

    const { parsedText, skills } = await parseResumeBuffer(req.file.buffer);
    const { atsScore: localAtsScore } = getAtsScore(skills, targetSkills.length ? targetSkills : skills);
    const rapidAtsScore = await getRapidApiAtsScore({ parsedText, jobDescription });
    const atsScore = rapidAtsScore ?? localAtsScore;
    const missingSkills = getSkillGap(skills, targetSkills);

    const resume = await Resume.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: req.user.id,
        file: req.file.originalname,
        skills,
        atsScore,
        parsedText,
      },
      { upsert: true, new: true }
    );

    return res.status(201).json({
      resume,
      detectedSkills: skills,
      roleSkills: targetSkills,
      missingSkills,
      atsScore,
      atsSource: rapidAtsScore !== null ? "rapidapi" : "local",
    });
  } catch (error) {
    return res.status(500).json({ message: "Resume analysis failed", error: error.message });
  }
};

const getMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });
    return res.json(resume);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch resume", error: error.message });
  }
};

const getJobRoles = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const { data } = await axios.get(`${JOB_BOARD_API}?page=${Number.isNaN(page) ? 1 : page}`);

    const roles = (data?.data || []).map((job) => ({
      id: job.slug,
      title: job.title,
      company: job.company_name,
      location: job.location,
      tags: job.tags || [],
      description: job.description || "",
    }));

    return res.json({
      roles,
      nextPage: data?.links?.next ? page + 1 : null,
      info: data?.meta?.info || "",
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch job roles", error: error.message });
  }
};

module.exports = { uploadAndAnalyzeResume, getMyResume, getJobRoles };
