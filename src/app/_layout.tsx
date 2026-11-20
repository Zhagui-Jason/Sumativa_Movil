import { SubjectsProvider } from "@/hooks/useSubjects";
import { ThemeProvider, useTheme } from "@/hooks/useTheme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../components/global.css";

function AppNavigator() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const backgroundColor = isDark ? "#020617" : "#F8FAFC";
  const foregroundColor = isDark ? "#F8FAFC" : "#17243A";

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: isDark ? "#0F172A" : "#FFFFFF" },
          headerTintColor: foregroundColor,
          headerTitleStyle: { fontWeight: "800" },
          contentStyle: { backgroundColor },
        }}
      >
        <Stack.Screen name="index" options={{ title: "SmartReview" }} />
        <Stack.Screen name="subjects" options={{ title: "Materias" }} />
        <Stack.Screen name="reviews" options={{ title: "Repasos" }} />
        <Stack.Screen name="settings" options={{ title: "Ajustes" }} />
        <Stack.Screen name="topic" options={{ title: "Tarjetas" }} />
      </Stack>
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
