// ThemeProvider.tsx
import React, { createContext, useState, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { theme } from "../shared/theme";

export const ThemeContext = createContext({
  dark: false,
  toggleTheme: () => { },
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [dark, setDark] = useState(true);

  const toggleTheme = () => {
    setDark(!dark);
  }

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      <StyledThemeProvider theme={dark ? theme.dark : theme.light}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};