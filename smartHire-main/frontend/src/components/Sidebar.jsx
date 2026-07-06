import {
  LayoutDashboard,
  BriefcaseBusiness,
  FileUser,
  UserRound,
  LogOut,
  ClipboardList,
  Bot,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const userMenu = [
  { to: "/user-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/jobs", label: "Jobs", icon: BriefcaseBusiness },
  { to: "/applications", label: "Applications", icon: ClipboardList },
  { to: "/resume-analysis", label: "Resume & Skill Gap", icon: FileUser },
  { to: "/assistant", label: "Assistant", icon: Bot },
];

const clientMenu = [
  { to: "/client-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/client/post-job", label: "Post Internship", icon: BriefcaseBusiness },
  { to: "/client/applicants", label: "Review Applicants", icon: ClipboardList },
  { to: "/client/profile", label: "Profile", icon: UserRound },
];

function Sidebar({ isOpen = false, onClose = () => {} }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const menu = user?.role === "client" ? clientMenu : userMenu;

  return (
    <aside
      className={`fixed left-0 top-0 z-50 h-screen w-64 bg-[#1e3a8a] p-4 text-white transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="mb-2 flex justify-end">
        <button
          onClick={onClose}
          className="rounded-md border border-blue-300/40 p-1 text-blue-100"
          aria-label="Close sidebar"
        >
          <X size={16} />
        </button>
      </div>
      <div className="mb-6 flex items-center gap-2 border-b border-blue-300/40 pb-4">
        <div className="h-8 w-8 rounded bg-white/20" />
        <p className="text-sm font-semibold">SmartHire</p>
      </div>
      <div className="space-y-1">
        {menu.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
                isActive ? "bg-[#3b82f6]" : "hover:bg-blue-700/70"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </div>
      <button
        onClick={() => {
          localStorage.clear();
          navigate("/login");
          onClose();
        }}
        className="mt-6 flex w-full items-center gap-2 rounded-md border border-blue-300/30 px-3 py-2 text-sm hover:bg-blue-700/70"
      >
        <LogOut size={16} />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
