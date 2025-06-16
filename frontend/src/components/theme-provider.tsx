import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "@/api/axios";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Fetch initial theme from database
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axiosInstance.get("/user/theme", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const isDarkMode = response.data.themeMode;
        setThemeState(isDarkMode ? "dark" : "light");
      } catch (error) {
        console.error("Failed to fetch theme:", error);
      } finally {
        setMounted(true);
      }
    };

    fetchTheme();
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme, mounted]);

  const setTheme = async (newTheme: Theme) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Update theme in database
      await axiosInstance.post("/user/theme", 
        { themeMode: newTheme === "dark" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setThemeState(newTheme);
    } catch (error) {
      console.error("Failed to update theme:", error);
    }
  };

  const value = {
    theme,
    setTheme,
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
}; 