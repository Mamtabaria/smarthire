import { BriefcaseBusiness, CalendarClock, MapPin } from "lucide-react";

function JobCard({ job, onApply, isActive = false, isApplied = false }) {
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(job.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
        isActive ? "border-[#2f58c6] ring-2 ring-[#2f58c6]/15" : "border-slate-200 hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="break-words text-lg font-semibold text-[#1e3a8a] sm:text-xl">{job.title}</h3>
          <p className="break-words text-sm text-slate-500">{job.company}</p>
        </div>
        <span className="rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-medium text-[#2f58c6]">{job.type}</span>
      </div>

      <div className="mt-3 space-y-1.5 text-sm text-slate-600">
        <p className="inline-flex items-center gap-1.5">
          <BriefcaseBusiness size={14} />
          Duration: {job.duration}
        </p>
        <p className="inline-flex items-center gap-1.5">
          <MapPin size={14} />
          Location: {job.location}
        </p>
        <p className="inline-flex items-center gap-1.5">
          <CalendarClock size={14} />
          Deadline: {new Date(job.deadline).toLocaleDateString()} ({daysLeft} days left)
        </p>
      </div>

      <p className="mt-3 line-clamp-2 break-words text-sm text-slate-600">{job.description}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {(job.skillsRequired || []).map((skill) => (
          <span key={skill} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
            {skill}
          </span>
        ))}
      </div>

      <button
        onClick={() => onApply(job)}
        disabled={isApplied}
        className={`mt-4 w-full rounded-xl px-4 py-2 text-sm font-medium text-white sm:w-auto ${
          isApplied ? "cursor-not-allowed bg-slate-400" : "bg-[#3b82f6]"
        }`}
      >
        {isApplied ? "Applied Already" : isActive ? "Selected" : "Apply Now"}
      </button>
    </div>
  );
}

export default JobCard;
