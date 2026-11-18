import { Tabs } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";

export default function TabLayout() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? "#C7D2FE" : "#555BCC",
        tabBarInactiveTintColor: isDark ? "#94A3B8" : "#7C8798",
        tabBarStyle: {
          backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
          borderTopColor: isDark ? "#1E293B" : "#E2E8F0",
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => (
            <ThemedText style={{ color, fontSize: 19, lineHeight: 23 }}>
              ⌂
            </ThemedText>
          ),
        }}
      />
      <Tabs.Screen
        name="subjects"
        options={{
          title: "Materias",
          tabBarIcon: ({ color }) => (
            <ThemedText style={{ color, fontSize: 17, lineHeight: 23 }}>
              ▦
            </ThemedText>
          ),
        }}
      />
      <Tabs.Screen
        name="reviews"
        options={{
          title: "Repasos",
          tabBarIcon: ({ color }) => (
            <ThemedText style={{ color, fontSize: 19, lineHeight: 23 }}>
              ↻
            </ThemedText>
          ),
        }}
      />
    </Tabs>
  );
}
