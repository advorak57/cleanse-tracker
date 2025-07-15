
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const cleanseSchedule = Array.from({ length: 42 }, (_, i) => {
  const day = i + 1;
  let phase = "";
  let fastingType = "";
  let fastingWindow = [12, 20]; // 12 PM to 8 PM default
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
      fastingType = "24-hr";
      fastingWindow = null;
      supplements = {};
      macros = { protein: 0, carbs: 0, fat: 0 };
    } else {
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
      fastingType = "36-hr";
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

function getTimeRemaining(fastingWindow) {
  const now = new Date();
  const currentHour = now.getHours();
  const [start, end] = fastingWindow;

  if (currentHour < start) {
    return { status: "Fasting", time: start - currentHour };
  } else if (currentHour >= start && currentHour < end) {
    return { status: "Eating", time: end - currentHour };
  } else {
    return { status: "Fasting", time: 24 - currentHour + start };
  }
}

export default function CleanseApp() {
  const [checkedDays, setCheckedDays] = useState({});
  const [timer, setTimer] = useState({});
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      const today = cleanseSchedule.find(d => d.day === currentDay);
      if (today && today.fastingWindow) {
        const result = getTimeRemaining(today.fastingWindow);
        setTimer(result);
      }
    }, 60000); // update every minute

    return () => clearInterval(interval);
  }, [currentDay]);

  const toggleDay = (day) => {
    setCheckedDays({ ...checkedDays, [day]: !checkedDays[day] });
  };

  const day = cleanseSchedule.find(d => d.day === currentDay);

  return (
    <div className="p-4 space-y-4 text-white bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-green-400">🚀 Cleanse Tracker</h1>
      <h2 className="text-xl text-center">Day {day.day} - {day.phase}</h2>
      <div className="bg-red-600 p-4 rounded shadow text-center">
        <p className="text-lg font-bold">FASTING</p>
        <p className="text-4xl">{timer?.time || "--"}h</p>
        <p>{timer?.status || "Fasting"} Phase ({day.fastingType})</p>
      </div>
      <div className="bg-cyan-700 p-4 rounded shadow">
        <h3 className="font-bold text-lg mb-2">SUPPLEMENTS</h3>
        {Object.entries(day.supplements).map(([time, items]) => (
          <div key={time}>
            <p><input type="checkbox" /> <strong>{time}</strong>: {items.join(", ")}</p>
          </div>
        ))}
      </div>
      <div className="bg-purple-700 p-4 rounded shadow text-center">
        <p className="text-lg font-semibold">✅ TRAINING: {day.training ? "YES" : "NO"}</p>
      </div>
      <div className="bg-purple-900 p-4 rounded shadow">
        <p className="font-semibold">MACROS</p>
        <p>Protein: {day.macros.protein}g, Carbs: {day.macros.carbs}g, Fat: {day.macros.fat}g</p>
      </div>
      <div className="flex justify-center gap-4 pt-4">
        <Button onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}>Previous</Button>
        <Button onClick={() => setCurrentDay(Math.min(42, currentDay + 1))}>Next</Button>
      </div>
    </div>
  );
}
