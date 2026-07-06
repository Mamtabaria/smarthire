import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResumeUpload from "../components/ResumeUpload";
import api from "../services/api";

function ResumeAnalysis() {
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const loadRoles = async (page = 1) => {
    if (!page) return;
    try {
      setJobsLoading(true);
      const { data } = await api.get(`/resume/job-roles?page=${page}`);
      const incomingRoles = Array.isArray(data?.roles) ? data.roles : [];

      setRoles((prev) => {
        const merged = [...prev, ...incomingRoles];
        const byId = new Map(merged.map((item) => [item.id, item]));
        return [...byId.values()];
      });
      setNextPage(data?.nextPage || null);
    } catch (loadErr) {
      setError(loadErr?.response?.data?.message || "Failed to fetch job roles.");
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    loadRoles(1);
  }, []);

  const handleUpload = async (file, role) => {
    try {
      setError("");
      setAnalyzing(true);
      setSelectedRole(role);
      const form = new FormData();
      form.append("resume", file);
      form.append("jobTitle", role?.title || "");
      form.append("companyName", role?.company || "");
      form.append("jobDescription", role?.description || "");
      form.append("jobTags", (role?.tags || []).join(", "));
      const { data } = await api.post("/resume/analyze", form);
      setResult(data);
    } catch (uploadErr) {
      setError(uploadErr?.response?.data?.message || "Failed to analyze resume.");
    } finally {
      setAnalyzing(false);
    }
  };

  const goToRoadmapPage = () => {
    if (!result?.missingSkills?.length) return;
    navigate("/learning-roadmap", {
      state: {
        missingSkills: result?.missingSkills || [],
        roleSkills: result?.roleSkills || [],
        detectedSkills: result?.detectedSkills || [],
        roleTitle: `${selectedRole?.title || "Selected Role"}${selectedRole?.company ? ` - ${selectedRole.company}` : ""}`,
      },
    });
  };

  const matchedSkills = useMemo(() => {
    if (!result) return [];
    const detected = new Set((result.detectedSkills || []).map((s) => s.toLowerCase()));
    return (result.roleSkills || []).filter((skill) => detected.has(skill.toLowerCase()));
  }, [result]);

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#dbe7ff] bg-gradient-to-r from-[#eef4ff] via-white to-[#f7f9ff] p-5 shadow-sm">
        <p className="text-sm font-medium text-[#2f58c6]">Smart Resume Screening</p>
        <h2 className="mt-1 text-2xl font-semibold text-[#1d2b5d]">Resume Analysis</h2>
        <p className="mt-2 text-sm text-slate-600">
          Select a live job role from the API, upload a PDF resume, and get ATS scoring with matched and missing
          skills.
        </p>
      </section>

      <ResumeUpload
        onUpload={handleUpload}
        loading={analyzing}
        roles={roles}
        jobsLoading={jobsLoading}
        onLoadMore={() => loadRoles(nextPage)}
      />

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {result && (
        <section className="relative space-y-6 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-white via-[#f8fbff] to-[#eef3ff] p-5 shadow-[0_20px_50px_rgba(15,23,42,0.09)]">
          <div className="pointer-events-none absolute -top-24 right-10 h-56 w-56 rounded-full bg-blue-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-cyan-200/20 blur-3xl" />

          <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/80 p-4 shadow-sm backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Selected Role</p>
              <p className="mt-2 text-lg font-semibold leading-snug text-slate-800 md:text-xl">
                {selectedRole?.title || "Role"} {selectedRole?.company ? `- ${selectedRole.company}` : ""}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                  Role Skills: {result.roleSkills?.length || 0}
                </span>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  Matched: {matchedSkills.length}
                </span>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  Missing: {result.missingSkills?.length || 0}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center rounded-[1.5rem] border border-blue-200/70 bg-gradient-to-br from-[#1e3a8a] via-[#2447a4] to-[#2f58c6] p-4 text-white shadow-[0_16px_36px_rgba(30,58,138,0.35)] transition duration-300 hover:-translate-y-1">
              <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 border-white/50 bg-white/10 shadow-inner backdrop-blur">
                <p className="text-[10px] uppercase tracking-[0.14em] text-blue-100">ATS Score</p>
                <p className="mt-1 text-2xl font-bold">{result.atsScore}%</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <article className="rounded-2xl border border-slate-200/80 bg-white/85 p-3 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role Skill Library</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(result.roleSkills || []).length ? (
                  (result.roleSkills || []).map((skill) => (
                    <span key={`role-${skill}`} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">-</span>
                )}
              </div>
            </article>

            <div className="grid gap-3 md:grid-cols-2">
              <article className="rounded-2xl border border-emerald-200/80 bg-emerald-50/80 p-3 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Matched Track</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {matchedSkills.length ? (
                    matchedSkills.map((skill) => (
                      <span
                        key={`matched-${skill}`}
                        className="rounded-full border border-emerald-200 bg-white/80 px-2.5 py-1 text-xs text-emerald-700"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-emerald-700">-</span>
                  )}
                </div>
              </article>

              <article className="rounded-2xl border border-amber-200/80 bg-amber-50/85 p-3 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Gap Track</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(result.missingSkills || []).length ? (
                    (result.missingSkills || []).map((skill) => (
                      <span
                        key={`missing-${skill}`}
                        className="rounded-full border border-amber-200 bg-white/80 px-2.5 py-1 text-xs text-amber-700"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-amber-700">-</span>
                  )}
                </div>
              </article>
            </div>
          </div>

          {!!result?.missingSkills?.length && (
            <div className="rounded-[1.2rem] border border-[#dbe7ff] bg-gradient-to-r from-[#f7f9ff] to-[#eef4ff] p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#1d2b5d]">Need help learning missing skills?</p>
                  <p className="text-xs text-slate-600">
                    Generate a personalized roadmap based on your current profile and role requirements.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={goToRoadmapPage}
                  className="rounded-full bg-[#1e3a8a] px-4 py-2 text-sm font-medium text-white shadow-[0_8px_20px_rgba(30,58,138,0.3)] transition hover:-translate-y-0.5 hover:bg-[#2849aa] hover:shadow-[0_12px_24px_rgba(30,58,138,0.4)] disabled:opacity-60"
                >
                  Generate Roadmap
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default ResumeAnalysis;
