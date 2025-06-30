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
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

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
    } finally {
      setProcessing(false);
    }
  };

  return (
    // flex direction column, justify center, min height screen, black background, padding y-axis 12
    <div className="flex flex-col justify-center min-h-screen bg-gradient-to-t from-black to-purple-600 py-12">
      <Toaster position="top-left" reverseOrder={false} />
      <div></div>
    </div>
  );
}
