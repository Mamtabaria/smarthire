import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  BriefcaseBusiness,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import api from "../services/api";

const sidebarMenu = [
  { to: "/client-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/client/post-job", label: "Post Internship", icon: BriefcaseBusiness },
  { to: "/client/applicants", label: "Review Applicants", icon: ClipboardList },
  { to: "/client/profile", label: "Profile", icon: UserRound },
];

function Avatar({ name }) {
  const initials = (name || "Client User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#4f7cff] to-[#1e3a8a] text-sm font-semibold text-white">
      {initials}
    </div>
  );
}

function ClientDashboard() {
  const navigate = useNavigate();
  const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      const [jobsRes, applicantsRes] = await Promise.all([
        api.get("/jobs/client/my-jobs"),
        api.get("/applications/client"),
      ]);
      setJobs(jobsRes.data || []);
      setApplicants(applicantsRes.data || []);
    };

    loadDashboard().catch(() => {
      setJobs([]);
      setApplicants([]);
    });
  }, []);

  useEffect(() => {
    const setSidebarForScreen = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };

    setSidebarForScreen();
    window.addEventListener("resize", setSidebarForScreen);
    return () => window.removeEventListener("resize", setSidebarForScreen);
  }, []);

  const shortlistedApplicants = applicants.filter((app) => app.status === "shortlisted").length;
  const topCandidates = applicants
    .map((app) => ({
      name: app?.user?.name || "Candidate",
      role: app?.job?.title || "Internship Candidate",
      atsScore: app?.atsScore || 0,
      status: app?.status || "pending",
    }))
    .sort((a, b) => b.atsScore - a.atsScore)
    .slice(0, 4);

  const recentApplications = applicants
    .map((app) => ({
      id: app._id,
      candidate: app?.user?.name || "Candidate",
      position: app?.job?.title || "Internship Role",
      score: app?.atsScore || 0,
      status: app?.status || "pending",
    }))
    .slice(0, 5);

  const stats = [
    { label: "Total Internships Posted", value: jobs.length, helper: "+2 this week" },
    { label: "Total Applications", value: applicants.length, helper: `${shortlistedApplicants} shortlisted` },
    { label: "Messages Sent", value: shortlistedApplicants + 3, helper: "Shortlisted follow-up sent" },
  ];

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#eef2ff] pt-16">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="relative flex h-16 w-full items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center text-[#1e3a8a]">
            <p className="text-base font-semibold">smartHire</p>
          </Link>
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-sm text-slate-500 md:flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `border-b-2 pb-1 transition ${
                  isActive
                    ? "border-[#1e3a8a] font-semibold text-[#1e3a8a]"
                    : "border-transparent hover:border-[#93c5fd] hover:text-[#2b4db7]"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/client-dashboard"
              className={({ isActive }) =>
                `border-b-2 pb-1 transition ${
                  isActive
                    ? "border-[#1e3a8a] font-semibold text-[#1e3a8a]"
                    : "border-transparent hover:border-[#93c5fd] hover:text-[#2b4db7]"
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/client/post-job"
              className={({ isActive }) =>
                `border-b-2 pb-1 transition ${
                  isActive
                    ? "border-[#1e3a8a] font-semibold text-[#1e3a8a]"
                    : "border-transparent hover:border-[#93c5fd] hover:text-[#2b4db7]"
                }`
              }
            >
              Post
            </NavLink>
            <NavLink
              to="/client/applicants"
              className={({ isActive }) =>
                `border-b-2 pb-1 transition ${
                  isActive
                    ? "border-[#1e3a8a] font-semibold text-[#1e3a8a]"
                    : "border-transparent hover:border-[#93c5fd] hover:text-[#2b4db7]"
                }`
              }
            >
              Review
            </NavLink>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="rounded-full border border-slate-200 p-2 text-slate-600">
              <Bell size={17} />
            </button>
            <Link
              to="/client/profile"
              className="flex items-center gap-1 rounded-full border border-slate-200 px-1.5 py-1.5 transition hover:border-[#2f58c6]/40 hover:bg-[#f7f9ff] sm:gap-2 sm:px-2"
            >
              <Avatar name={user?.name} />
              <div className="hidden pr-2 sm:block">
                <p className="text-sm font-semibold text-slate-800">{user?.name || "Client User"}</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <button
        onClick={() => setSidebarOpen((prev) => !prev)}
        className="fixed left-3 top-[4.6rem] z-40 rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-sm hover:bg-slate-50 md:left-6"
        aria-label="Toggle sidebar menu"
      >
        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {sidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar backdrop"
        />
      )}

      <div className="w-full">
        <aside
          className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-72 shrink-0 bg-gradient-to-b from-[#1c3c96] via-[#15337e] to-[#102968] p-5 text-white transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-7 border-b border-white/20 pb-5">
            <Link to="/" className="text-sm font-semibold">
              smartHire
            </Link>
          </div>

          <nav className="space-y-2">
            {sidebarMenu.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => {
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                    isActive ? "bg-[#2f58c6]" : "hover:bg-white/10"
                  }`
                }
              >
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={onLogout}
            className="mt-8 flex w-full items-center gap-3 rounded-xl border border-white/25 px-4 py-3 text-sm hover:bg-white/10"
          >
            <LogOut size={17} />
            Logout
          </button>
        </aside>

        <main className={`w-full px-3 pb-4 pt-16 transition-all duration-300 sm:px-4 md:px-6 lg:pt-6 lg:pr-8 ${sidebarOpen ? "lg:pl-[320px]" : "lg:pl-8"}`}>
          <div className="w-full md:px-1">
            <section className="mb-5 grid gap-4 xl:grid-cols-[2fr_1fr]">
              <div className="rounded-2xl border border-[#dbe4ff] bg-gradient-to-r from-[#f6f8ff] to-[#eef3ff] p-4 sm:p-6">
                <h1 className="break-words text-2xl font-bold leading-tight text-[#1e2c61] sm:text-3xl">
                  Welcome back, {user?.name || "Client"} <span className="inline-block">👋</span>
                </h1>
                <p className="mt-2 text-sm text-slate-600 sm:text-base">Manage your job postings and review student applications.</p>
              </div>
              <div className="overflow-hidden rounded-2xl border border-[#dbe4ff] bg-[#f4f7ff] p-3">
                <img
                  src="/internship-job-program-illustration-vector-removebg-preview.png"
                  alt="Client dashboard hero"
                  className="h-[142px] w-full object-contain"
                />
              </div>
            </section>

            <section className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3">
              {stats.map((item) => (
                <article
                  key={item.label}
                  className={`rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:p-4 ${
                    item.label === "Messages Sent" ? "col-span-2 md:col-span-1" : ""
                  }`}
                >
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className="font-numbers mt-2 text-3xl font-semibold text-[#1d2b5d] sm:text-4xl">{item.value}</p>
                  <p className="mt-2 inline-flex rounded-full bg-[#eaf4ff] px-2 py-1 text-xs text-[#1570b8]">
                    {item.helper}
                  </p>
                </article>
              ))}
            </section>

            <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[#1d2b5d]">Recent Applications</h2>
                  <Link to="/client/applicants" className="text-sm text-[#2d56cb] hover:underline">
                    View all
                  </Link>
                </div>

                <div className="space-y-2 md:hidden">
                  {recentApplications.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-400">
                      No applications yet.
                    </div>
                  )}
                  {recentApplications.map((item) => (
                    <article key={item.id} className="rounded-xl border border-slate-200 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-slate-700">{item.candidate}</p>
                          <p className="text-xs text-slate-500">{item.position}</p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs capitalize ${
                            item.status === "shortlisted"
                              ? "bg-emerald-100 text-emerald-700"
                              : item.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">
                        ATS Score: <span className="font-semibold text-[#1f3ca2]">{item.score}</span>
                      </p>
                    </article>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  <table className="hidden w-full min-w-[480px] text-sm md:table md:min-w-[560px]">
                    <thead className="bg-[#f3f6ff] text-left text-slate-500">
                      <tr>
                        <th className="rounded-l-lg px-3 py-2 font-medium">Candidate</th>
                        <th className="px-3 py-2 font-medium">Job Position</th>
                        <th className="px-3 py-2 font-medium">ATS Score</th>
                        <th className="rounded-r-lg px-3 py-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentApplications.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-3 py-6 text-center text-slate-400">
                            No applications yet.
                          </td>
                        </tr>
                      )}
                      {recentApplications.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100 last:border-b-0">
                          <td className="px-3 py-3 font-medium text-slate-700">{item.candidate}</td>
                          <td className="px-3 py-3 text-slate-600">{item.position}</td>
                          <td className="px-3 py-3 font-semibold text-[#1f3ca2]">{item.score}</td>
                          <td className="px-3 py-3">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs capitalize ${
                                item.status === "shortlisted"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : item.status === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <h3 className="mb-3 text-lg font-semibold text-[#1d2b5d]">Top Candidates</h3>
                  <div className="space-y-2">
                    {topCandidates.length === 0 && <p className="text-sm text-slate-400">No top candidates yet.</p>}
                    {topCandidates.map((candidate, idx) => (
                      <div key={`${candidate.name}-${idx}`} className="flex items-center justify-between rounded-xl bg-[#f6f8ff] px-3 py-2.5">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{candidate.name}</p>
                          <p className="text-xs text-slate-500">{candidate.role}</p>
                        </div>
                        <p className="font-numbers text-lg font-semibold text-[#2847af]">{candidate.atsScore}</p>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/client/post-job"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#2f58c6] px-3 py-2 text-sm font-medium text-white"
                  >
                    Post New Job
                  </Link>
                </div>

              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ClientDashboard;
