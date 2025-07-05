"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPassword() {
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);

  const [forgotUser, setforgotUser] = React.useState({
    email: "",
  });

  useEffect(() => {
    if (
      forgotUser.email.length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotUser.email)
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [forgotUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setforgotUser({
      ...forgotUser,
      [e.target.name]: e.target.value,
    });
  };

  const onForgotPassword = async () => {
    try {
      setProcessing(true);
      const forgotdata = await axios.post(
        "/api/users/forgotpassword",
        forgotUser
      );
      setButtonDisabled(true);
      toast.success(forgotdata.data.message);
      setTimeout(() => {
        router.push("/resetpassword");
      }, 3000);
    } catch (error: any) {
      toast.error("An error occurred during this process", error);
    } finally {
      setProcessing(false);
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
              name="email"
              id="email"
              onChange={handleInputChange}
              value={forgotUser.email}
              placeholder="youremail@example.com"
              className="rounded bg-purple-500 w-full px-3 py-1 font-mono text-black"
            ></input>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              className="bg-purple-500 hover:bg-purple-300 transition-colors duration-200 text-black text-xl py-2 px-4 rounded flex justify-center"
              onClick={onForgotPassword}
              disabled={buttonDisabled || processing}
            >
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
