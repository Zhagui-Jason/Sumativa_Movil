import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SubjectsProvider } from "@/hooks/useSubjects";
import { ThemeProvider, useTheme } from "@/hooks/useTheme";

function AppNavigator() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: isDark ? "#020617" : "#F8FAFC" },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SubjectsProvider>
        <AppNavigator />
      </SubjectsProvider>
    </ThemeProvider>
  );
}
