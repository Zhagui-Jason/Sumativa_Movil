import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  TextInput,
  View,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";

type EntryModalProps = {
  visible: boolean;
  title: string;
  description: string;
  placeholder: string;
  submitLabel: string;
  error: string | null;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (value: string) => Promise<void>;
};

export function EntryModal({
  visible,
  title,
  description,
  placeholder,
  submitLabel,
  error,
  isSaving,
  onClose,
  onSubmit,
}: EntryModalProps) {
  const [value, setValue] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  async function submit() {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      setValidationError("Escribe un nombre antes de guardar.");
      return;
    }

    setValidationError(null);
    await onSubmit(trimmedValue);
  }

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {
        if (!isSaving) onClose();
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-center px-5"
      >
        <Pressable
          disabled={isSaving}
          onPress={onClose}
          className="absolute inset-0 bg-slate-950/50"
        />
        <View className="overflow-hidden rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
          <View className="absolute left-0 right-0 top-0 h-1.5 bg-brand-500" />
          <ThemedText
            variant="plain"
            className="mb-2 mt-1 text-[10px] font-extrabold tracking-[2px] text-brand-600"
          >
            SMARTREVIEW
          </ThemedText>
          <ThemedText className="text-2xl font-extrabold">{title}</ThemedText>
          <ThemedText variant="muted" className="mb-5 mt-2 text-sm leading-5">
            {description}
          </ThemedText>
          <TextInput
            autoFocus
            maxLength={60}
            onChangeText={(text) => {
              setValue(text);
              setValidationError(null);
            }}
            onSubmitEditing={() => void submit()}
            placeholder={placeholder}
            placeholderTextColor="#8B929B"
            returnKeyType="done"
            value={value}
            className="h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[15px] text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          {(validationError || error) && (
            <ThemedText
              variant="plain"
              accessibilityRole="alert"
              className="mt-2 text-xs text-red-600 dark:text-red-400"
            >
              {validationError || error}
            </ThemedText>
          )}
          <View className="mt-6 flex-row justify-end gap-2">
            <Pressable
              accessibilityRole="button"
              disabled={isSaving}
              onPress={onClose}
              className="min-h-12 justify-center px-4 active:opacity-70"
            >
              <ThemedText
                variant="plain"
                className="text-sm font-bold text-slate-500 dark:text-slate-300"
              >
                Cancelar
              </ThemedText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={isSaving}
              onPress={() => void submit()}
              className={`min-h-12 justify-center rounded-2xl bg-brand-600 px-5 active:opacity-75 ${
                isSaving ? "opacity-50" : ""
              }`}
            >
              <ThemedText variant="inverse" className="text-sm font-bold">
                {isSaving ? "Guardando..." : submitLabel}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
