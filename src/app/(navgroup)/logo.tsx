"use client";
import Image from "next/image";
import React, { useState } from "react";

interface LogoLetterKeys<T> {
  [letterKey: string]: T;
}

const UNPRESSED_LETTERS: LogoLetterKeys<string> = {
  L: "/keyboard_logo/unpressed/unpressed0.png",
  O1: "/keyboard_logo/unpressed/unpressed1.png",
  A: "/keyboard_logo/unpressed/unpressed2.png",
  D: "/keyboard_logo/unpressed/unpressed3.png",
  O2: "/keyboard_logo/unpressed/unpressed4.png",
  U: "/keyboard_logo/unpressed/unpressed5.png",
  T: "/keyboard_logo/unpressed/unpressed6.png",
};

const PRESSED_LETTERS: LogoLetterKeys<string> = {
  L: "/keyboard_logo/pressed/pressed0.png",
  O1: "/keyboard_logo/pressed/pressed1.png",
  A: "/keyboard_logo/pressed/pressed2.png",
  D: "/keyboard_logo/pressed/pressed3.png",
  O2: "/keyboard_logo/pressed/pressed4.png",
  U: "/keyboard_logo/pressed/pressed5.png",
  T: "/keyboard_logo/pressed/pressed6.png",
};

function LogoLetters({
  letterKey,
}: {
  letterKey: keyof typeof UNPRESSED_LETTERS;
}) {
  const [hover, setHover] = useState(false);

  return (
    <>
      {hover ? (
        <Image
          src={PRESSED_LETTERS[letterKey]}
          alt="Logo"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          width={104}
          height={96}
        />
      ) : (
        <Image
          src={UNPRESSED_LETTERS[letterKey]}
          alt="Logo"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          width={104}
          height={96}
        />
      )}
    </>
  );
}

export default function Logo() {
  return (
    <div className="flex align-center justify-center ">
      <LogoLetters letterKey="L" />
      <LogoLetters letterKey="O1" />
      <LogoLetters letterKey="A" />
      <LogoLetters letterKey="D" />
      <LogoLetters letterKey="O2" />
      <LogoLetters letterKey="U" />
      <LogoLetters letterKey="T" />
    </div>
  );
}
