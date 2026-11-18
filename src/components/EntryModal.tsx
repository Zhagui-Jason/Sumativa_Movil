import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

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
        style={styles.overlay}
      >
        <Pressable
          disabled={isSaving}
          style={styles.backdrop}
          onPress={onClose}
        />
        <View style={styles.dialog}>
          <View style={styles.accent} />
          <Text style={styles.eyebrow}>SMARTREVIEW</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
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
            style={styles.input}
            value={value}
          />
          {(validationError || error) && (
            <Text accessibilityRole="alert" style={styles.error}>
              {validationError || error}
            </Text>
          )}
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled={isSaving}
              onPress={onClose}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={isSaving}
              onPress={() => void submit()}
              style={({ pressed }) => [
                styles.submitButton,
                pressed && !isSaving && styles.pressed,
                isSaving && styles.disabled,
              ]}
            >
              <Text style={styles.submitText}>
                {isSaving ? "Guardando..." : submitLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 22,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(19, 31, 46, 0.48)",
  },
  dialog: {
    overflow: "hidden",
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: 24,
    shadowColor: "#152238",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 10,
  },
  accent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: "#5B61D6",
  },
  eyebrow: {
    marginBottom: 8,
    color: "#686DD6",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.8,
  },
  title: {
    color: "#17243A",
    fontSize: 24,
    fontWeight: "800",
  },
  description: {
    marginTop: 7,
    marginBottom: 20,
    color: "#717A88",
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: "#E2E6EF",
    borderRadius: 14,
    backgroundColor: "#FAFBFD",
    paddingHorizontal: 15,
    color: "#17243A",
    fontSize: 15,
  },
  error: {
    marginTop: 9,
    color: "#B93838",
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 22,
  },
  cancelButton: {
    minHeight: 46,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  cancelText: {
    color: "#667085",
    fontSize: 14,
    fontWeight: "700",
  },
  submitButton: {
    minHeight: 46,
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#5B61D6",
    paddingHorizontal: 19,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.76,
  },
  disabled: {
    opacity: 0.55,
  },
});
