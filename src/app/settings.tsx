import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme, type ThemeMode } from "@/hooks/useTheme";
import { Pressable, ScrollView, View } from "react-native";

const themeOptions: { mode: ThemeMode; title: string; detail: string }[] = [
  {
    mode: "system",
    title: "Del dispositivo",
    detail: "Seguir el tema de Android",
  },
  { mode: "light", title: "Claro", detail: "Usar siempre el tema claro" },
  { mode: "dark", title: "Oscuro", detail: "Usar siempre el tema oscuro" },
];

export default function SettingsScreen() {
  const { mode, isLoading, error, setMode } = useTheme();

  return (
    <ThemedView variant="canvas" className="flex-1">
      <ScrollView className="flex-1">
        <View className="px-5 pb-8 pt-5">
          <ThemedText className="text-2xl font-extrabold">Ajustes</ThemedText>
          <ThemedText variant="muted" className="mt-1 text-sm">
            Personaliza SmartReview.
          </ThemedText>

          <ThemedView
            variant="surface"
            className="mt-6 rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
          >
            <ThemedText className="text-base font-bold">Apariencia</ThemedText>
            <ThemedText
              variant="muted"
              className="mb-3 mt-1 text-xs leading-5"
            >
              Elige cómo se muestran los colores de la aplicación.
            </ThemedText>
            {themeOptions.map((option) => {
              const selected = mode === option.mode;
              return (
                <Pressable
                  key={option.mode}
                  accessibilityRole="radio"
                  accessibilityState={{ selected, disabled: isLoading }}
                  disabled={isLoading}
                  onPress={() => void setMode(option.mode)}
                  className={`mb-2 min-h-16 flex-row items-center rounded-xl border px-3 py-2 ${
                    selected
                      ? "border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-slate-800"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <View
                    className={`mr-3 h-5 w-5 items-center justify-center rounded-full border ${
                      selected
                        ? "border-brand-600 bg-brand-600"
                        : "border-slate-400 dark:border-slate-500"
                    }`}
                  >
                    {selected && (
                      <View className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </View>
                  <View className="flex-1">
                    <ThemedText className="text-sm font-bold">
                      {option.title}
                    </ThemedText>
                    <ThemedText variant="muted" className="mt-1 text-xs">
                      {option.detail}
                    </ThemedText>
                  </View>
                </Pressable>
              );
            })}
            {error && (
              <ThemedText
                variant="plain"
                accessibilityRole="alert"
                className="mt-2 text-sm text-red-600 dark:text-red-400"
              >
                {error}
              </ThemedText>
            )}
          </ThemedView>

          <ThemedView
            variant="surface"
            className="mt-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
          >
            <ThemedText className="text-base font-bold">
              SmartReview
            </ThemedText>
            <ThemedText variant="muted" className="mt-1 text-sm">
              Tus materias y temas se almacenan en este dispositivo.
            </ThemedText>
          </ThemedView>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
