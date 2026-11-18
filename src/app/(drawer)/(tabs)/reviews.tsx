import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSubjects } from "@/hooks/useSubjects";

export default function ReviewsScreen() {
  const { subjects, isLoading } = useSubjects();
  const topicCount = subjects.reduce(
    (total, subject) => total + subject.topics.length,
    0,
  );

  return (
    <ThemedView variant="canvas" className="flex-1">
      <ScrollView className="flex-1">
        <View className="px-5 pb-8 pt-5">
        <ThemedText className="text-2xl font-extrabold">
          Próximos repasos
        </ThemedText>
        <ThemedText variant="muted" className="mt-1 text-sm">
          Aquí encontrarás tus temas programados.
        </ThemedText>

        <ThemedView variant="surface" className="mt-6 items-center rounded-3xl border border-slate-200 px-6 py-8 dark:border-slate-800">
          <ThemedView variant="transparent" className="h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 dark:bg-slate-800">
            <ThemedText variant="plain" className="text-2xl font-bold text-brand-600 dark:text-brand-200">
              ↻
            </ThemedText>
          </ThemedView>
          <ThemedText className="mt-4 text-lg font-extrabold">
            Tus repasos empiezan con una materia
          </ThemedText>
          <ThemedText variant="muted" className="mt-2 text-center text-sm leading-5">
            {isLoading
              ? "Cargando tus temas..."
              : `${subjects.length} materias y ${topicCount} temas guardados. La programación de fechas se añadirá junto con las tarjetas y la evaluación del recuerdo.`}
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/subjects")}
            className="mt-5 min-h-11 justify-center rounded-xl bg-brand-600 px-4 active:opacity-80"
          >
            <ThemedText variant="inverse" className="text-sm font-bold">
              Ir a mis materias
            </ThemedText>
          </Pressable>
        </ThemedView>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
