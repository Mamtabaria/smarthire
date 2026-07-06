import { useState } from "react";

function ResumeUpload({ onUpload, loading, roles = [], jobsLoading = false, onLoadMore = () => {} }) {
  const [file, setFile] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setError("");

    if (!selectedRoleId) {
      setError("Please select a job role first.");
      return;
    }
    if (!file) {
      setError("Please upload your resume in PDF format.");
      return;
    }
    if (file.type !== "application/pdf") {
      setError("Only PDF resumes are allowed.");
      return;
    }

    const selectedRole = roles.find((role) => role.id === selectedRoleId);
    if (!selectedRole) {
      setError("Selected role is invalid. Please pick again.");
      return;
    }

    onUpload(file, selectedRole);
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-[#1e3a8a]">Analyze Your Resume</h3>
        <p className="mt-1 text-sm text-slate-500">
          Choose a job role, upload your resume PDF, and get role-based skill matching.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Job Role</span>
          <select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            className="w-full max-w-md rounded-lg border border-slate-300 px-2.5 py-2 text-xs outline-none transition focus:border-[#2f58c6] focus:ring-2 focus:ring-[#2f58c6]/20"
            disabled={jobsLoading || !roles.length}
          >
            <option value="">
              {jobsLoading ? "Loading roles..." : roles.length ? "Select a role" : "No roles available"}
            </option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {`${role.title} - ${role.company}`.slice(0, 70)}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Resume (PDF only)</span>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#2f58c6] focus:ring-2 focus:ring-[#2f58c6]/20 file:mr-2 file:rounded-md file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-sm"
          />
        </label>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          disabled={loading || jobsLoading}
          type="submit"
          className="rounded-xl bg-[#1e3a8a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#2546a8] disabled:opacity-60"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
        <button
          type="button"
          onClick={onLoadMore}
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          disabled={jobsLoading}
        >
          {jobsLoading ? "Loading..." : "Load More Roles"}
        </button>
      </div>
    </form>
  );
}

export default ResumeUpload;
