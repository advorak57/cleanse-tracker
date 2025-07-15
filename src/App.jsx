import { useState, useEffect } from "react";

const cleanseSchedule = Array.from({ length: 42 }, (_, i) => {
  const day = i + 1;
  let phase = "";
  let fastingType = "";
  let fastingWindow = [12, 20];
  let training = false;
  let supplements = {};
  let macros = {};

  if (day <= 7) {
    phase = "Prep & Drainage";
    fastingType = "16:8";
    training = [2, 4, 6, 7].includes(day);
    supplements = {
      morning: ["Activated Charcoal"],
      evening: ["Milk Thistle"]
    };
    macros = { protein: 180, carbs: 100, fat: 70 };
  } else if (day <= 21) {
    phase = "Parasite Cleanse";
    if ((day - 8) % 7 === 2) {
      fastingType = "24-hr Fast";
      fastingWindow = null;
      supplements = {};
      macros = { protein: 0, carbs: 0, fat: 0 };
    } else {
      phase = "Parasite Cleanse";
      fastingType = "20:4";
      fastingWindow = [16, 20];
      training = [2, 4, 6, 7].includes((day - 1) % 7 + 1);
      supplements = {
        morning: ["Para 1", "Activated Charcoal"],
        midday: ["Para 2", "Para 4"],
        evening: ["Magnesium Glycinate"]
      };
      macros = { protein: 190, carbs: 75, fat: 70 };
    }
  } else {
    phase = "Rebuild & Thrive";
    if ((day - 22) % 7 === 0) {
      fastingType = "36-hr Fast";
      fastingWindow = null;
      supplements = {
        morning: ["Creatine", "L-Glutamine", "Greens/Electrolytes"]
      };
      macros = { protein: 0, carbs: 0, fat: 0 };
    } else {
      fastingType = "18:6";
      fastingWindow = [12, 18];
      training = [2, 4, 6, 7].includes((day - 1) % 7 + 1);
      supplements = {
        morning: ["Creatine", "L-Glutamine", "Greens/Electrolytes"],
        midday: ["Multivitamin", "Zinc Carnosine", "Probiotic"],
        evening: ["Collagen", "Ashwagandha", "Magnesium Glycinate"]
      };
      macros = { protein: 200, carbs: 100, fat: 80 };
    }
  }

  return { day, phase, fastingType, fastingWindow, training, supplements, macros };
});

function getTimeRemaining([start, end]) {
  const now = new Date();
  const hour = now.getHours();
  if (hour < start) return { status: "Fasting", time: start - hour };
  if (hour >= start && hour < end) return { status: "Eating", time: end - hour };
  return { status: "Fasting", time: 24 - hour + start };
}

export default function App() {
  const [checkedDays, setCheckedDays] = useState({});
  const [timer, setTimer] = useState({});
  const [currentDay, setCurrentDay] = useState(1);

  const today = cleanseSchedule.find(d => d.day === currentDay);

  useEffect(() => {
    const interval = setInterval(() => {
      if (today?.fastingWindow) {
        setTimer(getTimeRemaining(today.fastingWindow));
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [currentDay]);

  return (
    <div style={{ padding: 20, fontFamily: "Arial", backgroundColor: "#0f172a", color: "#fff", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "#4ade80" }}>Cleanse Tracker</h1>
      <h2 style={{ textAlign: "center" }}>Day {today.day} - {today.phase}</h2>

      <div style={{ background: "#dc2626", padding: 10, borderRadius: 10, textAlign: "center" }}>
        <h3>Fasting Window</h3>
        {today.fastingWindow ? (
          <>
            <h2>{timer?.time || "--"} hours</h2>
            <p>Status: {timer?.status}</p>
          </>
        ) : (
          <p>{today.fastingType}</p>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Supplements</h3>
        {Object.entries(today.supplements).map(([time, list]) => (
          <div key={time}>
            <label>
              <input
                type="checkbox"
                checked={checkedDays[`${today.day}-${time}`] || false}
                onChange={() =>
                  setCheckedDays(prev => ({ ...prev, [`${today.day}-${time}`]: !prev[`${today.day}-${time}`] }))
                }
              />
              {" "}
              {time}: {list.join(", ")}
            </label>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Training</h3>
        <p>{today.training ? "✅ Training Allowed" : "❌ Rest Day"}</p>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Macros</h3>
        <p>Protein: {today.macros.protein}g</p>
        <p>Carbs: {today.macros.carbs}g</p>
        <p>Fat: {today.macros.fat}g</p>
      </div>

      <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 10 }}>
        <button onClick={() => setCurrentDay(d => Math.max(1, d - 1))}>Previous</button>
        <button onClick={() => setCurrentDay(d => Math.min(42, d + 1))}>Next</button>
      </div>
    </div>
  );
}
