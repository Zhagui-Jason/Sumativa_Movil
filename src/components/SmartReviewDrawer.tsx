import {
  DrawerContentScrollView,
  type DrawerContentComponentProps,
} from "expo-router/drawer";
import { router, usePathname } from "expo-router";
import { MenuItem } from "@/components/MenuItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export function SmartReviewDrawer({
  navigation,
  ...props
}: DrawerContentComponentProps) {
  const pathname = usePathname();
  const isSettings = pathname === "/settings";

  return (
    <DrawerContentScrollView {...props}>
      <ThemedView className="px-5 pb-6 pt-5">
        <ThemedView className="mb-7 flex-row items-center">
          <ThemedView className="h-11 w-11 items-center justify-center rounded-2xl bg-brand-600">
            <ThemedText
              variant="inverse"
              className="text-xl font-extrabold"
            >
              S
            </ThemedText>
          </ThemedView>
          <ThemedView className="ml-3">
            <ThemedText className="text-base font-extrabold">
              SmartReview
            </ThemedText>
            <ThemedText variant="muted" className="mt-0.5 text-xs">
              Aprende a tu ritmo
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedText
          variant="muted"
          className="mb-2 px-4 text-[10px] font-extrabold uppercase tracking-[1.5px]"
        >
          BIBLIOTECA
        </ThemedText>
        <MenuItem
          active={!isSettings}
          icon="⌂"
          label="Inicio y estudio"
          onPress={() => navigation.navigate("(tabs)")}
        />

        <ThemedText
          variant="muted"
          className="mb-2 mt-6 px-4 text-[10px] font-extrabold uppercase tracking-[1.5px]"
        >
          PREFERENCIAS
        </ThemedText>
        <MenuItem
          active={isSettings}
          icon="⚙"
          label="Ajustes y tema"
          onPress={() => router.navigate("/settings")}
        />
      </ThemedView>
    </DrawerContentScrollView>
  );
}
