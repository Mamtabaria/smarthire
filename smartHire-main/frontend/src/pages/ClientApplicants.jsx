import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Filter,
  MessageCircleMore,
  Search,
  Users,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";
import api from "../services/api";

function ClientApplicants() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [viewingResumeId, setViewingResumeId] = useState("");

  useEffect(() => {
    const loadApplicants = async () => {
      try {
        setLoading(true);
        const res = await api.get("/applications/client");
        setData(res.data || []);
      } catch (_error) {
        setError("Failed to load applicants.");
      } finally {
        setLoading(false);
      }
    };

    loadApplicants();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      setInfoMessage("");
      await api.patch(`/applications/${id}/status`, { status });
      setData((prev) => prev.map((item) => (item._id === id ? { ...item, status } : item)));
    } catch (_error) {
      setError("Unable to update status right now.");
    } finally {
      setUpdatingId("");
    }
  };

  const generateLinks = async () => {
    if (!selected.length) return;
    setIsGenerating(true);
    setError("");
    setInfoMessage("This feature will be implemented as future enhancement.");
    setIsGenerating(false);
  };

  const viewResume = async (applicationId) => {
    try {
      setViewingResumeId(applicationId);
      setError("");
      const response = await api.get(`/applications/${applicationId}/resume`, { responseType: "blob" });
      const blobUrl = URL.createObjectURL(response.data);
      const opened = window.open(blobUrl, "_blank", "noopener,noreferrer");
      if (!opened) {
        setError("Could not open resume. Please allow pop-ups and try again.");
      }
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    } catch (_error) {
      setError("Unable to open resume.");
    } finally {
      setViewingResumeId("");
    }
  };

  const normalized = useMemo(
    () =>
      data.map((item) => {
        const applicant = item?.userId || item?.user || {};
        const lowerStatus = String(item?.status || "pending").toLowerCase();
        return {
          ...item,
          applicantId: applicant?._id,
          name: applicant?.name || "Candidate",
          email: applicant?.email || "",
          atsScore: item?.atsScore || 0,
          skillMatch: item?.skillMatch || 0,
          statusText:
            lowerStatus === "shortlisted"
              ? "Shortlisted"
              : lowerStatus === "rejected"
                ? "Rejected"
                : "Pending",
        };
      }),
    [data]
  );

  const filtered = useMemo(() => {
    return normalized
      .filter((item) => {
        if (statusFilter === "all") return true;
        return item.statusText.toLowerCase() === statusFilter;
      })
      .filter((item) => {
        if (!query.trim()) return true;
        const term = query.toLowerCase();
        return item.name.toLowerCase().includes(term) || item.email.toLowerCase().includes(term);
      })
      .sort((a, b) => b.atsScore - a.atsScore);
  }, [normalized, query, statusFilter]);

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((item) => item.applicantId && selected.includes(item.applicantId));

  const totalApplicants = normalized.length;
  const shortlistedCount = normalized.filter((item) => item.statusText === "Shortlisted").length;
  const rejectedCount = normalized.filter((item) => item.statusText === "Rejected").length;
  const pendingCount = normalized.filter((item) => item.statusText === "Pending").length;

  const toggleSelectAllVisible = (checked) => {
    const visibleIds = filtered.map((item) => item.applicantId).filter(Boolean);
    if (checked) {
      setSelected((prev) => Array.from(new Set([...prev, ...visibleIds])));
      return;
    }
    setSelected((prev) => prev.filter((id) => !visibleIds.includes(id)));
  };

  const badgeClass = (status) => {
    if (status === "Shortlisted") return "bg-emerald-100 text-emerald-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#dbe4ff] bg-gradient-to-r from-[#f6f8ff] to-[#eef3ff] p-4 sm:p-5 md:p-6">
        <h2 className="text-2xl font-bold text-[#1e2c61] sm:text-3xl">Client Applicants</h2>
        <p className="mt-1 text-sm text-slate-600">
          Review applications, update candidate status, and send interview messages faster.
        </p>
      </section>

      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {infoMessage && (
        <p className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">{infoMessage}</p>
      )}

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Applicants</p>
            <Users size={16} className="text-[#2f58c6]" />
          </div>
          <p className="font-numbers mt-2 text-2xl font-semibold text-[#1d2b5d] sm:text-3xl">{totalApplicants}</p>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Shortlisted</p>
            <UserRoundCheck size={16} className="text-emerald-600" />
          </div>
          <p className="font-numbers mt-2 text-2xl font-semibold text-emerald-700 sm:text-3xl">{shortlistedCount}</p>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Pending</p>
            <CheckCircle2 size={16} className="text-yellow-600" />
          </div>
          <p className="font-numbers mt-2 text-2xl font-semibold text-yellow-700 sm:text-3xl">{pendingCount}</p>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Rejected</p>
            <UserRoundX size={16} className="text-red-600" />
          </div>
          <p className="font-numbers mt-2 text-2xl font-semibold text-red-700 sm:text-3xl">{rejectedCount}</p>
        </article>
      </section>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="relative w-full min-w-0 flex-1 sm:min-w-[240px]">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email"
            className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#2f58c6]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#2f58c6]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center text-sm text-slate-400 shadow-sm">
            Loading applicants...
          </div>
        )}
        {!loading &&
          filtered.map((item) => (
            <article key={item._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.email || "No email"}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs ${badgeClass(item.statusText)}`}>{item.statusText}</span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2.5 text-xs">
                <p className="text-slate-600">ATS: <span className="font-semibold text-[#1f3ca2]">{item.atsScore}</span></p>
                <p className="text-slate-600">Match: <span className="font-semibold">{item.skillMatch}%</span></p>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                {item.resume ? (
                  <button
                    type="button"
                    onClick={() => viewResume(item._id)}
                    disabled={viewingResumeId === item._id}
                    className="text-xs font-medium text-[#2f58c6] underline disabled:opacity-60"
                  >
                    {viewingResumeId === item._id ? "Opening..." : "View Resume"}
                  </button>
                ) : (
                  <span className="text-xs text-slate-400">Resume not uploaded</span>
                )}
              </div>

              <div className="mt-3">
                {item.statusText === "Pending" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(item._id, "Shortlisted")}
                      disabled={updatingId === item._id}
                      className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs text-white disabled:opacity-60"
                    >
                      Shortlist
                    </button>
                    <button
                      onClick={() => updateStatus(item._id, "Rejected")}
                      disabled={updatingId === item._id}
                      className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs text-white disabled:opacity-60"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-slate-500">Action completed</span>
                )}
              </div>
            </article>
          ))}
        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center text-sm text-slate-400 shadow-sm">
            No applicants found for current filter.
          </div>
        )}
      </div>

      <div className="hidden overflow-auto rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full min-w-[720px] text-left text-sm md:min-w-[860px]">
          <thead className="bg-[#f7f9ff] text-slate-500">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={(e) => toggleSelectAllVisible(e.target.checked)}
                />
              </th>
              <th className="p-3 font-medium">Student Name</th>
              <th className="p-3 font-medium">Resume</th>
              <th className="p-3 font-medium">ATS Score</th>
              <th className="p-3 font-medium">Skill Match</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  Loading applicants...
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((item) => (
                <tr key={item._id} className="border-t border-slate-100">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(item.applicantId)}
                      onChange={(e) =>
                        setSelected((prev) =>
                          e.target.checked ? [...prev, item.applicantId] : prev.filter((id) => id !== item.applicantId)
                        )
                      }
                    />
                  </td>
                  <td className="p-3">
                    <div>
                      <p className="font-medium text-slate-700">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.email || "No email"}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    {item.resume ? (
                      <button
                        type="button"
                        onClick={() => viewResume(item._id)}
                        disabled={viewingResumeId === item._id}
                        className="text-[#2f58c6] hover:underline disabled:opacity-60"
                      >
                        {viewingResumeId === item._id ? "Opening..." : "View Resume"}
                      </button>
                    ) : (
                      <span className="text-slate-400">Not uploaded</span>
                    )}
                  </td>
                  <td className="p-3 font-semibold text-[#1f3ca2]">{item.atsScore}</td>
                  <td className="p-3">{item.skillMatch}%</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs ${badgeClass(item.statusText)}`}>{item.statusText}</span>
                  </td>
                  <td className="p-3">
                    {item.statusText === "Pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(item._id, "Shortlisted")}
                          disabled={updatingId === item._id}
                          className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs text-white disabled:opacity-60"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => updateStatus(item._id, "Rejected")}
                          disabled={updatingId === item._id}
                          className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs text-white disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">Action completed</span>
                    )}
                  </td>
                </tr>
              ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  No applicants found for current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={generateLinks}
          disabled={!selected.length || isGenerating}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a8a] px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <MessageCircleMore size={15} />
          {isGenerating ? "Generating..." : "Generate WhatsApp Links"}
        </button>
        <p className="text-sm text-slate-500">{selected.length} candidate(s) selected</p>
      </div>
    </div>
  );
}

export default ClientApplicants;
