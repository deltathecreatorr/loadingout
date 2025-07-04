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
    <div className="flex flex-col max-h-screen max-w-xl bg-gradient-to-b from-black-900 to-purple-600 mx-auto p-6 rounded-lg text-center justify-center">
      <h1 className="text-2xl text-black mb-4">Email Verification</h1>

      {loading ? (
        <p className="text-lg text-black">Verifying your email...</p>
      ) : verified ? (
        <p className="text-lg text-green-600">
          Your email has been verified successfully! You can now log in.
        </p>
      ) : error ? (
        <p className="text-lg text-red-600">
          Verification failed. Please try again or contact support.
        </p>
      ) : (
        <p className="text-lg text-black">Invalid verification request.</p>
      )}
    </div>
  );
}
