import { useLocation } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import RoadmapCard from "../components/RoadmapCard";

function SkillGap() {
  const location = useLocation();
  const initialMissing = location.state?.missingSkills || [];
  const [requiredSkills, setRequiredSkills] = useState("React, Git, REST API");
  const [result, setResult] = useState({
    missingSkills: initialMissing,
    roadmap: initialMissing.length
      ? ["Learn Git basics", "Master React fundamentals", "Build React project", "Learn REST APIs"]
      : [],
  });

  const analyze = async () => {
    const required = requiredSkills.split(",").map((s) => s.trim());
    const { data } = await api.post("/skills/gap", { requiredSkills: required });
    setResult(data);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-[#1e3a8a]">Skill Gap Engine</h2>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          value={requiredSkills}
          onChange={(e) => setRequiredSkills(e.target.value)}
          className="w-full rounded-md border border-slate-300 p-2 text-sm"
          placeholder="Required job skills (comma separated)"
        />
        <button onClick={analyze} className="mt-3 rounded bg-[#1e3a8a] px-4 py-2 text-sm text-white">
          Analyze Skill Gap
        </button>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-sm">
        <p className="font-semibold text-slate-700">Missing Skills:</p>
        <p className="mt-1 text-slate-600">{(result.missingSkills || []).join(", ") || "No gaps found"}</p>
      </div>
      {!!result.roadmap?.length && <RoadmapCard items={result.roadmap} />}
    </div>
  );
}

export default SkillGap;
