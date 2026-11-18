import { Text, type TextProps } from "react-native";

type ThemedTextProps = TextProps & {
  className?: string;
  variant?: "primary" | "muted" | "inverse" | "plain";
};

export function ThemedText({
  className = "",
  variant = "primary",
  ...props
}: ThemedTextProps) {
  const variantClassName = {
    primary: "text-slate-900 dark:text-slate-100",
    muted: "text-slate-500 dark:text-slate-400",
    inverse: "text-white",
    plain: "",
  }[variant];

  return (
    <Text {...props} className={`${variantClassName} ${className}`} />
  );
}
