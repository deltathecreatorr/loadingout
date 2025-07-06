"use client";
import React from "react";
import { Toaster } from "react-hot-toast";

export default function Games() {
  return (
    <main className="flex flex-col">
      <Toaster position="top-left" reverseOrder={false} />
      <div></div>
    </main>
  );
}
