"use client";

import { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/24/outline";

const PointTally = () => {
  const [totalPoints, setTotalPoints] = useState<number>(0);

  useEffect(() => {
    let points = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || "";
      if (key.startsWith("challenge-")) {
        const storedData = JSON.parse(localStorage.getItem(key) || "{}");
        if (storedData.points) {
          points += 1; // Increment points for challenges with "points: true"
        }
      }
    }
    setTotalPoints(points);
  }, []);

  return (
    <div className="flex items-center gap-2 mb-8">
      <StarIcon className="h-6 w-6 text-green-400" />
      <span className="text-xl font-medium text-green-400">
        Total Points: {totalPoints}
      </span>
    </div>
  );
};

export default PointTally;
