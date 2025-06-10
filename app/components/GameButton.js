import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GameButton({
  title,
  onPress,
  icon,
  width,
  color = "#ffc107", // darker default
  textColor = "#4b2e00",
  borderColor = "#ff9800",
  justifyContent = "flex-start",
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: color,
          borderColor: borderColor ?? color,
          shadowColor: color,
          width: width,
          justifyContent: justifyContent,
        },
      ]}
      activeOpacity={0.85}
    >
      {icon && (
        <Ionicons name={icon} size={24} color={textColor} style={styles.icon} />
      )}
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "start",
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginVertical: 10,
    borderWidth: 2,

    borderRadius: 16,
    shadowColor: "#ff9800",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  icon: {
    marginRight: 12,
  },
});
