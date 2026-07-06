import { useEffect, useState } from "react";
import { BriefcaseBusiness, Filter, Search } from "lucide-react";
import JobCard from "../components/JobCard";
import api from "../services/api";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const [jobsRes, applicationsRes] = await Promise.all([api.get("/jobs"), api.get("/applications/my")]);
        setJobs(jobsRes.data || []);
        const appliedIds = new Set((applicationsRes.data || []).map((app) => app?.jobId?._id).filter(Boolean));
        setAppliedJobIds(appliedIds);
      } catch (_error) {
        setError("Unable to load jobs right now.");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const apply = async () => {
    if (!selectedJob || !resumeFile) return;
    setIsSubmitting(true);
    setMessage("");
    setError("");
    try {
      const form = new FormData();
      form.append("jobId", selectedJob._id);
      form.append("resume", resumeFile);
      await api.post("/applications/apply", form);
      setMessage("Applied successfully.");
      setAppliedJobIds((prev) => new Set([...prev, selectedJob._id]));
      setSelectedJob(null);
      setResumeFile(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchText.trim() ||
      [job.title, job.company, job.location, ...(job.skillsRequired || [])]
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase());
    const matchesType = typeFilter === "all" || (job.type || "").toLowerCase() === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#dbe4ff] bg-gradient-to-r from-[#f6f8ff] to-[#eef3ff] p-5 md:p-6">
        <h2 className="text-3xl font-bold text-[#1e2c61]">Job Listings</h2>
        <p className="mt-1 text-sm text-slate-600">Discover matching internships and jobs, then apply in one click.</p>
      </section>

      {message && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="relative w-full min-w-0 flex-1 sm:min-w-[240px]">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search title, company, location, skills"
            className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#2f58c6]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-slate-500" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#2f58c6]"
          >
            <option value="all">All Types</option>
            <option value="internship">Internship</option>
            <option value="job">Job</option>
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        {loading && (
          <div className="col-span-full rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
            Loading job listings...
          </div>
        )}
        {!loading && filteredJobs.length === 0 && (
          <div className="col-span-full rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
            No jobs match your current filters.
          </div>
        )}
        {filteredJobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            onApply={setSelectedJob}
            isActive={selectedJob?._id === job._id}
            isApplied={appliedJobIds.has(job._id)}
          />
        ))}
      </div>

      {selectedJob && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="inline-flex items-center gap-2 text-lg font-semibold text-[#1e2c61]">
              <BriefcaseBusiness size={17} />
              Apply: {selectedJob.title}
            </h3>
            <button
              onClick={() => {
                setSelectedJob(null);
                setResumeFile(null);
              }}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">Upload Resume (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#e8efff] file:px-3 file:py-2 file:text-[#1e3a8a]"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            />
            {resumeFile && <p className="mt-2 text-xs text-slate-500">Selected: {resumeFile.name}</p>}
          </div>

          <button
            onClick={apply}
            disabled={!resumeFile || isSubmitting}
            className="mt-4 rounded-xl bg-[#1e3a8a] px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </section>
      )}
    </div>
  );
}

export default Jobs;
