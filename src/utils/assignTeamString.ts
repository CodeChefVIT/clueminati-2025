export function assignTeamString(): string {
  const teamStrings = ["STRING_1", "STRING_2", "STRING_3"];
  return teamStrings[Math.floor(Math.random() * teamStrings.length)];
}
