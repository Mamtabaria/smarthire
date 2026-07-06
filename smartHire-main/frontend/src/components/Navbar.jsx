import { BriefcaseBusiness, UserCircle2 } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

function Avatar({ name }) {
  const initials = (name || "User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#4f7cff] to-[#1e3a8a] text-sm font-semibold text-white">
      {initials}
    </div>
  );
}

function Navbar() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isClient = user?.role === "client";
  const profileRoute = user?.role === "client" ? "/client/profile" : "/user-dashboard";

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-3 sm:px-6 sm:py-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-[#1e3a8a]">
          <BriefcaseBusiness size={20} />
          SmartHire
        </Link>
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-sm text-slate-600 md:flex">
          {isClient ? (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `border-b-2 pb-1 transition ${
                    isActive
                      ? "border-[#1e3a8a] font-semibold text-[#1e3a8a]"
                      : "border-transparent hover:border-[#93c5fd] hover:text-[#1e3a8a]"
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
                      : "border-transparent hover:border-[#93c5fd] hover:text-[#1e3a8a]"
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
                      : "border-transparent hover:border-[#93c5fd] hover:text-[#1e3a8a]"
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
                      : "border-transparent hover:border-[#93c5fd] hover:text-[#1e3a8a]"
                  }`
                }
              >
                Review
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `border-b-2 pb-1 transition ${
                    isActive
                      ? "border-[#1e3a8a] font-semibold text-[#1e3a8a]"
                      : "border-transparent hover:border-[#93c5fd] hover:text-[#1e3a8a]"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/jobs"
                className={({ isActive }) =>
                  `border-b-2 pb-1 transition ${
                    isActive
                      ? "border-[#1e3a8a] font-semibold text-[#1e3a8a]"
                      : "border-transparent hover:border-[#93c5fd] hover:text-[#1e3a8a]"
                  }`
                }
              >
                Jobs
              </NavLink>
              <NavLink
                to="/resume-analysis"
                className={({ isActive }) =>
                  `border-b-2 pb-1 transition ${
                    isActive
                      ? "border-[#1e3a8a] font-semibold text-[#1e3a8a]"
                      : "border-transparent hover:border-[#93c5fd] hover:text-[#1e3a8a]"
                  }`
                }
              >
                Resume
              </NavLink>
              <NavLink
                to="/assistant"
                className={({ isActive }) =>
                  `border-b-2 pb-1 transition ${
                    isActive
                      ? "border-[#1e3a8a] font-semibold text-[#1e3a8a]"
                      : "border-transparent hover:border-[#93c5fd] hover:text-[#1e3a8a]"
                  }`
                }
              >
                Assistant
              </NavLink>
            </>
          )}
        </div>
        {token ? (
          <div className="flex items-center">
            <Link
              to={profileRoute}
              className="flex items-center gap-1 rounded-full border border-slate-200 px-1.5 py-1 transition hover:border-[#2f58c6]/40 hover:bg-[#f7f9ff] sm:gap-2 sm:px-2"
            >
              <Avatar name={user?.name} />
              <span className="hidden pr-2 text-sm font-semibold text-slate-700 md:block">{user?.name || "User"}</span>
            </Link>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1 rounded-md bg-[#1e3a8a] px-2.5 py-2 text-xs font-medium text-white sm:gap-2 sm:px-3"
          >
            <UserCircle2 size={15} />
            <span className="hidden sm:inline">Login / Signup</span>
            <span className="sm:hidden">Login</span>
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
