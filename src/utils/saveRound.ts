import axios from "axios";

export async function saveRound() {
  try {
    const { data } = await axios.get("/api/get-game-stat");

    const now = Date.now();
    const r1Start = new Date(data.r1StartTime).getTime();
    const r1End = new Date(data.r1EndTime).getTime();
    const r2Start = new Date(data.r2StartTime).getTime();
    const r2End = new Date(data.r2EndTime).getTime();
    let theRound = "";
    if (now < r1Start) {
      theRound = "Not Started";
    } else if (now >= r1Start && now <= r1End) {
      theRound = "Round 1";
    } else if (now > r1End && now < r2Start) {
      theRound = "Half Time";
    } else if (now >= r2Start && now <= r2End) {
      theRound = "Round 2";
    } else {
      theRound = "Finished";
    }
    localStorage.setItem("round", theRound);
  } catch (err) {
    console.error("Failed to fetch game stats:", err);
  }
}
