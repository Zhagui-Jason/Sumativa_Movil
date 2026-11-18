import { Drawer } from "expo-router/drawer";
import { SmartReviewDrawer } from "@/components/SmartReviewDrawer";
import { useTheme } from "@/hooks/useTheme";

export default function DrawerLayout() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const backgroundColor = isDark ? "#020617" : "#F8FAFC";
  const foregroundColor = isDark ? "#F8FAFC" : "#17243A";

  return (
    <Drawer
      drawerContent={(props) => <SmartReviewDrawer {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: isDark ? "#0F172A" : "#FFFFFF" },
        headerTintColor: foregroundColor,
        headerTitleStyle: { fontWeight: "800" },
        sceneStyle: { backgroundColor },
        drawerStyle: { backgroundColor: isDark ? "#0F172A" : "#FFFFFF" },
        drawerActiveTintColor: isDark ? "#C7D2FE" : "#555BCC",
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{ title: "SmartReview", drawerLabel: "Inicio" }}
      />
      <Drawer.Screen
        name="settings"
        options={{ title: "Ajustes", drawerLabel: "Ajustes" }}
      />
    </Drawer>
  );
}
