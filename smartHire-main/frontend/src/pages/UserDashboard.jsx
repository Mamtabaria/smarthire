import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  CircleCheckBig,
  FileText,
  Rocket,
  Sparkles,
  Upload,
  UserRound,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import SkillChart from "../components/SkillChart";
import api from "../services/api";

const actionCards = [
  {
    title: "Apply for Internship",
    desc: "Find best matching jobs and apply easily.",
    cta: "Explore Jobs",
    to: "/jobs",
    icon: BriefcaseBusiness,
  },
  {
    title: "Analyze Resume & Skill Gaps",
    desc: "Analyze your resume, check ATS score, and identify skill gaps.",
    cta: "Analyze Resume",
    to: "/resume-analysis",
    icon: Upload,
  },
  {
    title: "Chat with AI Assistant",
    desc: "Ask doubts and get help with resume, interviews, and career guidance.",
    cta: "Open Assistant",
    to: "/assistant",
    icon: Rocket,
  },
  {
    title: "Track Applications",
    desc: "Check status updates for all your applications.",
    cta: "View Applications",
    to: "/applications",
    icon: UserRound,
  },
];

function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const name = user?.name || "User";
  const [resumeFile, setResumeFile] = useState(null);
  const [applicationsSent, setApplicationsSent] = useState(0);
  const [applicationsWeek, setApplicationsWeek] = useState(0);
  const [atsScore, setAtsScore] = useState(0);
  const [atsDelta, setAtsDelta] = useState(0);
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsMessage, setAtsMessage] = useState("");
  const [skillsDetectedCount, setSkillsDetectedCount] = useState(0);
  const [skillsPreview, setSkillsPreview] = useState([]);
  const [chartSkills, setChartSkills] = useState([]);
  const [recommendedRoles, setRecommendedRoles] = useState([]);

  const loadDashboardData = async () => {
    const [resumeRes, appsRes, rolesRes] = await Promise.allSettled([
      api.get("/resume/my"),
      api.get("/applications/my"),
      api.get("/skills/recommendations"),
    ]);

    const resume = resumeRes.status === "fulfilled" ? resumeRes.value?.data : null;
    const apps = appsRes.status === "fulfilled" ? appsRes.value?.data || [] : [];
    const roles =
      rolesRes.status === "fulfilled" && Array.isArray(rolesRes.value?.data?.roles)
        ? rolesRes.value.data.roles
        : [];

    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const weeklyCount = apps.filter((app) => {
      const createdAt = new Date(app?.createdAt || 0).getTime();
      return createdAt >= weekAgo;
    }).length;

    const detectedSkills = Array.isArray(resume?.skills) ? resume.skills : [];

    setApplicationsSent(apps.length);
    setApplicationsWeek(weeklyCount);
    setAtsScore(Number(resume?.atsScore) || 0);
    setAtsDelta(0);
    setSkillsDetectedCount(detectedSkills.length);
    setSkillsPreview(detectedSkills.slice(0, 3));
    setChartSkills(detectedSkills.slice(0, 6));
    setRecommendedRoles(roles.slice(0, 3));
  };

  useEffect(() => {
    loadDashboardData().catch(() => {});
  }, []);

  const checkAtsScore = async () => {
    if (!resumeFile) {
      setAtsMessage("Please upload a PDF resume first.");
      return;
    }

    try {
      setAtsLoading(true);
      setAtsMessage("");
      const form = new FormData();
      form.append("resume", resumeFile);
      form.append("jobTitle", "");
      form.append("companyName", "");
      form.append("jobDescription", "");
      form.append("jobTags", "");

      const prevScore = atsScore;
      const { data } = await api.post("/resume/analyze", form);
      const nextScore = Number(data?.atsScore) || 0;
      const detectedSkills = Array.isArray(data?.detectedSkills) ? data.detectedSkills : [];

      setAtsDelta(nextScore - prevScore);
      setAtsScore(nextScore);
      setSkillsDetectedCount(detectedSkills.length);
      setSkillsPreview(detectedSkills.slice(0, 3));
      setChartSkills(detectedSkills.slice(0, 6));
      setAtsMessage("ATS score updated successfully.");
      await loadDashboardData();
    } catch (error) {
      setAtsMessage(error?.response?.data?.message || "Could not analyze resume.");
    } finally {
      setAtsLoading(false);
    }
  };

  const roleCards = useMemo(() => {
    return recommendedRoles.map((title, index) => {
      if (index === 0) return { title, match: "High Match", matchColor: "text-emerald-600 bg-emerald-100" };
      if (index === 1) return { title, match: "Good Match", matchColor: "text-green-600 bg-green-100" };
      return { title, match: "Potential Match", matchColor: "text-amber-600 bg-amber-100" };
    });
  }, [recommendedRoles]);

  const skillRows = useMemo(() => {
    if (!chartSkills.length) return [];
    const base = Math.max(35, Math.min(95, atsScore || 40));
    return chartSkills.slice(0, 4).map((skill, idx) => {
      const value = Math.max(30, Math.min(96, base - idx * 7));
      return [skill, `${value}%`];
    });
  }, [chartSkills, atsScore]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-2xl font-semibold leading-tight text-[#142f72] sm:text-3xl lg:text-4xl">
            Good Morning, {name} <span className="text-2xl sm:text-3xl">👋</span>
          </h2>
          <p className="mt-2 text-sm text-slate-500 sm:text-base lg:text-lg">Track your internship journey & boost your career growth!</p>
        </div>
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <img
            src="/internship-job-program-illustration-vector-removebg-preview.png"
            alt="Dashboard illustration"
            className="h-28 w-auto object-contain"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <FileText size={16} />
            Applications Sent
          </div>
          <div className="mt-2 flex items-end gap-2">
            <p className="font-numbers text-4xl font-semibold text-[#142f72]">{applicationsSent}</p>
            <p className="text-sm text-slate-500">+{applicationsWeek} this week</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <CircleCheckBig size={16} />
            ATS Score
          </div>
          <div className="mt-2 flex items-end gap-2">
            <p className="font-numbers text-4xl font-semibold text-[#142f72]">{atsScore}%</p>
            <p className={`text-sm ${atsDelta > 0 ? "text-emerald-600" : atsDelta < 0 ? "text-red-600" : "text-slate-500"}`}>
              {atsDelta > 0 ? `+${atsDelta}%` : `${atsDelta}%`}
            </p>
          </div>
          <div className="mt-3 space-y-2">
            <label className="block cursor-pointer rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50">
              Upload PDF Resume
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              />
            </label>
            {!!resumeFile?.name && <p className="truncate text-xs text-slate-500">{resumeFile.name}</p>}
            <button
              type="button"
              onClick={checkAtsScore}
              disabled={atsLoading}
              className="w-full rounded-lg bg-[#1e3a8a] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#2849aa] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {atsLoading ? "Checking..." : "Check ATS Score"}
            </button>
            {!!atsMessage && <p className="text-xs text-slate-600">{atsMessage}</p>}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <Sparkles size={16} />
            Skills Detected
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="font-numbers text-4xl font-semibold text-[#142f72]">{skillsDetectedCount}</p>
            {skillsPreview.length ? (
              skillsPreview.map((skill) => (
                <span key={skill} className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                  {skill}
                </span>
              ))
            ) : (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">No skills yet</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {actionCards.map((card) => (
          <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-base font-semibold text-[#142f72]">
              <card.icon size={17} />
              {card.title}
            </div>
            <p className="mt-2 text-sm text-slate-600">{card.desc}</p>
            <Link
              to={card.to}
              className="btn mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-4 py-2 text-sm text-white"
            >
              {card.cta} <ArrowRight size={15} />
            </Link>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-semibold text-[#142f72]">Skill Analytics</h3>
              <p className="mt-1 text-sm text-slate-500">Your Skill Readiness for Top Roles</p>
              <div className="mt-4">
                <SkillChart skills={chartSkills} />
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <h4 className="text-lg font-semibold text-[#142f72]">Frontend Readiness</h4>
              <p className="font-numbers mt-2 text-4xl font-semibold text-[#142f72] sm:text-5xl">{atsScore}%</p>
              <div className="mt-5 space-y-3">
                {skillRows.length ? (
                  skillRows.map(([skill, value]) => (
                    <div key={skill} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="inline-flex items-center gap-2 text-slate-700">{skill}</span>
                        <span className="font-numbers text-slate-600">{value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200">
                        <div className="h-2 rounded-full bg-[#2563eb]" style={{ width: value }} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-6 text-center text-sm text-slate-500">
                    No skill readiness data yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-[#142f72]">Recommended Job Roles</h3>
            <button className="text-sm font-medium text-[#2563eb]">View All</button>
          </div>
          <div className="space-y-3">
            {roleCards.length ? (
              roleCards.map((role) => (
                <div key={role.title} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-[#142f72]">{role.title}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${role.matchColor}`}>
                      {role.match}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                No recommended roles yet. Analyze your resume to get personalized recommendations.
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <BarChart3 size={15} />
            Updated from your latest resume analysis.
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
