import { Text, TouchableOpacity, ActivityIndicator } from "react-native";

interface ButtonProps {
  title?: string;
  variant?: "primary" | "secondary" | "icon";
  children: React.ReactNode;
  onPress: () => void;
  isLoading?: boolean;
}

export const Button = ({
  title,
  variant = "primary",
  children,
  onPress,
  isLoading = false,
}: ButtonProps) => {
  if (variant === "icon") {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          padding: 10,
          backgroundColor: "white",
          borderRadius: 100,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5, // For Android shadow
        }}
      >
        {children}
      </TouchableOpacity>
    );
  }

  const buttonStyles = {
    primary: {
      backgroundColor: "#1a1a1a",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 25,
      alignItems: "center" as const,
    },
    secondary: {
      backgroundColor: "#ffffff",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: "#808080",
      alignItems: "center" as const,
    },
  };

  const textStyles = {
    primary: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "600" as const,
    },
    secondary: {
      color: "#1a1a1a",
      fontSize: 16,
      fontWeight: "600" as const,
    },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[buttonStyles[variant], isLoading && { opacity: 0.7 }]}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "primary" ? "#ffffff" : "#1a1a1a"}
          size="small"
        />
      ) : (
        <Text style={textStyles[variant]}>{title || children}</Text>
      )}
    </TouchableOpacity>
  );
};
