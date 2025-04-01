import { addToast } from "@heroui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { PiBeerBottleFill } from "react-icons/pi";

export default function Game({ currentUser }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [gameState, setGameState] = useState({
    status: "not-started", // New state to track game status
    fallingBottleIndex: null,
    bottleColors: ["blue", "blue", "blue"],
    cycleCount: 0,
    fallStartTime: null,
    message: "Press Start to Begin the Reaction Time Game",
    reactionTimes: [],
    bestReactionTime: null,
    roundOver: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/leaderboard")
      .then((data) => {
        setLeaderboard(data.data.records);
      })
      .catch(() => {
        addToast({
          title: "Unable to fetch leaderboard",
          description: "Please try again later",
          color: "danger",
        });
      });
  }, []);

  const handleStartGame = () => {
    setGameState({
      status: "playing",
      fallingBottleIndex: null,
      bottleColors: ["blue", "blue", "blue"],
      cycleCount: 0,
      fallStartTime: null,
      message: "",
      reactionTimes: [],
      bestReactionTime: null,
      roundOver: false,
    });
  };

  useEffect(() => {
    // Only run the game logic when status is "playing"
    if (gameState.status !== "playing" || gameState.cycleCount >= 5) return;

    const startNewRound = () => {
      const randomIndex = Math.floor(Math.random() * 3);
      const randomDelay = Math.floor(Math.random() * 2000) + 1000;

      // Timeout to start the fall
      const fallTimeout = setTimeout(() => {
        setGameState((prevState) => ({
          ...prevState,
          fallingBottleIndex: randomIndex,
          fallStartTime: Date.now(),
          message: "",
          roundOver: false,
          bottleColors: ["blue", "blue", "blue"],
        }));

        // Timeout to handle missed round
        const missedRoundTimeout = setTimeout(() => {
          setGameState((prevState) => {
            // If round is not over, it means user missed the button press
            if (!prevState.roundOver) {
              return {
                ...prevState,
                message: "❌ Too Slow! You missed the button press.",
                bottleColors: prevState.bottleColors.map((color, index) =>
                  index === randomIndex ? "red" : color
                ),
                reactionTimes: [...prevState.reactionTimes, "Missed"],
                roundOver: true,
              };
            }
            return prevState;
          });
        }, 1500); // Same as falling duration

        return () => clearTimeout(missedRoundTimeout);
      }, randomDelay);

      // Timeout to reset bottle after fall
      const resetTimeout = setTimeout(() => {
        setGameState((prevState) => ({
          ...prevState,
          fallingBottleIndex: null,
          cycleCount: prevState.cycleCount + 1,
          bottleColors: ["blue", "blue", "blue"],
        }));
      }, randomDelay + 2000);

      // Cleanup function to prevent memory leaks
      return () => {
        clearTimeout(fallTimeout);
        clearTimeout(resetTimeout);
      };
    };

    const cleanup = startNewRound();
    return cleanup;
  }, [gameState.status, gameState.cycleCount]);

  useEffect(() => {
    const keyMapping = { 0: "a", 1: "s", 2: "d" };

    const handleKeyPress = (event) => {
      if (gameState.status !== "playing") return;

      const { fallingBottleIndex, fallStartTime, roundOver } = gameState;

      if (fallStartTime && fallingBottleIndex !== null && !roundOver) {
        const pressedKey = event.key.toLowerCase();

        if (pressedKey === keyMapping[fallingBottleIndex]) {
          const timeTaken = Date.now() - fallStartTime;

          setGameState((prevState) => ({
            ...prevState,
            message: `✅ Success! Reaction time: ${timeTaken}ms`,
            bottleColors: prevState.bottleColors.map((color, index) =>
              index === fallingBottleIndex ? "green" : color
            ),
            reactionTimes: [...prevState.reactionTimes, `${timeTaken}ms`],
            bestReactionTime:
              prevState.bestReactionTime === null
                ? timeTaken
                : Math.min(prevState.bestReactionTime, timeTaken),
            roundOver: true,
          }));
        } else {
          setGameState((prevState) => ({
            ...prevState,
            message: "❌ Wrong key! You lost this round.",
            bottleColors: prevState.bottleColors.map((color, index) =>
              index === fallingBottleIndex ? "red" : color
            ),
            reactionTimes: [...prevState.reactionTimes, "Wrong Key"],
            roundOver: true,
          }));
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    gameState.status,
    gameState.fallStartTime,
    gameState.fallingBottleIndex,
    gameState.roundOver,
  ]);

  useEffect(() => {
    if (gameState.status !== "playing" || gameState.cycleCount < 5) return;

    setLeaderboard((prevLeaderboard) => {
      return [
        ...prevLeaderboard,
        {
          name: currentUser.name,
          rollNo: currentUser.rollNo,
          bestScore: gameState.bestReactionTime,
        },
      ].sort((a, b) => parseFloat(a.bestScore) - parseFloat(b.bestScore));
    });

    axios
      .post("http://localhost:3000/time", {
        time: gameState.bestReactionTime,
        rollNo: currentUser.rollNumber,
      })
      .then(() => {
        addToast({
          title: `Time submitted successfully! Your best reaction time was: ${gameState.bestReactionTime}ms`,
          variant: "success",
        });
      })
      .catch(() => {
        addToast({
          title: "Something went wrong",
          description: "Please try again later",
          color: "danger",
        });
      });
  }, [gameState.status, gameState.cycleCount]);

  const {
    status,
    fallingBottleIndex,
    bottleColors,
    cycleCount,
    message,
    reactionTimes,
    bestReactionTime,
  } = gameState;

  return (
    <div className="overflow-hidden antialiased text-black selection:bg-gray-200 selection:text-black bg-white min-h-screen flex flex-col">
      <div className="container mx-auto px-5 select-none">
        <div className="h-full flex flex-col items-center justify-start w-full">
          {status === "not-started" ? (
            <div className="flex flex-col items-center justify-center h-full mt-14">
              <h1 className="text-3xl font-bold mb-6">Reaction Time Game</h1>
              <p className="text-lg mb-6 text-center">
                Press the corresponding key (A, S, D) when the bottle starts
                falling
              </p>
              <button
                className="px-8 py-4 bg-green-600 text-white rounded-lg text-xl hover:bg-green-700 transition-colors"
                onClick={handleStartGame}
              >
                Start Game
              </button>
            </div>
          ) : status === "playing" && cycleCount < 5 ? (
            <>
              {/* Buttons ABOVE the bottles */}
              <div className="flex flex-row items-center justify-center w-full gap-[15%] mt-[10vh]">
                {["A", "S", "D"].map((key) => (
                  <button
                    key={key}
                    className="p-4 bg-gray-300 rounded text-xl text-black font-bold"
                  >
                    {key}
                  </button>
                ))}
              </div>

              {/* Bottles positioned below the buttons */}
              <div className="flex flex-row items-center justify-center w-full gap-[15%] mt-[5vh]">
                {[0, 1, 2].map((i) => (
                  <PiBeerBottleFill
                    key={`${cycleCount}-${i}`}
                    className={`text-[150px] transition-transform duration-[1500ms] ${
                      fallingBottleIndex === i ? "translate-y-[150vh]" : ""
                    }`}
                    style={{
                      color: bottleColors[i],
                      position: "relative",
                      opacity: 1,
                      transform:
                        fallingBottleIndex === i
                          ? "translateY(150vh)"
                          : "translateY(0)",
                    }}
                  />
                ))}
              </div>

              {/* Reaction Time Display */}
              <div className="absolute top-10 right-10 bg-gray-200 p-5 rounded shadow">
                <h3 className="text-lg font-bold mb-1">Reaction Times</h3>
                {reactionTimes.map((time, index) => (
                  <p
                    key={index}
                    className={`text-sm ${
                      time === "Missed" || time === "Wrong Key"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    Round {index + 1}: {time}
                  </p>
                ))}
              </div>

              <p className="mt-4 text-lg font-bold">{message}</p>
            </>
          ) : (
            <div className="flex flex-col items-center mt-14 w-full">
              <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
              <h1 className="font-bold mt-4 text-2xl">🏆 Leaderboard</h1>
              <div className="flex flex-col items-center mt-4 rounded-xl border-2 border-gray-500 min-w-[400px] max-w-[500px] overflow-hidden">
                {leaderboard.map((player, index) => (
                  <div
                    key={index}
                    className={`flex flex-row justify-between items-center w-full p-4 ${
                      index % 2 === 0 ? "bg-gray-400" : "bg-neutral-100"
                    }`}
                  >
                    <h1 className="font-semibold text-lg w-1/3 text-left">
                      #{index + 1}{" "}
                      {index === 0
                        ? "🥇"
                        : index === 1
                        ? "🥈"
                        : index === 2
                        ? "🥉"
                        : ""}
                    </h1>
                    <h1 className="font-semibold text-lg w-1/3 text-center">
                      {player.name}
                    </h1>
                    <h1 className="font-semibold text-lg w-1/3 text-right">
                      {player.bestScore}
                    </h1>
                  </div>
                ))}
              </div>
              {bestReactionTime !== null && (
                <div>
                  <p className="text-lg font-semibold">
                    🏆 Best Reaction Time: {bestReactionTime}ms
                  </p>
                </div>
              )}
              <button
                className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700"
                onClick={handleStartGame}
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
