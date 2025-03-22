import React, { useEffect, useRef, useState } from "react";
import { PiBeerBottleFill } from "react-icons/pi";

const colors = ["#FF3131", "#FFFF00", "#0FFF50", "#FF800D", "#00F0FF"];

export default function Game() {
  const [fallingBottle, setFallingBottle] = useState(null);
  const [removedBottles, setRemovedBottles] = useState([]);
  const cycleCount = useRef(0);
  const startingTime = useRef();

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * 3);
    setTimeout(() => {
      setFallingBottle(randomIndex);
      startingTime.current = Date.now();

      setTimeout(() => {
        setRemovedBottles([...removedBottles, randomIndex]);
        setFallingBottle(null);
      }, 2000);
    }, 2000);
  }, []);

  return (
    <div className="flex flex-row items-center justify-center w-full gap-[15%]">
      {Array(3)
        .fill(0)
        .map((_, i) =>
          removedBottles.includes(i) ? null : (
            <PiBeerBottleFill
              className={`text-[150px] transition-transform duration-[2000ms] ${
                fallingBottle === i ? "translate-y-[120vh]" : ""
              }`}
              style={{
                color: colors[Math.floor(Math.random() * colors.length)],
                position: "relative",
              }}
              key={`${12}-${i}`}
            ></PiBeerBottleFill>
          )
        )}
    </div>
  );
}
