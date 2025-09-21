export async function organizeRound(
  r1StartTime: string,
  r1EndTime: string,
  r2StartTime: string,
  r2EndTime: string
) {
  const now = Date.now();
  const r1Start = new Date(r1StartTime).getTime();
  const r1End = new Date(r1EndTime).getTime();
  const r2Start = new Date(r2StartTime).getTime();
  const r2End = new Date(r2EndTime).getTime();
  if (now < r1Start) {
    return "not started";
  } else if (now >= r1Start && now <= r1End) {
    return "1";
  } else if (now > r1End && now < r2Start) {
    return "half time";
  } else if (now >= r2Start && now <= r2End) {
    return "2";
  } else {
    return "finished";
  }
}
