const getSkillGap = (userSkills = [], requiredSkills = []) => {
  const normalizedUser = userSkills.map((s) => s.toLowerCase().trim());
  const normalizedRequired = requiredSkills.map((s) => s.toLowerCase().trim());

  return requiredSkills.filter((requiredSkill, idx) => {
    const key = normalizedRequired[idx];
    return !normalizedUser.some((skill) => skill.includes(key));
  });
};

const generateRoadmap = (missingSkills = []) => {
  if (!missingSkills.length) {
    return [
      "Revise your current stack deeply",
      "Build one strong project",
      "Practice interview questions",
    ];
  }

  const roadmap = [];
  if (missingSkills.some((s) => s.toLowerCase().includes("git"))) roadmap.push("Learn Git basics");
  if (missingSkills.some((s) => s.toLowerCase().includes("react")))
    roadmap.push("Master React fundamentals");
  if (missingSkills.some((s) => s.toLowerCase().includes("rest")))
    roadmap.push("Understand and build REST APIs");

  missingSkills.forEach((skill) => {
    roadmap.push(`Complete beginner to intermediate ${skill} practice`);
  });
  roadmap.push("Build and deploy a capstone project with missing skills");

  return [...new Set(roadmap)];
};

module.exports = { getSkillGap, generateRoadmap };
