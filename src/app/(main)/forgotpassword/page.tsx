"use client";

import React from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post("/api/users/forgotpassword", { email });
      toast.success(res.data.message);
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.error || "An error occurred");
      } else {
        toast.error("An error occurred");
      }
    }
  };

  return (
    <div>
      <Toaster position="top-left" reverseOrder={false} />
      <div className="w-full max-w-xl bg-gradient-to-b from-black-900 to-purple-600 mx-auto p-6 rounded-lg shadow-xl">
        <form className="space-y-8">
          <h1 className="text-4xl text-black flex justify-center">
            Forgot your Password? 😭
          </h1>
          <div>
            <label htmlFor="email" className="block mb-2 text-2xl text-black">
              Email
            </label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="youremail@example.com"
              className="rounded bg-purple-500 w-full px-3 py-1 font-mono text-black"
            ></input>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              className="bg-purple-500 hover:bg-purple-300 transition-colors duration-200 text-black text-xl py-2 px-4 rounded flex justify-center"
              onClick={handleSubmit}
              disabled={!email}
            >
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
