import { Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";

type MenuItemProps = {
  label: string;
  icon: string;
  active?: boolean;
  onPress: () => void;
};

export function MenuItem({
  label,
  icon,
  active = false,
  onPress,
}: MenuItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      className={`mb-1 min-h-12 flex-row items-center rounded-xl px-4 ${
        active
          ? "bg-brand-50 dark:bg-slate-800"
          : "active:bg-slate-100 dark:active:bg-slate-800"
      }`}
    >
      <ThemedText
        variant="plain"
        className={`w-8 text-base font-bold ${
          active ? "text-brand-600 dark:text-brand-100" : "text-slate-500"
        }`}
      >
        {icon}
      </ThemedText>
      <ThemedText
        variant="plain"
        className={`text-sm font-semibold ${
          active ? "text-brand-700 dark:text-white" : "text-slate-600 dark:text-slate-300"
        }`}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}
