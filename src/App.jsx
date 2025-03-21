import React, { useEffect, useState } from "react";
import { PiBeerBottleFill } from "react-icons/pi";

const App = () => {
  const colors = ["#FF3131", "#FFFF00", "#0FFF50", "#FF800D", "#00F0FF"];
  const [fallingBottle, setFallingBottle] = useState(null);
  const [removedBottle, setRemovedBottle] = useState(null);
  const [cycleCount, setCycleCount] = useState(0);
  const [fallStartTime, setFallStartTime] = useState(null);

  useEffect(() => {
    if (cycleCount < 8) {
      const randomIndex = Math.floor(Math.random() * 3);
      setTimeout(() => {
        setFallingBottle(randomIndex);
        setFallStartTime(Date.now()); // Record the start time
        
        setTimeout(() => {
          setRemovedBottle(randomIndex);
          setTimeout(() => {
            setFallingBottle(null);
            setRemovedBottle(null);
            setCycleCount((prev) => prev + 1);
          }, 0); // Small delay before restarting the cycle
        }, 2000); // Allow time for animation before removal
      }, 2000);
    }
  }, [cycleCount]);

  useEffect(() => {
    const handleKeyPress = () => {
      if (fallStartTime && cycleCount < 8) {
        const reactionTime = Date.now() - fallStartTime;
        console.log(`Reaction time: ${reactionTime}ms`);
      }
    };
    
    if (cycleCount < 8) {
      window.addEventListener("keydown", handleKeyPress);
    }
    
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [fallStartTime, cycleCount]);

  return (
    <>
      <div className="overflow-hidden antialiased text-neutral-200 selection:bg-neutral-200 selection:text-neutral-800">
        <div className="fixed top-0 -z-10 h-full w-full">
          <div
            className={`absolute inset-0 -z-9 h-full w-full items-center px-5 py-24 bg-[url(/background.jpg)] bg-cover bg-center`}
          ></div>
        </div>
        <div className="container mx-auto px-5 h-screen select-none">
          <div className="h-full flex flex-col items-center justify-start w-full">
            <div className="flex flex-row items-center justify-center w-full gap-[15%]">
              {Array(3)
                .fill()
                .map((_, i) =>
                  removedBottle !== i ? (
                    <PiBeerBottleFill
                      className={`text-[150px] transition-transform duration-[2000ms] ${
                        fallingBottle === i ? "translate-y-[120vh]" : ""
                      }`}
                      style={{
                        color:
                          colors[Math.floor(Math.random() * colors.length)],
                        position: "relative",
                      }}
                      key={`${cycleCount}-${i}`}
                    ></PiBeerBottleFill>
                  ) : null
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
