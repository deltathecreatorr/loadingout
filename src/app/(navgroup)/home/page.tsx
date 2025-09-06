"use client";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { Press_Start_2P } from "next/font/google";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  const [gameCount, setGameCount] = useState<number>(0);
  const [userCount, setUserCount] = useState<number>(0);

  useEffect(() => {
    const fetchGameCount = async () => {
      try {
        const response = await axios.get("/api/igdb/gameCount");
        setGameCount(response.data.gameCount);
      } catch (error) {
        console.error("Error fetching game count:", error);
      }
    };

    const fetchUserCount = async () => {
      try {
        const response = await axios.get("/api/users/userCount");
        setUserCount(response.data.userCount);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchGameCount();
    fetchUserCount();
  }, []);

  return (
    <main className="flex flex-col">
      <Toaster position="top-left" reverseOrder={false} />
      <div className="grow p-8">
        <div className="nes-container is-centered is-dark grow text-2xl ">
          <p className="text-purple-500 text-4xl">Loadout?</p>
          <p className="font-mono">
            Loadout is your place to track your game collection and manage your
            gaming library. Share what games you own, have played, and want to
            play with others. Register an account to get started!
          </p>
          <div className="flex flex-wrap gap-[4] justify-center">
            <button
              type="button"
              className="btn bg-purple-700 btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl"
              onClick={() => (window.location.href = "/login")}
            >
              Login
            </button>
            <button
              type="button"
              className="btn bg-purple-700 btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl"
              onClick={() => (window.location.href = "/register")}
            >
              Register
            </button>
          </div>
        </div>
        <div>
          <div className="flex justify-center p-4">
            <div className="grid grid-cols-2 gap-5 w-full text-center max-w-xl">
              <div className="flex flex-col p-4 bg-purple-800 rounded-box">
                <span className="countdown justify-center text-6xl">
                  <>{gameCount}</>
                </span>
                <div className="text-4xl">Games Available</div>
              </div>
              <div className="flex flex-col p-4 bg-purple-800 rounded-box">
                <span className="countdown justify-center text-6xl">
                  <>{userCount}</>
                </span>
                <div className="text-4xl">Users Reviewing Games</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
