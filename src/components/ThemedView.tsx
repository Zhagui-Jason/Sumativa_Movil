import { View, type ViewProps } from "react-native";

type ThemedViewProps = ViewProps & {
  className?: string;
  variant?: "canvas" | "surface" | "transparent";
};

export function ThemedView({
  className = "",
  variant = "transparent",
  ...props
}: ThemedViewProps) {
  const variantClassName = {
    canvas: "bg-slate-50 dark:bg-slate-950",
    surface: "bg-white dark:bg-slate-900",
    transparent: "",
  }[variant];

  return (
    <View {...props} className={`${variantClassName} ${className}`} />
  );
}
