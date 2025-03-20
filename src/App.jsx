import { useState, useEffect, useRef } from "react";

export default function ReactionTimeGame() {
  const [fallingBox, setFallingBox] = useState(null); 
  const [top, setTop] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const speed = useRef(5);
  const animationRef = useRef(null);
  const containerHeight = 800; 

  const startNewRound = () => {
    setFallingBox(Math.floor(Math.random() * 3) + 1); 
    setTop(0);
    setGameOver(false);
    speed.current = 8; 
  };

  useEffect(() => {
    startNewRound();
  }, []);

  useEffect(() => {
    if (gameOver || fallingBox === null) return;

    const moveBox = () => {
      setTop((prevTop) => {
        if (prevTop + speed.current >= containerHeight) {
          setGameOver(true);
          return prevTop;
        }
        return prevTop + speed.current;
      });
      animationRef.current = requestAnimationFrame(moveBox);
    };

    animationRef.current = requestAnimationFrame(moveBox);

    return () => cancelAnimationFrame(animationRef.current);
  }, [gameOver, fallingBox]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (gameOver) return;
      const pressedBox = Number(event.key);
      if (pressedBox === fallingBox) {
        startNewRound(); 
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [fallingBox, gameOver]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className=" justify-center text-2xl font-bold mb-4">Reaction Time Game</h1>
      <p className="mt-4 text-gray-600">Press 1, 2, or 3 to catch the falling box! </p>
      <br />      
      {/* Container for falling boxes */}
      <div className="relative w-96 h-[600px] border-2 border-gray-400 overflow-hidden flex justify-center gap-6">
        {[1, 2, 3].map((num) => (
          <div
            key={num}
            className={`w-24 h-24 flex items-center justify-center text-white text-xl font-bold rounded-lg shadow-lg transition-all ${
              num === 1 ? "bg-red-500" : num === 2 ? "bg-blue-500" : "bg-green-500"
            } ${fallingBox === num ? "absolute top-0" : "opacity-50"}`}
            style={fallingBox === num ? { top: `${top}px` } : {}}
          >
            Box {num}
          </div>
        ))}
      </div>

      {/* Show reset button if game over */}
      {gameOver && (
        <div className="mt-6">
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg text-lg font-semibold"
            onClick={startNewRound}
          >
            Restart
          </button>
        </div>
      )}

      
    </div>
  );
}
