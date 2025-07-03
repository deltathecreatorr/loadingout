"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const VerifyUserEmail = async () => {
    try {
      const res = await axios.post("api/users/verifyemail", { token });
      console.log(res.data);
      toast.success(res.data.message);
      setVerified(true);
    } catch (error: any) {
      setError(true);
      return toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = window.location.search.split("=")[1];
    setToken(params || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      VerifyUserEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 py-12">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-indigo-600 mb-4">
          Email Verification
        </h1>

        {loading ? (
          <p className="text-lg text-gray-700">Verifying your email...</p>
        ) : verified ? (
          <p className="text-lg text-green-600 font-semibold">
            Your email has been verified successfully! You can now log in.
          </p>
        ) : error ? (
          <p className="text-lg text-red-600 font-semibold">
            Verification failed. Please try again or contact support.
          </p>
        ) : (
          <p className="text-lg text-gray-500">Invalid verification request.</p>
        )}
      </div>
    </div>
  );
}
