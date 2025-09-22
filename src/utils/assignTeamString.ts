export function assignTeamString(): string {
  const teamStrings = [
    "MMNAMO",
    "SODENM",
    "GNELAS",
    "ENVAEH",
    "LEVDEI",
    "WOHDSA",
    "TRULAI",
    "CRADES",
    "OSEHRE",
    "TLEATB",
    "LCRSEI",
    "MFSALE",
    "NHSAIC",
    "WPEROS",
    "ZALEAB"
];
  return teamStrings[Math.floor(Math.random() * teamStrings.length)];
}
