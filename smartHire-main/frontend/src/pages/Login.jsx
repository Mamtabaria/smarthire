import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BriefcaseBusiness } from "lucide-react";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token) return;
    navigate(user?.role === "client" ? "/client-dashboard" : "/user-dashboard", { replace: true });
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate(data.user.role === "client" ? "/client-dashboard" : "/user-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[url('/istockphoto-1473121061-612x612.jpg')] bg-cover bg-center px-4 py-10">
      <div className="absolute inset-0 bg-white/72" />
      <div className="absolute -left-28 top-24 h-72 w-72 rounded-full bg-blue-200/45 blur-3xl" />
      <div className="absolute -right-20 bottom-12 h-72 w-72 rounded-full bg-cyan-200/45 blur-3xl" />

      <form onSubmit={onSubmit} className="relative z-10 w-full max-w-md rounded-2xl border border-blue-100 bg-white/95 p-8 shadow-xl backdrop-blur-sm">
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-[#1e3a8a]">
          <BriefcaseBusiness size={16} />
          SmartHire
        </div>
        <h3 className="mt-4 text-center text-2xl font-semibold text-[#1e3a8a]">Welcome Back</h3>
        <p className="mt-1 text-center text-sm text-slate-500">Enter your credentials to access your account.</p>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <input
          className="mt-5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="Email"
          type="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="Password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn mt-5 w-full rounded-lg bg-[#1e3a8a] py-2.5 text-sm text-white">Sign In</button>
        <p className="mt-4 text-center text-sm text-slate-600">
          No account?{" "}
          <Link to="/signup" className="font-medium text-[#3b82f6]">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
