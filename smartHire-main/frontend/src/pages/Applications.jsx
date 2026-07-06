import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, CircleCheckBig, Clock3, Filter, Search, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        const res = await api.get("/applications/my");
        setApplications(res.data || []);
      } catch (_error) {
        setError("Unable to load applications right now.");
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const normalized = useMemo(
    () =>
      applications.map((app) => {
        const rawStatus = String(app?.status || "Pending").toLowerCase();
        const status =
          rawStatus === "shortlisted"
            ? "Shortlisted"
            : rawStatus === "rejected"
              ? "Rejected"
              : "Pending";
        return {
          ...app,
          status,
          title: app?.jobId?.title || "Untitled Role",
          company: app?.jobId?.company || "Unknown Company",
          location: app?.jobId?.location || "Location N/A",
        };
      }),
    [applications]
  );

  const filtered = useMemo(() => {
    return normalized.filter((app) => {
      const matchesStatus = statusFilter === "all" || app.status.toLowerCase() === statusFilter;
      const term = query.trim().toLowerCase();
      const matchesQuery =
        !term || `${app.title} ${app.company} ${app.location}`.toLowerCase().includes(term);
      return matchesStatus && matchesQuery;
    });
  }, [normalized, query, statusFilter]);

  const stats = useMemo(
    () => ({
      total: normalized.length,
      shortlisted: normalized.filter((a) => a.status === "Shortlisted").length,
      pending: normalized.filter((a) => a.status === "Pending").length,
      rejected: normalized.filter((a) => a.status === "Rejected").length,
    }),
    [normalized]
  );

  const statusBadge = (status) => {
    if (status === "Shortlisted") return "bg-emerald-100 text-emerald-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const getRemark = (app) => {
    if (app.status === "Rejected") return "Needs skill improvement";
    if (app.status === "Shortlisted") return "Great fit for this role. You will be mailed shortly.";
    return "Under review";
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#dbe4ff] bg-gradient-to-r from-[#f6f8ff] to-[#eef3ff] p-4 sm:p-5 md:p-6">
        <h2 className="text-2xl font-bold text-[#1e2c61] sm:text-3xl">Application Status</h2>
        <p className="mt-1 text-xs text-slate-600 sm:text-sm">
          Track your application progress and quickly act on rejected profiles.
        </p>
      </section>

      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total</p>
            <BriefcaseBusiness size={16} className="text-[#2f58c6]" />
          </div>
          <p className="font-numbers mt-2 text-2xl font-semibold text-[#1d2b5d] sm:text-3xl">{stats.total}</p>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Shortlisted</p>
            <CircleCheckBig size={16} className="text-emerald-600" />
          </div>
          <p className="font-numbers mt-2 text-2xl font-semibold text-emerald-700 sm:text-3xl">{stats.shortlisted}</p>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Pending</p>
            <Clock3 size={16} className="text-yellow-600" />
          </div>
          <p className="font-numbers mt-2 text-2xl font-semibold text-yellow-700 sm:text-3xl">{stats.pending}</p>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Rejected</p>
            <XCircle size={16} className="text-red-600" />
          </div>
          <p className="font-numbers mt-2 text-2xl font-semibold text-red-700 sm:text-3xl">{stats.rejected}</p>
        </article>
      </section>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="relative w-full min-w-0 flex-1 sm:min-w-[240px]">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by role, company, location"
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
            Loading applications...
          </div>
        )}
        {!loading &&
          filtered.map((app) => (
            <article key={app._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-800">{app.title}</p>
                  <p className="text-xs text-slate-500">{app.company}</p>
                  <p className="mt-1 text-xs text-slate-500">{app.location}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs ${statusBadge(app.status)}`}>{app.status}</span>
              </div>
              <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
                <span className="font-semibold text-slate-600">Remark: </span>
                {getRemark(app)}
              </div>
              {app.status === "Rejected" && (
                <button
                  onClick={() =>
                    navigate("/skill-gap", {
                      state: { missingSkills: app.missingSkills || [] },
                    })
                  }
                  className="mt-3 rounded-lg bg-[#3b82f6] px-3 py-1.5 text-xs text-white"
                >
                  Generate Learning Roadmap
                </button>
              )}
            </article>
          ))}
        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center text-sm text-slate-400 shadow-sm">
            No applications match your filters.
          </div>
        )}
      </div>

      <div className="hidden overflow-auto rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full min-w-[680px] text-left text-sm md:min-w-[760px]">
          <thead className="bg-[#f7f9ff] text-slate-500">
            <tr>
              <th className="p-3 font-medium">Job</th>
              <th className="p-3 font-medium">Company</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Remark</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">
                  Loading applications...
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((app) => (
                <tr key={app._id} className="border-t border-slate-100">
                  <td className="p-3">
                    <p className="font-medium text-slate-700">{app.title}</p>
                    <p className="text-xs text-slate-500">{app.location}</p>
                  </td>
                  <td className="p-3 text-slate-700">{app.company}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs ${statusBadge(app.status)}`}>{app.status}</span>
                  </td>
                  <td className="p-3">
                    {app.status === "Rejected" ? (
                      <div className="space-y-2">
                        <p className="text-xs text-red-700">{getRemark(app)}</p>
                        <button
                          onClick={() =>
                            navigate("/skill-gap", {
                              state: { missingSkills: app.missingSkills || [] },
                            })
                          }
                          className="rounded-lg bg-[#3b82f6] px-3 py-1.5 text-xs text-white"
                        >
                          Generate Learning Roadmap
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-600">{getRemark(app)}</span>
                    )}
                  </td>
                </tr>
              ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">
                  No applications match your filters.
                </td>
              </tr>
            )}
            {/* legacy row format kept for reference
            {applications.map((app) => (
              <tr key={app._id} className="border-t">
                ...
              </tr>
            ))}
            */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Applications;
