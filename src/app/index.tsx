import { ProgressCard } from "@/components/ProgressCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getTodayDateKey } from "@/hooks/subjectStore";
import { useSubjects } from "@/hooks/useSubjects";
import { router } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

export default function HomeScreen() {
  const { subjects, isLoading, loadError } = useSubjects();
  const topicCount = subjects.reduce(
    (total, subject) => total + subject.topics.length,
    0,
  );
  const cards = subjects.flatMap((subject) =>
    subject.topics.flatMap((topic) => topic.cards),
  );
  const today = getTodayDateKey();
  const dueCardCount = cards.filter(
    (card) => !card.nextReviewDate || card.nextReviewDate <= today,
  ).length;

  return (
    <ThemedView variant="canvas" className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pb-8 pt-6">
          <View className="flex-row items-center justify-between">
            <ThemedText
              variant="plain"
              className="text-[10px] font-extrabold uppercase tracking-[2px] text-brand-600 dark:text-brand-200"
            >
              TU ESPACIO DE ESTUDIO
            </ThemedText>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/settings")}
              className="px-2 py-2"
            >
              <ThemedText
                variant="plain"
                className="text-xs font-bold text-brand-600 dark:text-brand-200"
              >
                Ajustes
              </ThemedText>
            </Pressable>
          </View>

          <ThemedText className="mt-2 text-4xl font-extrabold leading-[42px] tracking-tight">
            Aprende a tu{"\n"}propio ritmo.
          </ThemedText>
          <ThemedText variant="muted" className="mt-2 text-sm leading-5">
            Organiza tus materias y ten cada tema a mano.
          </ThemedText>

          {loadError ? (
            <ThemedView
              variant="transparent"
              className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950"
            >
              <ThemedText
                variant="plain"
                accessibilityRole="alert"
                className="text-sm text-red-700 dark:text-red-200"
              >
                {loadError}
              </ThemedText>
            </ThemedView>
          ) : (
            <View className="mt-6 flex-row gap-3">
              <ProgressCard
                detail="En tu biblioteca"
                label="Materias"
                value={isLoading ? "..." : subjects.length}
              />
              <ProgressCard
                detail="Listos para estudiar"
                label="Temas"
                value={isLoading ? "..." : topicCount}
              />
            </View>
          )}

          <ThemedView
            variant="transparent"
            className="mt-6 overflow-hidden rounded-3xl bg-slate-900 p-5 dark:bg-indigo-950"
          >
            <ThemedText
              variant="plain"
              className="text-[10px] font-bold uppercase tracking-[1.5px] text-indigo-200"
            >
              UN PASO A LA VEZ
            </ThemedText>
            <ThemedText
              variant="inverse"
              className="mt-2 text-2xl font-extrabold"
            >
              Tu próximo repaso empieza aquí.
            </ThemedText>
            <ThemedText
              variant="plain"
              className="mt-2 text-sm leading-5 text-slate-300"
            >
              {cards.length} tarjetas guardadas · {dueCardCount} listas para
              repasar hoy.
            </ThemedText>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/subjects")}
              className="mt-5 min-h-12 flex-row items-center justify-center rounded-2xl bg-brand-500 px-4 active:opacity-80"
            >
              <ThemedText variant="inverse" className="text-sm font-bold">
                Ver mis materias
              </ThemedText>
              <ThemedText
                variant="inverse"
                className="ml-2 text-base font-bold"
              >
                →
              </ThemedText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/reviews")}
              className="mt-3 min-h-11 items-center justify-center rounded-2xl border border-slate-600 px-4 active:opacity-80"
            >
              <ThemedText variant="inverse" className="text-sm font-bold">
                Ver próximos repasos
              </ThemedText>
            </Pressable>
          </ThemedView>

          <View className="mb-3 mt-8 flex-row items-end justify-between">
            <View>
              <ThemedText className="text-xl font-extrabold">
                Tu biblioteca
              </ThemedText>
              <ThemedText variant="muted" className="mt-1 text-xs">
                {isLoading
                  ? "Cargando..."
                  : `${subjects.length} materias guardadas`}
              </ThemedText>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/subjects")}
              className="px-1 py-2"
            >
              <ThemedText
                variant="plain"
                className="text-xs font-bold text-brand-600 dark:text-brand-200"
              >
                Ver todo
              </ThemedText>
            </Pressable>
          </View>

          {subjects.slice(0, 3).map((subject) => (
            <ThemedView
              key={subject.id}
              variant="surface"
              className="mb-2 flex-row items-center rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"
            >
              <ThemedView
                variant="transparent"
                className="h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-slate-800"
              >
                <ThemedText
                  variant="plain"
                  className="font-bold text-brand-600 dark:text-brand-200"
                >
                  {subject.name.charAt(0).toUpperCase()}
                </ThemedText>
              </ThemedView>
              <View className="ml-3 flex-1">
                <ThemedText numberOfLines={1} className="text-sm font-bold">
                  {subject.name}
                </ThemedText>
                <ThemedText variant="muted" className="mt-1 text-xs">
                  {subject.topics.length} temas
                </ThemedText>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Abrir ${subject.name}`}
                onPress={() =>
                  router.push({
                    pathname: "/subjects",
                    params: { subjectId: subject.id },
                  })
                }
                className="min-h-10 min-w-10 items-center justify-center"
              >
                <ThemedText
                  variant="plain"
                  className="text-lg text-slate-400"
                >
                  ›
                </ThemedText>
              </Pressable>
            </ThemedView>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
