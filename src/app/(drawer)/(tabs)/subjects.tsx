import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { EntryModal } from "@/components/EntryModal";
import { SubjectCard } from "@/components/SubjectCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSubjects } from "@/hooks/useSubjects";

type ModalState =
  | { type: "subject" }
  | { type: "topic"; subjectId: string; subjectName: string }
  | null;

export default function SubjectsScreen() {
  const { subjects, isLoading, loadError, addSubject, addTopic } =
    useSubjects();
  const [modal, setModal] = useState<ModalState>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const topicCount = subjects.reduce(
    (total, subject) => total + subject.topics.length,
    0,
  );

  function openSubjectModal() {
    setActionError(null);
    setModal({ type: "subject" });
  }

  function openTopicModal(subjectId: string) {
    const subject = subjects.find((item) => item.id === subjectId);
    if (!subject) {
      setActionError("No se encontró la materia seleccionada.");
      return;
    }

    setActionError(null);
    setModal({ type: "topic", subjectId, subjectName: subject.name });
  }

  async function saveEntry(value: string) {
    if (!modal) return;

    setIsSaving(true);
    setActionError(null);
    try {
      if (modal.type === "subject") {
        await addSubject(value);
      } else {
        await addTopic(modal.subjectId, value);
      }
      setModal(null);
    } catch (error) {
      setActionError(
        `No se pudo guardar. ${
          error instanceof Error ? error.message : "Inténtalo de nuevo."
        }`,
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ThemedView variant="canvas" className="flex-1">
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pb-8 pt-5">
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <ThemedText className="text-2xl font-extrabold">
              Mis materias
            </ThemedText>
            <ThemedText variant="muted" className="mt-1 text-xs">
              {subjects.length} materias · {topicCount} temas
            </ThemedText>
          </View>
          <Pressable
            accessibilityRole="button"
            disabled={isLoading || Boolean(loadError)}
            onPress={openSubjectModal}
            className={`min-h-10 flex-row items-center justify-center rounded-xl bg-brand-600 px-3 active:opacity-80 ${
              isLoading || loadError ? "opacity-50" : ""
            }`}
          >
            <ThemedText variant="inverse" className="mr-1 text-lg font-medium">
              +
            </ThemedText>
            <ThemedText variant="inverse" className="text-xs font-bold">
              Nueva
            </ThemedText>
          </Pressable>
        </View>

        {isLoading ? (
          <ThemedView variant="surface" className="min-h-32 items-center justify-center rounded-2xl">
            <ActivityIndicator color="#555BCC" />
            <ThemedText variant="muted" className="mt-3 text-xs">
              Cargando tus materias...
            </ThemedText>
          </ThemedView>
        ) : loadError ? (
          <ThemedView variant="transparent" className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
            <ThemedText variant="plain" className="font-bold text-red-700 dark:text-red-200">
              No se pudo abrir tu biblioteca
            </ThemedText>
            <ThemedText
              variant="plain"
              accessibilityRole="alert"
              className="mt-2 text-sm leading-5 text-red-700 dark:text-red-200"
            >
              {loadError}
            </ThemedText>
          </ThemedView>
        ) : subjects.length === 0 ? (
          <ThemedView variant="surface" className="items-center rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
            <ThemedText className="text-base font-bold">
              Empieza por una materia
            </ThemedText>
            <ThemedText variant="muted" className="mt-2 text-center text-sm leading-5">
              Agrega una materia y luego organiza sus temas de estudio.
            </ThemedText>
            <Pressable
              accessibilityRole="button"
              onPress={openSubjectModal}
              className="mt-4 rounded-xl bg-brand-600 px-4 py-3"
            >
              <ThemedText variant="inverse" className="text-sm font-bold">
                Agregar materia
              </ThemedText>
            </Pressable>
          </ThemedView>
        ) : (
          subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              onAddTopic={openTopicModal}
              subject={subject}
            />
          ))
        )}
        </View>
      </ScrollView>

      {modal !== null && (
        <EntryModal
          description={
            modal.type === "topic"
              ? `El tema se agregará a ${modal.subjectName}.`
              : "Agrupa tus temas para encontrarlos y repasarlos fácilmente."
          }
          error={actionError}
          isSaving={isSaving}
          onClose={() => {
            if (isSaving) return;
            setModal(null);
            setActionError(null);
          }}
          onSubmit={saveEntry}
          placeholder={
            modal.type === "topic"
              ? "Ej. Ecuaciones lineales"
              : "Ej. Matemáticas"
          }
          submitLabel={
            modal.type === "topic" ? "Guardar tema" : "Guardar materia"
          }
          title={modal.type === "topic" ? "Nuevo tema" : "Nueva materia"}
          visible
        />
      )}
    </ThemedView>
  );
}
