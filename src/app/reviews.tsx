import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { formatReviewDate, getTodayDateKey } from "@/hooks/subjectStore";
import { useSubjects } from "@/hooks/useSubjects";
import { router } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

export default function ReviewsScreen() {
  const { subjects, isLoading, loadError } = useSubjects();
  const today = getTodayDateKey();
  const reviews = subjects
    .flatMap((subject) =>
      subject.topics.flatMap((topic) =>
        topic.cards.map((card) => ({
          subjectId: subject.id,
          subjectName: subject.name,
          topicId: topic.id,
          topicName: topic.name,
          card,
        })),
      ),
    )
    .sort((first, second) =>
      (first.card.nextReviewDate ?? today).localeCompare(
        second.card.nextReviewDate ?? today,
      ),
    );
  const dueCount = reviews.filter(
    ({ card }) => !card.nextReviewDate || card.nextReviewDate <= today,
  ).length;

  return (
    <ThemedView variant="canvas" className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pb-8 pt-5">
          <ThemedText className="text-2xl font-extrabold">
            Próximos repasos
          </ThemedText>
          <ThemedText variant="muted" className="mt-1 text-sm">
            {isLoading
              ? "Cargando tarjetas..."
              : `${dueCount} para hoy · ${reviews.length} tarjetas en total`}
          </ThemedText>

          {loadError ? (
            <ThemedView
              variant="transparent"
              className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950"
            >
              <ThemedText
                accessibilityRole="alert"
                className="text-sm text-red-700 dark:text-red-200"
              >
                {loadError}
              </ThemedText>
            </ThemedView>
          ) : isLoading ? null : reviews.length === 0 ? (
            <ThemedView
              variant="surface"
              className="mt-5 rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
            >
              <ThemedText className="text-base font-bold">
                Todavía no hay tarjetas
              </ThemedText>
              <ThemedText variant="muted" className="mt-2 text-sm leading-5">
                Entra a una materia, abre un tema y agrega preguntas y
                respuestas. Aquí aparecerán sus fechas de repaso.
              </ThemedText>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push("/subjects")}
                className="mt-4 min-h-11 justify-center rounded-xl bg-brand-600 px-4"
              >
                <ThemedText
                  variant="inverse"
                  className="text-center text-sm font-bold"
                >
                  Ir a mis materias
                </ThemedText>
              </Pressable>
            </ThemedView>
          ) : (
            reviews.map(({ subjectId, subjectName, topicId, topicName, card }) => {
              const date = card.nextReviewDate;
              const dateLabel = !date
                ? "Pendiente de evaluación"
                : date <= today
                  ? date === today
                    ? "Repasar hoy"
                    : `Vencida · ${formatReviewDate(date)}`
                  : `Próximo repaso · ${formatReviewDate(date)}`;

              return (
                <Pressable
                  key={card.id}
                  accessibilityRole="button"
                  onPress={() =>
                    router.push({
                      pathname: "/topic",
                      params: { subjectId, topicId },
                    })
                  }
                  className="mt-3 active:opacity-80"
                >
                  <ThemedView
                    variant="surface"
                    className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
                  >
                    <ThemedText
                      variant="muted"
                      className="text-[10px] font-bold uppercase tracking-wider"
                    >
                      {subjectName} · {topicName}
                    </ThemedText>
                    <ThemedText className="mt-2 text-sm font-bold leading-5">
                      {card.question}
                    </ThemedText>
                    <ThemedText
                      variant="plain"
                      className="mt-3 text-xs font-bold text-brand-600 dark:text-brand-200"
                    >
                      {dateLabel} · Abrir tarjeta
                    </ThemedText>
                  </ThemedView>
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
