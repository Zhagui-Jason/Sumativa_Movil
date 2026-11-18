import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Subject } from "@/hooks/useSubjects";

type SubjectCardProps = {
  subject: Subject;
  onAddTopic: (subjectId: string) => void;
};

const colors = [
  { background: "#EEF0FF", foreground: "#555BCC" },
  { background: "#E8F7F1", foreground: "#228A68" },
  { background: "#FFF2E5", foreground: "#C17A2E" },
  { background: "#FCECF0", foreground: "#BA5A78" },
];

export function SubjectCard({ subject, onAddTopic }: SubjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const color = colors[subject.name.length % colors.length];

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => setExpanded(!expanded)}
        style={({ pressed }) => [styles.header, pressed && styles.pressed]}
      >
        <View style={[styles.subjectIcon, { backgroundColor: color.background }]}>
          <Text style={[styles.subjectInitial, { color: color.foreground }]}>
            {subject.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.subjectInfo}>
          <Text numberOfLines={1} style={styles.subjectName}>
            {subject.name}
          </Text>
          <Text style={styles.topicCount}>
            {subject.topics.length}{" "}
            {subject.topics.length === 1 ? "tema" : "temas"}
          </Text>
        </View>
        <Text style={styles.chevron}>{expanded ? "−" : "+"}</Text>
      </Pressable>

      {expanded && (
        <View style={styles.topicSection}>
          {subject.topics.length === 0 ? (
            <Text style={styles.emptyTopics}>
              Aún no hay temas en esta materia.
            </Text>
          ) : (
            subject.topics.map((topic, index) => (
              <View key={topic.id} style={styles.topicRow}>
                <View style={styles.topicNumber}>
                  <Text style={styles.topicNumberText}>
                    {String(index + 1).padStart(2, "0")}
                  </Text>
                </View>
                <Text style={styles.topicName}>{topic.name}</Text>
              </View>
            ))
          )}
          <Pressable
            accessibilityRole="button"
            onPress={() => onAddTopic(subject.id)}
            style={({ pressed }) => [
              styles.addTopicButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.addTopicPlus}>+</Text>
            <Text style={styles.addTopicText}>Agregar tema</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E9ECF3",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },
  header: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  subjectIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  subjectInitial: {
    fontSize: 19,
    fontWeight: "800",
  },
  subjectInfo: {
    flex: 1,
    marginLeft: 13,
  },
  subjectName: {
    color: "#1C2940",
    fontSize: 15,
    fontWeight: "700",
  },
  topicCount: {
    marginTop: 4,
    color: "#87909D",
    fontSize: 12,
  },
  chevron: {
    width: 30,
    color: "#7279D5",
    fontSize: 23,
    fontWeight: "500",
    textAlign: "right",
  },
  topicSection: {
    marginHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#EDF0F5",
    paddingTop: 8,
    paddingBottom: 12,
  },
  topicRow: {
    minHeight: 43,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F2F4F7",
  },
  topicNumber: {
    width: 31,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#F2F3FF",
  },
  topicNumberText: {
    color: "#666CD0",
    fontSize: 10,
    fontWeight: "800",
  },
  topicName: {
    flex: 1,
    marginLeft: 11,
    color: "#495365",
    fontSize: 13,
  },
  emptyTopics: {
    paddingVertical: 15,
    color: "#87909D",
    fontSize: 13,
  },
  addTopicButton: {
    minHeight: 43,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 5,
  },
  addTopicPlus: {
    color: "#5B61D6",
    fontSize: 21,
    fontWeight: "600",
  },
  addTopicText: {
    marginLeft: 9,
    color: "#5B61D6",
    fontSize: 13,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.75,
  },
});
