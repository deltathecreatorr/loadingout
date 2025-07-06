"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import axios from "axios";

export default function NavbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isUserVerified, setIsUserVerified] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const response = await axios.get("/api/users/checkVerification");
        setIsUserVerified(response.data.isVerified);
      } catch (error) {
        console.error("Failed to fetch auth status:", error);
        setIsUserVerified(false);
      }
    }

    checkAuthStatus();
  }, [pathname]); // Re-run when route changes

  return (
    <div className="min-h-screen bg-gradient-to-t from-black to-purple-600">
      <Navbar isVerified={isUserVerified} />
      {children}
    </div>
  );
}
