"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 8 &&
      /\d/.test(user.password)
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const onLogin = async () => {
    try {
      setProcessing(true);
      const userdata = await axios.post("/api/users/login", user);
      toast.success(userdata.data.message);
      router.push("/profile");
    } catch (error: any) {
      toast.error(
        error.response.data.message || "An error occurred during login."
      );
      console.log(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <Toaster position="top-left" reverseOrder={false} />
      <div className="w-full max-w-xl bg-gradient-to-b from-black-900 to-purple-600 mx-auto mt-20 p-6 rounded-lg shadow-xl">
        <form className="space-y-8">
          <h1 className="text-4xl text-black flex justify-center">Sign In</h1>
          <div>
            <label htmlFor="email" className="block mb-2 text-2xl text-black">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleInputChange}
              value={user.email}
              placeholder="youremail@example.com"
              className="rounded bg-purple-500 w-full px-3 py-1 font-mono text-black"
            ></input>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-2xl text-black"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={user.password}
              onChange={handleInputChange}
              placeholder="••••••••••••••••"
              className="rounded bg-purple-500 w-full px-3 py-1 font-mono text-black"
            ></input>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              className="bg-purple-500 hover:bg-purple-300 transition-colors duration-200 text-black text-xl py-2 px-4 rounded flex justify-center"
              onClick={onLogin}
              disabled={buttonDisabled || processing}
            >
              Login
            </button>
          </div>
          <div className="flex justify-between items-center font-mono text-sm">
            <Link
              href="/register"
              className="text-blue-400 hover:text-purple-300 transition-colors duration-200 align-left"
            >
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Don't have an account? Sign up
            </Link>
            <Link
              href="/forgotpassword"
              className="text-blue-400 hover:text-purple-300 transition-colors duration-200 align-right"
            >
              Forgot your password? Reset it
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
