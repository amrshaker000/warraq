import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );
  // Default to light mode if not set
  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      setDark(false);
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded shadow w-full"
      onClick={() => setDark((d) => !d)}
    >
      {dark ? "🌙 الوضع الليلي" : "☀️ الوضع النهاري"}
    </button>
  );
}
