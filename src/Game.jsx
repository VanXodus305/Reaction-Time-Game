import React, { useState } from "react";
import { PiBeerBottleFill } from "react-icons/pi";

export default function Game() {
  const [counter, setCounter] = useState(-1);
  const colors = ["#FF3131", "#FFFF00", "#0FFF50", "#FF800D", "#00F0FF"];

  return (
    <div className="flex flex-row items-center justify-center w-full gap-[15%]">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <PiBeerBottleFill
            className={`text-[150px] transition-transform duration-[2000ms] ${
              counter === i ? "translate-y-[120vh]" : ""
            }`}
            style={{
              color: colors[Math.floor(Math.random() * colors.length)],
              position: "relative",
            }}
            key={`${12}-${i}`}
          ></PiBeerBottleFill>
        ))}
    </div>
  );
}
