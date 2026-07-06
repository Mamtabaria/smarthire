const getAtsScore = (candidateSkills = [], requiredSkills = []) => {
  if (!requiredSkills.length) {
    return { atsScore: 0, skillMatch: 0, matchedSkills: [] };
  }

  const normalizedCandidate = candidateSkills.map((s) => s.toLowerCase().trim());
  const normalizedRequired = requiredSkills.map((s) => s.toLowerCase().trim());

  const matchedSkills = normalizedRequired.filter((skill) =>
    normalizedCandidate.some((candidate) => candidate.includes(skill))
  );

  const score = Math.round((matchedSkills.length / normalizedRequired.length) * 100);

  return {
    atsScore: score,
    skillMatch: score,
    matchedSkills,
  };
};

module.exports = { getAtsScore };
