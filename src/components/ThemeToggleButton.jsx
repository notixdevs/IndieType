import React from "react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "Dark" ? "Light" : "Dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 bg-[var(--settingBg)] rounded hover:text-[var(--text-hover)]"
    >
      {theme === "Dark" ? "Dark Mode" : "Light Mode"}
    </button>
  );
};

export default ThemeToggle;