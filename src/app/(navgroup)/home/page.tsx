"use client";
import React from "react";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Toaster position="top-left" reverseOrder={false} />
      <div className="grow p-8">
        <div className="grow text-xl text-black font-mono">
          <p className="text-4xl">Loadout?</p>
          <p>
            Loadout is your place to track your game collection and manage your
            gaming library. Share what games you own, have played, and want to
            play with others. Register an account to get started!
          </p>
        </div>
      </div>
    </main>
  );
}
