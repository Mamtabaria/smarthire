const Resume = require("../models/Resume");
const axios = require("axios");
const { getSkillGap, generateRoadmap } = require("../utils/skillGap");

const getSkillGapData = async (req, res) => {
  try {
    const requiredSkills = (req.body.requiredSkills || [])
      .map((s) => String(s).trim())
      .filter(Boolean);

    const resume = await Resume.findOne({ userId: req.user.id });
    if (!resume) return res.status(404).json({ message: "Analyze resume first" });

    const missingSkills = getSkillGap(resume.skills, requiredSkills);
    const roadmap = generateRoadmap(missingSkills);

    return res.json({
      userSkills: resume.skills,
      requiredSkills,
      missingSkills,
      roadmap,
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not compute skill gap", error: error.message });
  }
};

const getRoleRecommendations = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });
    if (!resume) return res.status(404).json({ message: "Analyze resume first" });

    const lower = resume.skills.map((s) => s.toLowerCase());
    const roles = [];

    if (["html", "css", "javascript"].every((s) => lower.includes(s))) {
      roles.push("Frontend Developer");
    }
    if (["node.js", "express", "mongodb"].every((s) => lower.includes(s))) {
      roles.push("MERN Developer");
    }
    if (["python", "sql"].every((s) => lower.includes(s))) {
      roles.push("Data Analyst Intern");
    }
    if (!roles.length) roles.push("Software Engineering Intern");

    return res.json({ roles });
  } catch (error) {
    return res.status(500).json({ message: "Could not get recommendations", error: error.message });
  }
};

const getProviderErrorDetails = (error) => {
  const status = error?.response?.status;
  const providerMessage =
    error?.response?.data?.error?.message ||
    error?.response?.data?.message ||
    error?.message ||
    "";
  const isDailyFreeLimit = String(providerMessage)
    .toLowerCase()
    .includes("free-models-per-day");

  return { status, providerMessage, isDailyFreeLimit };
};

const assistantChat = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: "Prompt is required" });

    if (!process.env.OPENROUTER_API_KEY) {
      return res.json({
        reply:
          "Assistant is temporarily unavailable because OPENROUTER_API_KEY is not configured on the server.",
        source: "fallback",
      });
    }

    try {
      const ai = await tryOpenRouterAssistantModels({
        prompt,
        apiKey: process.env.OPENROUTER_API_KEY,
      });
      const reply = ai?.reply || "I could not generate a response right now.";
      return res.json({ reply, model: ai?.model, source: "ai" });
    } catch (error) {
      const { status, providerMessage, isDailyFreeLimit } = getProviderErrorDetails(error);
      const warning = providerMessage
        ? status
          ? `AI provider returned ${status}: ${providerMessage}`
          : providerMessage
        : status
        ? `AI provider returned ${status}`
        : "AI provider unavailable";
      return res.json({
        reply: isDailyFreeLimit
          ? "Assistant paused because your OpenRouter free daily quota is exhausted. Add credits in OpenRouter or switch to a paid model in backend .env to continue."
          : "Assistant is temporarily unavailable right now. Please try again in a moment, or ask a shorter question.",
        source: "fallback",
        warning,
      });
    }
  } catch (error) {
    return res.json({
      reply: "Assistant could not process this request right now. Please try again.",
      source: "fallback",
      warning: error.message,
    });
  }
};

const cleanRoadmapItems = (text = "") =>
  String(text)
    .split("\n")
    .map((line) => line.replace(/^\s*[-*\d.)]+\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 10);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const parseRoadmapFromContent = (content = "") => {
  const raw = String(content || "").trim();
  if (!raw) return [];

  // Handle plain JSON response.
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.roadmap)) return parsed.roadmap;
  } catch (_err) {
    // noop
  }

  // Handle fenced JSON blocks such as ```json ... ```
  const fencedMatch = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    try {
      const parsed = JSON.parse(fencedMatch[1]);
      if (Array.isArray(parsed?.roadmap)) return parsed.roadmap;
    } catch (_err) {
      // noop
    }
  }

  return cleanRoadmapItems(raw);
};

const callOpenRouterRoadmap = async ({ prompt, model, apiKey }) => {
  const maxAttempts = 4;
  const retryableStatuses = new Set([429, 500, 502, 503, 504]);
  const backoffMs = [1200, 2500, 5000];
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const { data } = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 900,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
            "X-Title": "SmartHire",
          },
          timeout: 45000,
        }
      );

      const raw = data?.choices?.[0]?.message?.content || "";
      return { roadmap: parseRoadmapFromContent(raw), raw };
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;
      const shouldRetry = retryableStatuses.has(status) && attempt < maxAttempts;
      if (!shouldRetry) break;
      await sleep(backoffMs[Math.min(attempt - 1, backoffMs.length - 1)]);
    }
  }

  throw lastError || new Error("OpenRouter request failed");
};

const callOpenRouterAssistant = async ({ prompt, model, apiKey }) => {
  const maxAttempts = 4;
  const retryableStatuses = new Set([429, 500, 502, 503, 504]);
  const backoffMs = [1200, 2500, 5000];
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const { data } = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model,
          messages: [
            {
              role: "system",
              content:
                "You are SmartHire assistant. Help students with interviews, resume, projects, and career doubts. Keep responses concise, practical, and supportive.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.4,
          max_tokens: 700,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
            "X-Title": "SmartHire",
          },
          timeout: 45000,
        }
      );

      const reply = data?.choices?.[0]?.message?.content || "";
      return { reply };
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;
      const shouldRetry = retryableStatuses.has(status) && attempt < maxAttempts;
      if (!shouldRetry) break;
      await sleep(backoffMs[Math.min(attempt - 1, backoffMs.length - 1)]);
    }
  }

  throw lastError || new Error("OpenRouter assistant request failed");
};

const tryOpenRouterModels = async ({ prompt, apiKey }) => {
  const primaryModel = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free";
  const secondaryModel = process.env.OPENROUTER_FALLBACK_MODEL || "";
  const models = [primaryModel, secondaryModel].filter(Boolean);
  let lastError = null;

  for (const model of models) {
    try {
      const result = await callOpenRouterRoadmap({ prompt, model, apiKey });
      return { ...result, model };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("All OpenRouter model attempts failed");
};

const tryOpenRouterAssistantModels = async ({ prompt, apiKey }) => {
  const primaryModel = process.env.OPENROUTER_ASSISTANT_MODEL || "z-ai/glm-4.5-air:free";
  const secondaryModel = process.env.OPENROUTER_FALLBACK_MODEL || "";
  const models = [primaryModel, secondaryModel].filter(Boolean);
  let lastError = null;

  for (const model of models) {
    try {
      const result = await callOpenRouterAssistant({ prompt, model, apiKey });
      return { ...result, model };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("All OpenRouter assistant model attempts failed");
};

const generateRoadmapWithAI = async (req, res) => {
  try {
    const {
      missingSkills = [],
      roleSkills = [],
      detectedSkills = [],
      roleTitle = "Selected Role",
    } = req.body || {};

    const filteredMissing = (missingSkills || []).map((s) => String(s).trim()).filter(Boolean);
    if (!filteredMissing.length) {
      return res.status(400).json({ message: "Missing skills are required to generate a roadmap." });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ message: "OPENROUTER_API_KEY is missing in backend environment." });
    }

    const prompt = [
      "Create a practical learning roadmap for a job applicant.",
      `Target role: ${roleTitle}`,
      `Missing skills: ${filteredMissing.join(", ")}`,
      `Role skills: ${(roleSkills || []).join(", ") || "-"}`,
      `Current detected skills: ${(detectedSkills || []).join(", ") || "-"}`,
      "Return ONLY a JSON object with this exact shape:",
      '{ "roadmap": ["step 1", "step 2", "step 3"] }',
      "Rules:",
      "- 6 to 8 concise steps",
      "- include project-based practice",
      "- include free resources or docs mention inside step text",
      "- order from fundamentals to interview readiness",
    ].join("\n");

    let roadmap = [];
    let source = "ai";
    let warning = "";

    try {
      const aiResult = await tryOpenRouterModels({
        prompt,
        apiKey: process.env.OPENROUTER_API_KEY,
      });
      roadmap = aiResult.roadmap || [];
    } catch (error) {
      // Gracefully fallback when the free model is rate-limited/unavailable.
      source = "fallback";
      const status = error?.response?.status;
      warning = status
        ? `AI provider returned ${status}. Showing a generated fallback roadmap.`
        : "AI provider is temporarily unavailable. Showing a generated fallback roadmap.";
      roadmap = [];
    }

    if (!roadmap.length) {
      roadmap = generateRoadmap(filteredMissing);
      if (!warning && source !== "ai") {
        warning = "Generated fallback roadmap.";
      }
    }

    return res.json({ roadmap, missingSkills: filteredMissing, roleTitle, source, warning });
  } catch (error) {
    return res.status(500).json({ message: "AI roadmap generation failed", error: error.message });
  }
};

module.exports = { getSkillGapData, getRoleRecommendations, assistantChat, generateRoadmapWithAI };
