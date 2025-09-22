export function assignTeamString(): string {
  const teamStrings = [
    "INFERNO",
    "DEVILS",
    "LUCIFER",
    "DOOMED",
    "FIENDS",
    "TORMENT",
    "TERRORS",
    "CURSED",
    "SINNER",
    "ANGELS",
    "VORTEX",
    "FURIES",
    "FLAMES",
    "BANISH",
    "IDKWTF"
  ];
  return teamStrings[Math.floor(Math.random() * teamStrings.length)];
}
