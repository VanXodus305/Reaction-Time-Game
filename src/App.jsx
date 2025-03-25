import React, { useState } from "react";
import Authenticate from "./Authenticate";
import Game from "./Game";

export default function App() {
  const [currentUser, setCurrentUser] = useState({
    name: "",
    rollNo: 0,
  });

  return (
    <>
      <Authenticate currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <div className="overflow-hidden antialiased text-neutral-200 selection:bg-neutral-200 selection:text-neutral-800">
        <div className="fixed top-0 -z-10 h-full w-full">
          <div
            className={`absolute inset-0 -z-9 h-full w-full items-center px-5 py-24 bg-[url(/background.jpg)] bg-cover bg-center`}
          ></div>
        </div>
        <div className="container mx-auto px-5 h-screen select-none">
          <div className="h-full flex flex-col items-center justify-start w-full">
            {currentUser.rollNo !== 0 && <Game />}
          </div>
        </div>
      </div>
    </>
  );
}
