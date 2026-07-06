const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const pdfParseModule = require("pdf-parse");

const SKILL_PATTERNS = {
  JavaScript: ["javascript", "js"],
  TypeScript: ["typescript", "ts"],
  React: ["react", "reactjs", "react.js"],
  "Node.js": ["node", "nodejs", "node.js"],
  Express: ["express", "expressjs", "express.js"],
  MongoDB: ["mongodb", "mongo db"],
  MySQL: ["mysql"],
  PostgreSQL: ["postgresql", "postgres", "postgre"],
  SQL: ["sql"],
  Python: ["python"],
  Java: ["java"],
  "C++": ["c++"],
  "C#": ["c#", "c sharp"],
  Git: ["git", "github"],
  "REST API": ["rest api", "restful api"],
  GraphQL: ["graphql"],
  HTML: ["html"],
  CSS: ["css"],
  Tailwind: ["tailwind", "tailwindcss", "tailwind css"],
  Redux: ["redux"],
  "Next.js": ["next.js", "nextjs", "next js"],
  Docker: ["docker"],
  Kubernetes: ["kubernetes", "k8s"],
  AWS: ["aws", "amazon web services"],
  Azure: ["azure", "microsoft azure"],
  GCP: ["gcp", "google cloud", "google cloud platform"],
  Figma: ["figma"],
  SAP: ["sap"],
  Salesforce: ["salesforce"],
  Shopify: ["shopify"],
  "Machine Learning": ["machine learning", "ml"],
  "Data Analysis": ["data analysis", "data analytics"],
  "Power BI": ["power bi"],
  SEO: ["seo", "search engine optimization"],
  "Google Ads": ["google ads"],
  "Meta Ads": ["meta ads", "facebook ads"],
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const normalizeSpacing = (text) => String(text || "").replace(/\s+/g, " ").trim();

const toRegex = (term) =>
  new RegExp(`(^|[^a-z0-9+#])${escapeRegex(term.toLowerCase())}([^a-z0-9+#]|$)`, "i");

const extractSkillsFromText = (inputText = "") => {
  const text = normalizeSpacing(inputText).toLowerCase();
  if (!text) return [];

  return Object.entries(SKILL_PATTERNS)
    .filter(([, aliases]) => aliases.some((alias) => toRegex(alias).test(text)))
    .map(([skill]) => skill);
};

const extractPdfText = async (buffer) => {
  // Support both pdf-parse v1 (function export) and v2 (PDFParse class export).
  if (typeof pdfParseModule === "function") {
    const data = await pdfParseModule(buffer);
    return data?.text || "";
  }

  if (typeof pdfParseModule?.default === "function") {
    const data = await pdfParseModule.default(buffer);
    return data?.text || "";
  }

  if (typeof pdfParseModule?.PDFParse === "function") {
    const parser = new pdfParseModule.PDFParse({ data: buffer });
    try {
      const data = await parser.getText();
      return data?.text || "";
    } finally {
      if (typeof parser.destroy === "function") {
        await parser.destroy().catch(() => {});
      }
    }
  }

  throw new Error("Unsupported pdf-parse module format");
};

const tryParseWithResumeParser = async (buffer) => {
  try {
    const resumeParser = require("resume-parser");
    const parseResume =
      resumeParser.parseResume ||
      resumeParser.parseResumeFile ||
      resumeParser.parseResumeUrl;

    if (typeof parseResume !== "function") return null;

    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "resume-parser-"));
    const inputFile = path.join(tmpDir, "resume.pdf");
    await fs.writeFile(inputFile, buffer);

    try {
      const parsed = await parseResume(inputFile, tmpDir);
      const parsedFile = typeof parsed === "string" ? path.join(tmpDir, `${parsed}.json`) : null;
      if (!parsedFile) return null;

      const raw = await fs.readFile(parsedFile, "utf8");
      return JSON.parse(raw);
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  } catch (_error) {
    // Keep analysis resilient when native parser dependencies are unavailable.
    return null;
  }
};

const parseResumeBuffer = async (buffer) => {
  if (!Buffer.isBuffer(buffer) || !buffer.length) {
    throw new Error("Invalid or empty PDF file");
  }

  const parsedText = await extractPdfText(buffer);

  const skillsFromPdf = extractSkillsFromText(parsedText);
  const resumeParserJson = await tryParseWithResumeParser(buffer);
  const skillsFromResumeParser = extractSkillsFromText(JSON.stringify(resumeParserJson || {}));

  const skills = [...new Set([...skillsFromPdf, ...skillsFromResumeParser])];
  return { parsedText, skills };
};

module.exports = {
  parseResumeBuffer,
  extractSkillsFromText,
  SKILL_PATTERNS,
};
