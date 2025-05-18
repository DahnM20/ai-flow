// ThemeProvider.tsx
import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  CSSProperties,
} from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { theme } from "../components/shared/theme";
import useLocalStorage from "../hooks/useLocalStorage";

interface ThemeContextType {
  dark: boolean;
  toggleTheme: () => void;
  getStyle: () => any;
}

export const ThemeContext = createContext<ThemeContextType>({
  dark: false,
  toggleTheme: () => {},
  getStyle: () => ({}), // return an empty style object as a default
});
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [dark, setDark] = useLocalStorage("darkMode", true);

  useEffect(() => {
    // Toggle the "dark" class on <html> for Tailwind
    document.documentElement.classList.toggle("dark", dark);

    // Update Mantine's color schema attribute on <html>
    document.documentElement.setAttribute(
      "data-mantine-color-scheme",
      dark ? "dark" : "light",
    );
  }, [dark]);

  const toggleTheme = () => {
    setDark(!dark);
  };

  const getStyle = () => {
    return dark ? theme.dark : theme.light;
  };

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme, getStyle }}>
      <StyledThemeProvider theme={dark ? theme.dark : theme.light}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
