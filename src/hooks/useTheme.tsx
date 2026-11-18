import AsyncStorage from "@react-native-async-storage/async-storage";
import { colorScheme, useColorScheme } from "nativewind";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

export type ThemeMode = "system" | "light" | "dark";

type ThemeContextValue = {
  mode: ThemeMode;
  colorScheme: "light" | "dark" | undefined;
  isLoading: boolean;
  error: string | null;
  setMode: (mode: ThemeMode) => Promise<void>;
};

const THEME_STORAGE_KEY = "@smartreview/theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "system" || value === "light" || value === "dark";
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const { colorScheme: activeColorScheme } = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTheme() {
      try {
        const storedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        const nextMode = isThemeMode(storedMode) ? storedMode : "system";
        colorScheme.set(nextMode);
        if (isMounted) setModeState(nextMode);
      } catch (loadError) {
        if (isMounted) {
          setError(
            `No se pudo cargar la preferencia de tema. ${
              loadError instanceof Error
                ? loadError.message
                : "Se usará el tema del dispositivo."
            }`,
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadTheme();
    return () => {
      isMounted = false;
    };
  }, []);

  async function setMode(nextMode: ThemeMode) {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode);
      colorScheme.set(nextMode);
      setModeState(nextMode);
      setError(null);
    } catch (saveError) {
      setError(
        `No se pudo guardar el tema. ${
          saveError instanceof Error ? saveError.message : "Inténtalo de nuevo."
        }`,
      );
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        mode,
        colorScheme: activeColorScheme,
        isLoading,
        error,
        setMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe usarse dentro de ThemeProvider.");
  }
  return context;
}
