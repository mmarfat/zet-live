// React
import { useEffect, useState } from "react";

// shadcn
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

// Icons
import {
  Sun,
  Moon,
} from 'lucide-react';


const ThemeToggle = () => {

  // Theme
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Local states
  const [mounted, setMounted] = useState(false);

  // Effects
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handlers
  const handleThemeCycle = () => {
    if (theme === "system") {
      setTheme(themeCheck(resolvedTheme))
    } else {
      setTheme((prevTheme) => (themeCheck(prevTheme)));
    }
  };

  // Utils
  if (!mounted) {
    return <Button variant="outline" size="icon" className="opacity-0" />;
  }

  const themeCheck = (themeState) => {
    return themeState === "light" ? "dark" : "light";
  }

  const currentTheme = resolvedTheme || "light";

  // Layout
  return (
    <Button
      size="icon"
      onClick={handleThemeCycle}
      className="min-w-12 shadow-xl/20 rounded-sm"
    >
      {currentTheme === "light" ? (
        <Sun />
      ) : (
        <Moon />
      )}
    </Button>
  );
};

export default ThemeToggle;
