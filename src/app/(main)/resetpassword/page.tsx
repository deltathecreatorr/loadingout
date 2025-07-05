"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPassword() {
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);

  const [resetUser, setResetUser] = React.useState({
    resetPassword: "",
  });

  useEffect(() => {
    if (
      resetUser.resetPassword.length > 8 &&
      /\d/.test(resetUser.resetPassword)
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [resetUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetUser({
      ...resetUser,
      [e.target.name]: e.target.value,
    });
  };

  const onResetPassword = async () => {
    try {
      setProcessing(true);
      const resetdata = await axios.post("/api/users/resetpassword", resetUser);
      setButtonDisabled(true);
      toast.success(resetdata.data.message);
      setTimeout(() => {
        router.push("/login");
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
            Reset your Password 🤡
          </h1>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-2xl text-black"
            >
              New Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={resetUser.resetPassword}
              onChange={handleInputChange}
              placeholder="••••••••••••••••"
              className="rounded bg-purple-500 w-full px-3 py-1 font-mono text-black"
            ></input>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-2xl text-black"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={resetUser.resetPassword}
              onChange={handleInputChange}
              placeholder="••••••••••••••••"
              className="rounded bg-purple-500 w-full px-3 py-1 font-mono text-black"
            ></input>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              className="bg-purple-500 hover:bg-purple-300 transition-colors duration-200 text-black text-xl py-2 px-4 rounded flex justify-center"
              onClick={onResetPassword}
              disabled={buttonDisabled || processing}
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
