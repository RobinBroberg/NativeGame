import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GameButton({
  title,
  onPress,
  icon,
  width,
  fontWeight = "bold",
  fontSize = 20,
  color = "#ffc107",
  textColor = "#4b2e00",
  borderColor = "#ff9800",
  justifyContent = "flex-start",
  marginVertical = 10,
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
          marginVertical: marginVertical,
        },
      ]}
      activeOpacity={0.85}
    >
      {icon && (
        <Ionicons name={icon} size={24} color={textColor} style={styles.icon} />
      )}
      <Text
        style={[
          styles.text,
          { color: textColor, fontSize: fontSize, fontWeight: fontWeight },
        ]}
      >
        {title}
      </Text>
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
