import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

type ProgressCardProps = {
  label: string;
  value: number | string;
  detail: string;
};

export function ProgressCard({ label, value, detail }: ProgressCardProps) {
  return (
    <ThemedView
      variant="surface"
      className="min-w-0 flex-1 rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
    >
      <ThemedText
        variant="plain"
        className="text-2xl font-extrabold tracking-tight text-brand-600 dark:text-brand-100"
      >
        {value}
      </ThemedText>
      <ThemedText
        variant="muted"
        className="mt-1 text-[10px] font-bold uppercase tracking-widest"
      >
        {label}
      </ThemedText>
      <ThemedText variant="muted" className="mt-2 text-xs leading-4">
        {detail}
      </ThemedText>
    </ThemedView>
  );
}
