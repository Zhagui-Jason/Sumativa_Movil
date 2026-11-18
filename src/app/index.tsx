import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { EntryModal } from "@/components/EntryModal";
import { SubjectCard } from "@/components/SubjectCard";
import { useSubjects } from "@/hooks/useSubjects";

type ModalState =
  | { type: "subject" }
  | { type: "topic"; subjectId: string; subjectName: string }
  | null;

export default function Index() {
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
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View style={styles.brand}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>S</Text>
            </View>
            <Text style={styles.brandName}>SmartReview</Text>
          </View>
          <View style={styles.offlineBadge}>
            <View style={styles.offlineDot} />
            <Text style={styles.offlineText}>SIN CONEXIÓN</Text>
          </View>
        </View>

        <View style={styles.intro}>
          <Text style={styles.greeting}>TU ESPACIO DE ESTUDIO</Text>
          <Text style={styles.heading}>Aprende a tu{"\n"}propio ritmo.</Text>
          <Text style={styles.subtitle}>
            Organiza tus materias y ten cada tema a mano.
          </Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{subjects.length}</Text>
            <Text style={styles.statLabel}>MATERIAS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{topicCount}</Text>
            <Text style={styles.statLabel}>TEMAS</Text>
          </View>
          <View style={styles.statHint}>
            <Text style={styles.statHintText}>Listos para repasar</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Mis materias</Text>
            <Text style={styles.sectionSubtitle}>
              Toca una para ver sus temas
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            disabled={isLoading || Boolean(loadError)}
            onPress={openSubjectModal}
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.pressed,
              (isLoading || Boolean(loadError)) && styles.disabled,
            ]}
          >
            <Text style={styles.addButtonPlus}>+</Text>
            <Text style={styles.addButtonText}>Nueva</Text>
          </Pressable>
        </View>

        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator color="#5B61D6" size="small" />
            <Text style={styles.loadingText}>Cargando tus materias...</Text>
          </View>
        ) : loadError ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>No se pudo abrir tu biblioteca</Text>
            <Text accessibilityRole="alert" style={styles.errorText}>
              {loadError}
            </Text>
          </View>
        ) : subjects.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Empieza por una materia</Text>
            <Text style={styles.emptyText}>
              Agrega una materia y luego organiza sus temas de estudio.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={openSubjectModal}
              style={styles.emptyButton}
            >
              <Text style={styles.emptyButtonText}>Agregar materia</Text>
            </Pressable>
          </View>
        ) : (
          subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              onAddTopic={openTopicModal}
              subject={subject}
            />
          ))
        )}

        <View style={styles.footer}>
          <View style={styles.footerLine} />
          <Text style={styles.footerText}>Tu progreso se guarda en este dispositivo</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 28,
  },
  topBar: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandMark: {
    width: 31,
    height: 31,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#5B61D6",
  },
  brandMarkText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
  brandName: {
    marginLeft: 9,
    color: "#1C2940",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  offlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D8EDE5",
    borderRadius: 20,
    backgroundColor: "#F0FAF5",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  offlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#46A47C",
  },
  offlineText: {
    marginLeft: 6,
    color: "#398663",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  intro: {
    marginTop: 32,
  },
  greeting: {
    color: "#6A70D5",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.7,
  },
  heading: {
    marginTop: 8,
    color: "#17243A",
    fontSize: 35,
    fontWeight: "800",
    letterSpacing: -1.2,
    lineHeight: 40,
  },
  subtitle: {
    marginTop: 9,
    color: "#727C8B",
    fontSize: 14,
    lineHeight: 21,
  },
  statsCard: {
    minHeight: 89,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 30,
    borderRadius: 18,
    backgroundColor: "#202C47",
    paddingHorizontal: 19,
  },
  stat: {
    minWidth: 60,
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: -0.7,
  },
  statLabel: {
    marginTop: 2,
    color: "#B7C0D2",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.1,
  },
  statDivider: {
    width: 1,
    height: 38,
    marginHorizontal: 11,
    backgroundColor: "#48536B",
  },
  statHint: {
    flex: 1,
    alignItems: "flex-end",
  },
  statHintText: {
    color: "#D2D7E3",
    fontSize: 11,
    textAlign: "right",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#1C2940",
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  sectionSubtitle: {
    marginTop: 4,
    color: "#87909D",
    fontSize: 12,
  },
  addButton: {
    minHeight: 39,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#5B61D6",
    paddingHorizontal: 12,
  },
  addButtonPlus: {
    marginRight: 5,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  emptyCard: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E9ECF3",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    padding: 24,
  },
  emptyTitle: {
    color: "#1C2940",
    fontSize: 16,
    fontWeight: "700",
  },
  emptyText: {
    marginTop: 7,
    color: "#7A8492",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  emptyButton: {
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: "#5B61D6",
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  loading: {
    minHeight: 130,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 10,
    color: "#7A8492",
    fontSize: 13,
  },
  errorCard: {
    borderWidth: 1,
    borderColor: "#F2D5D5",
    borderRadius: 18,
    backgroundColor: "#FFF7F7",
    padding: 18,
  },
  errorTitle: {
    color: "#9E3333",
    fontSize: 14,
    fontWeight: "700",
  },
  errorText: {
    marginTop: 7,
    color: "#A34848",
    fontSize: 13,
    lineHeight: 19,
  },
  footer: {
    alignItems: "center",
    marginTop: 18,
    paddingTop: 12,
  },
  footerLine: {
    width: 29,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#D8DBEA",
    marginBottom: 9,
  },
  footerText: {
    color: "#939BA7",
    fontSize: 10,
  },
  pressed: {
    opacity: 0.76,
  },
  disabled: {
    opacity: 0.45,
  },
});
