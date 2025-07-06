"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  //search URL for the token that can only be received from nodemailer
  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    console.log(urlToken);
    setToken(urlToken || "");
    if (!urlToken) {
      toast.error("Invalid reset request");
    }
  }, []);

  const handleResetPassword = async () => {
    if (password !== confirmpassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (!/\d/.test(password)) {
      toast.error("Password must contain at least one number");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/users/resetpassword", {
        token,
        password,
      });

      if (response.data.success) {
        toast.success("Password reset successfully!");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        throw new Error(response.data.error || "Password reset failed");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to reset password";
      toast.error(errorMessage);

      // If token is invalid, redirect after showing error
      if (error.response?.status === 400) {
        setTimeout(() => router.push("/forgotpassword"), 3000);
      }
    } finally {
      setLoading(false);
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••"
              className="rounded bg-purple-500 w-full px-3 py-1 font-mono text-black"
            ></input>
          </div>

          <div>
            <label
              htmlFor="confirmpassword"
              className="block mb-2 text-2xl text-black"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmpassword"
              id="confirmpassword"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••••••"
              className="rounded bg-purple-500 w-full px-3 py-1 font-mono text-black"
            ></input>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              className="bg-purple-500 hover:bg-purple-300 transition-colors duration-200 text-black text-xl py-2 px-4 rounded flex justify-center"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
