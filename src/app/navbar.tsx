"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar({ isVerified }: { isVerified: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navbarItems: string[] = [];
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (isVerified) {
    navbarItems.push("Home", "Profile", "Games", "Users", "Logout");
  } else {
    navbarItems.push("Home", "Login", "Register", "Games", "Users");
  }

  return (
    <nav
      className="block w-full max-w-screen px-4 py-4 mx-auto bg-white bg-opacity-10 position-fixed top-0 left-0 z-50 menu-toggle"
      onClick={toggleMenu}
    >
      <button className="menu-toggle" onClick={toggleMenu}>
        <span className={`menu ${isMenuOpen ? "cross" : "hamburger"}`}></span>
      </button>
      <ul className="menu-links">
        {navbarItems.map((item) => (
          <Link
            key={item}
            href={`/${item.toLowerCase()}`}
            className="mx-2 text-purple-500 hover:text-gray-300"
          >
            {item}
          </Link>
        ))}
      </ul>
    </nav>
  );
}
