import { useState } from "react";
import { Pressable, View } from "react-native";
import type { Subject } from "@/hooks/useSubjects";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

type SubjectCardProps = {
  subject: Subject;
  onAddTopic: (subjectId: string) => void;
};

const colors = [
  {
    tile: "bg-indigo-100 dark:bg-indigo-950",
    text: "text-indigo-600 dark:text-indigo-300",
  },
  {
    tile: "bg-emerald-100 dark:bg-emerald-950",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  {
    tile: "bg-amber-100 dark:bg-amber-950",
    text: "text-amber-700 dark:text-amber-300",
  },
  {
    tile: "bg-rose-100 dark:bg-rose-950",
    text: "text-rose-700 dark:text-rose-300",
  },
];

export function SubjectCard({ subject, onAddTopic }: SubjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const color = colors[subject.name.length % colors.length];

  return (
    <ThemedView
      variant="surface"
      className="mb-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800"
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => setExpanded(!expanded)}
        className="min-h-20 flex-row items-center px-4 py-3 active:opacity-80"
      >
        <View
          className={`h-12 w-12 items-center justify-center rounded-2xl ${color.tile}`}
        >
          <ThemedText
            variant="plain"
            className={`text-lg font-extrabold ${color.text}`}
          >
            {subject.name.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
        <View className="ml-3 flex-1">
          <ThemedText numberOfLines={1} className="text-sm font-bold">
            {subject.name}
          </ThemedText>
          <ThemedText variant="muted" className="mt-1 text-xs">
            {subject.topics.length}{" "}
            {subject.topics.length === 1 ? "tema" : "temas"}
          </ThemedText>
        </View>
        <ThemedText
          variant="plain"
          className="w-8 text-right text-2xl font-medium text-brand-600 dark:text-brand-200"
        >
          {expanded ? "−" : "+"}
        </ThemedText>
      </Pressable>

      {expanded && (
        <View className="mx-4 border-t border-slate-100 pb-3 pt-2 dark:border-slate-800">
          {subject.topics.length === 0 ? (
            <ThemedText variant="muted" className="py-4 text-sm">
              Aún no hay temas en esta materia.
            </ThemedText>
          ) : (
            subject.topics.map((topic, index) => (
              <View
                key={topic.id}
                className="min-h-11 flex-row items-center border-b border-slate-100 dark:border-slate-800"
              >
                <View className="w-8 items-center rounded-lg bg-brand-50 py-1.5 dark:bg-slate-800">
                  <ThemedText
                    variant="plain"
                    className="text-[10px] font-extrabold text-brand-600 dark:text-brand-200"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </ThemedText>
                </View>
                <ThemedText
                  variant="plain"
                  className="ml-3 flex-1 text-[13px] text-slate-600 dark:text-slate-300"
                >
                  {topic.name}
                </ThemedText>
              </View>
            ))
          )}
          <Pressable
            accessibilityRole="button"
            onPress={() => onAddTopic(subject.id)}
            className="min-h-11 flex-row items-center px-1 active:opacity-70"
          >
            <ThemedText
              variant="plain"
              className="text-xl font-semibold text-brand-600 dark:text-brand-200"
            >
              +
            </ThemedText>
            <ThemedText
              variant="plain"
              className="ml-2 text-[13px] font-bold text-brand-600 dark:text-brand-200"
            >
              Agregar tema
            </ThemedText>
          </Pressable>
        </View>
      )}
    </ThemedView>
  );
}
