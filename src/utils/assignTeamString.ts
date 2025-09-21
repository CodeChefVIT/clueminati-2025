export function assignTeamString(): string {
  // Simple test strings - can be updated later for production
  const teamStrings = [
    "AAAAAA",
    "BBBBBB", 
    "CCCCCC",
    "DDDDDD",
    "EEEEEE",
    "FFFFFF"
  ];
  
  return teamStrings[Math.floor(Math.random() * teamStrings.length)];
}
