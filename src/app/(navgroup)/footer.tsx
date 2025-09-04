import { useEffect, useState } from "react";

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return (
    <footer className="flex flex-col justify-center text-center items-center p-4 text-white">
      <p className="text-2xl">© {year ?? ""} Delta. All rights reserved.</p>
      <p className="text-2xl">Find me on Github!</p>
      <a
        className="nes-icon github is-large"
        href="https://github.com/deltathecreatorr"
      ></a>
    </footer>
  );
}
