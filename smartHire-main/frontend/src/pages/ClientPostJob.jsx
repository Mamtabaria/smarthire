import { useState } from "react";
import { BriefcaseBusiness, Building2, CalendarClock, MapPin, Sparkles } from "lucide-react";
import api from "../services/api";

function ClientPostJob() {
  const [form, setForm] = useState({
    title: "",
    company: "",
    type: "Internship",
    location: "",
    duration: "",
    skillsRequired: "",
    deadline: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      await api.post("/jobs", {
        ...form,
        skillsRequired: form.skillsRequired
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      setMessage("Job posted successfully.");
      setForm({
        title: "",
        company: "",
        type: "Internship",
        location: "",
        duration: "",
        skillsRequired: "",
        deadline: "",
        description: "",
      });
    } catch (error) {
      setMessage(error?.response?.data?.message || "Unable to post the job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-5xl space-y-5">
      <div className="rounded-2xl border border-[#dbe4ff] bg-gradient-to-r from-[#f6f8ff] to-[#eef3ff] p-5 md:p-6">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#1e3a8a] shadow-sm">
            <BriefcaseBusiness size={18} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1e2c61]">Post a New Opportunity</h2>
            <p className="mt-1 text-sm text-slate-600">
              Create an internship or job listing with clear requirements to attract the right candidates.
            </p>
          </div>
        </div>
      </div>

      {message && (
        <p
          className={`rounded-xl border px-4 py-3 text-sm ${
            message.includes("success")
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2 md:p-6">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Job Title</span>
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#2f58c6] focus:ring-2 focus:ring-[#2f58c6]/20"
            placeholder="e.g. Frontend Developer Intern"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </label>

        <label className="space-y-1.5">
          <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <Building2 size={14} /> Company
          </span>
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#2f58c6] focus:ring-2 focus:ring-[#2f58c6]/20"
            placeholder="e.g. SmartHire"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            required
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Opportunity Type</span>
          <select
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#2f58c6] focus:ring-2 focus:ring-[#2f58c6]/20"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option>Internship</option>
            <option>Job</option>
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <MapPin size={14} /> Location
          </span>
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#2f58c6] focus:ring-2 focus:ring-[#2f58c6]/20"
            placeholder="e.g. Remote / Delhi"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Duration</span>
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#2f58c6] focus:ring-2 focus:ring-[#2f58c6]/20"
            placeholder="e.g. 6 months"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            required
          />
        </label>

        <label className="space-y-1.5">
          <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <Sparkles size={14} /> Skills Required
          </span>
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#2f58c6] focus:ring-2 focus:ring-[#2f58c6]/20"
            placeholder="React, JavaScript, Tailwind"
            value={form.skillsRequired}
            onChange={(e) => setForm({ ...form, skillsRequired: e.target.value })}
            required
          />
        </label>

        <label className="space-y-1.5 md:col-span-2">
          <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <CalendarClock size={14} /> Application Deadline
          </span>
          <input
            type="date"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#2f58c6] focus:ring-2 focus:ring-[#2f58c6]/20"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            required
          />
        </label>

        <label className="space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Description</span>
          <textarea
            className="min-h-[120px] w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#2f58c6] focus:ring-2 focus:ring-[#2f58c6]/20"
            placeholder="Describe responsibilities, expectations, and any additional details."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </label>

        <button
          disabled={isSubmitting}
          className="md:col-span-2 rounded-xl bg-[#1e3a8a] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1b347c] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Posting..." : "Post Job"}
        </button>
      </form>
    </section>
  );
}

export default ClientPostJob;
