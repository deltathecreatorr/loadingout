"use client";

import React from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Logout() {
  const [processing, setProcessing] = React.useState(false);
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loggedout, setLoggedout] = React.useState(false);
  const [error, setError] = React.useState(false);
  const router = useRouter();

  const onLogout = async () => {
    setProcessing(true);
    setButtonDisabled(true);
    try {
      const userdata = await axios.get("/api/users/logout");
      toast.success(userdata.data.message);
      setLoggedout(true);
      setTimeout(() => {
        router.push("/home");
      }, 5000);
    } catch (error: any) {
      console.log(error);
      setError(true);
      toast.error("An error occurred during logout.");
    } finally {
      setProcessing(false);
    }
  };
  return (
    <main className="flex flex-col">
      <Toaster position="top-left" reverseOrder={false} />
      <div className="w-full max-w-xl bg-gradient-to-b from-black-900 to-purple-600 mx-auto mt-[40%] p-12 rounded-lg shadow-xl">
        <div className="flex flex-col items-center">
          {processing ? (
            <p className="text-lg text-yellow-600">
              Logging out of your account...
            </p>
          ) : loggedout ? (
            <p className="text-lg text-green-600">Logged out successfully 😔</p>
          ) : error ? (
            <p className="text-lg text-red-600">
              Logging out failed. Please try again or contact support.
            </p>
          ) : (
            <p className="text-lg text-black-500">
              Please stay pretty please with a cherry on top 🥺.
            </p>
          )}
          <button
            type="button"
            className="bg-purple-500 hover:bg-purple-300 transition-colors duration-200 text-black text-xl py-2 px-4 rounded flex justify-center"
            onClick={onLogout}
            disabled={buttonDisabled || processing}
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
