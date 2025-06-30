"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar(isUserLoggedIn: boolean) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (isUserLoggedIn) {
    const navbarItems = ["Home", "Profile", "Games", "Users", "Logout"];
  } else {
    const navbarItems = ["Home", "Login", "Register", "Games", "Users"];
  }

  return (
    <div>
      <nav className="block w-full max-w-screen px-4 py-4 mx-auto bg-white bg-opacity-10 "></nav>
    </div>
  );
}
