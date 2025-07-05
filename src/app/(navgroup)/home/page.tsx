"use client";
import React from "react";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Toaster position="top-left" reverseOrder={false} />
      <div></div>
    </main>
  );
}
