import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <main className="flex flex-col justify-center min-h-screen bg-gradient-to-t from-black to-purple-600 py-12">
      <Toaster position="top-left" reverseOrder={false} />
      <div></div>
    </main>
  );
}
