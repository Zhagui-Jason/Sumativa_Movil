import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  formatReviewDate,
  type Flashcard,
  type RecallRating,
} from "@/hooks/subjectStore";
import { useSubjects } from "@/hooks/useSubjects";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";

const reviewOptions: { rating: RecallRating; label: string }[] = [
  { rating: "forgot", label: "No lo recordé · hoy" },
  { rating: "partial", label: "Lo recordé parcialmente · 1 día" },
  { rating: "remembered", label: "Lo recordé · 3 días" },
];

export default function TopicScreen() {
  const { subjectId, topicId } = useLocalSearchParams<{
    subjectId?: string | string[];
    topicId?: string | string[];
  }>();
  const resolvedSubjectId =
    typeof subjectId === "string" ? subjectId : subjectId?.[0];
  const resolvedTopicId = typeof topicId === "string" ? topicId : topicId?.[0];
  const {
    subjects,
    isLoading,
    loadError,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    reviewFlashcard,
  } = useSubjects();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [revealedCardIds, setRevealedCardIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subject = subjects.find((item) => item.id === resolvedSubjectId);
  const topic = subject?.topics.find((item) => item.id === resolvedTopicId);

  function resetForm() {
    setQuestion("");
    setAnswer("");
    setEditingCardId(null);
    setError(null);
  }

  async function saveCard() {
    if (!question.trim() || !answer.trim()) {
      setError("Escribe una pregunta y una respuesta.");
      return;
    }

    if (!resolvedSubjectId || !resolvedTopicId) return;

    setIsSaving(true);
    setError(null);
    try {
      if (editingCardId) {
        await updateFlashcard(
          resolvedSubjectId,
          resolvedTopicId,
          editingCardId,
          question,
          answer,
        );
      } else {
        await addFlashcard(
          resolvedSubjectId,
          resolvedTopicId,
          question,
          answer,
        );
      }
      resetForm();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo guardar la tarjeta.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function editCard(card: Flashcard) {
    setEditingCardId(card.id);
    setQuestion(card.question);
    setAnswer(card.answer);
    setError(null);
  }

  async function removeCard(cardId: string) {
    if (!resolvedSubjectId || !resolvedTopicId) return;
    setError(null);
    try {
      await deleteFlashcard(resolvedSubjectId, resolvedTopicId, cardId);
      setRevealedCardIds((current) =>
        current.filter((id) => id !== cardId),
      );
      if (editingCardId === cardId) resetForm();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "No se pudo eliminar la tarjeta.",
      );
    }
  }

  async function rateCard(cardId: string, rating: RecallRating) {
    if (!resolvedSubjectId || !resolvedTopicId) return;
    setError(null);
    try {
      await reviewFlashcard(
        resolvedSubjectId,
        resolvedTopicId,
        cardId,
        rating,
      );
    } catch (reviewError) {
      setError(
        reviewError instanceof Error
          ? reviewError.message
          : "No se pudo programar el repaso.",
      );
    }
  }

  function toggleAnswer(cardId: string) {
    setRevealedCardIds((current) =>
      current.includes(cardId)
        ? current.filter((id) => id !== cardId)
        : [...current, cardId],
    );
  }

  if (isLoading) {
    return (
      <ThemedView variant="canvas" className="flex-1 items-center justify-center">
        <ActivityIndicator color="#555BCC" />
        <ThemedText variant="muted" className="mt-3 text-sm">
          Cargando el tema...
        </ThemedText>
      </ThemedView>
    );
  }

  if (loadError || !topic || !subject) {
    return (
      <ThemedView variant="canvas" className="flex-1 p-5">
        <ThemedText accessibilityRole="alert" className="text-sm text-red-600">
          {loadError ?? "No se encontró el tema solicitado."}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView variant="canvas" className="flex-1">
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pb-8 pt-5">
          <ThemedText variant="muted" className="text-xs">
            {subject.name}
          </ThemedText>
          <ThemedText className="mt-1 text-2xl font-extrabold">
            {topic.name}
          </ThemedText>
          <ThemedText variant="muted" className="mt-1 text-sm">
            {topic.cards.length} tarjetas · crea, edita y repasa sin conexión.
          </ThemedText>

          <ThemedView
            variant="surface"
            className="mt-5 rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
          >
            <ThemedText className="text-base font-bold">
              {editingCardId ? "Editar tarjeta" : "Nueva tarjeta"}
            </ThemedText>
            <TextInput
              maxLength={240}
              multiline
              onChangeText={setQuestion}
              placeholder="Pregunta"
              placeholderTextColor="#8B929B"
              value={question}
              className="mt-3 min-h-14 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <TextInput
              maxLength={1000}
              multiline
              onChangeText={setAnswer}
              placeholder="Respuesta"
              placeholderTextColor="#8B929B"
              value={answer}
              className="mt-2 min-h-20 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            {error && (
              <ThemedText
                variant="plain"
                accessibilityRole="alert"
                className="mt-2 text-sm text-red-600 dark:text-red-400"
              >
                {error}
              </ThemedText>
            )}
            <View className="mt-3 flex-row justify-end gap-2">
              {editingCardId && (
                <Pressable
                  accessibilityRole="button"
                  disabled={isSaving}
                  onPress={resetForm}
                  className="min-h-11 justify-center px-3"
                >
                  <ThemedText variant="muted" className="text-sm font-bold">
                    Cancelar
                  </ThemedText>
                </Pressable>
              )}
              <Pressable
                accessibilityRole="button"
                disabled={isSaving}
                onPress={() => void saveCard()}
                className={`min-h-11 justify-center rounded-xl bg-brand-600 px-4 ${
                  isSaving ? "opacity-50" : ""
                }`}
              >
                <ThemedText variant="inverse" className="text-sm font-bold">
                  {isSaving
                    ? "Guardando..."
                    : editingCardId
                      ? "Guardar cambios"
                      : "Agregar tarjeta"}
                </ThemedText>
              </Pressable>
            </View>
          </ThemedView>

          <ThemedText className="mb-3 mt-7 text-lg font-extrabold">
            Tarjetas del tema
          </ThemedText>
          {topic.cards.length === 0 ? (
            <ThemedView
              variant="surface"
              className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
            >
              <ThemedText variant="muted" className="text-sm leading-5">
                Todavía no hay tarjetas. Agrega preguntas y respuestas arriba;
                puedes crear todas las que necesites para este tema.
              </ThemedText>
            </ThemedView>
          ) : (
            topic.cards.map((card, index) => {
              const isRevealed = revealedCardIds.includes(card.id);
              return (
                <ThemedView
                  key={card.id}
                  variant="surface"
                  className="mb-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
                >
                  <ThemedText
                    variant="muted"
                    className="text-[10px] font-bold uppercase tracking-wider"
                  >
                    Tarjeta {index + 1}
                  </ThemedText>
                  <ThemedText className="mt-2 text-base font-bold leading-6">
                    {card.question}
                  </ThemedText>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ expanded: isRevealed }}
                    onPress={() => toggleAnswer(card.id)}
                    className="mt-3 min-h-10 justify-center"
                  >
                    <ThemedText
                      variant="plain"
                      className="text-sm font-bold text-brand-600 dark:text-brand-200"
                    >
                      {isRevealed ? "Ocultar respuesta" : "Mostrar respuesta"}
                    </ThemedText>
                  </Pressable>
                  {isRevealed && (
                    <ThemedView
                      variant="transparent"
                      className="rounded-xl bg-brand-50 p-3 dark:bg-slate-800"
                    >
                      <ThemedText className="text-sm leading-5">
                        {card.answer}
                      </ThemedText>
                      <ThemedText variant="muted" className="mt-2 text-xs">
                        {card.nextReviewDate
                          ? `Próximo repaso: ${formatReviewDate(card.nextReviewDate)}`
                          : "Aún no evaluada"}
                      </ThemedText>
                    </ThemedView>
                  )}
                  {isRevealed && (
                    <View className="mt-3 gap-2">
                      {reviewOptions.map((option) => (
                        <Pressable
                          key={option.rating}
                          accessibilityRole="button"
                          onPress={() =>
                            void rateCard(card.id, option.rating)
                          }
                          className="min-h-10 justify-center rounded-xl border border-slate-200 px-3 active:opacity-70 dark:border-slate-700"
                        >
                          <ThemedText className="text-xs font-semibold">
                            {option.label}
                          </ThemedText>
                        </Pressable>
                      ))}
                    </View>
                  )}
                  <View className="mt-3 flex-row gap-4">
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => editCard(card)}
                      className="min-h-9 justify-center"
                    >
                      <ThemedText
                        variant="plain"
                        className="text-xs font-bold text-brand-600 dark:text-brand-200"
                      >
                        Editar
                      </ThemedText>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => void removeCard(card.id)}
                      className="min-h-9 justify-center"
                    >
                      <ThemedText
                        variant="plain"
                        className="text-xs font-bold text-red-600 dark:text-red-400"
                      >
                        Eliminar
                      </ThemedText>
                    </Pressable>
                  </View>
                </ThemedView>
              );
            })
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
