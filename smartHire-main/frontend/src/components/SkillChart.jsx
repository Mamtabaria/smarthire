import SkillAnalytics from "../charts/SkillAnalytics";

function SkillChart({ skills = [] }) {
  const chartData = skills.map((skill, idx) => ({
    skill,
    value: Math.max(40, 100 - idx * 9),
  }));

  return <SkillAnalytics data={chartData} />;
}

export default SkillChart;
