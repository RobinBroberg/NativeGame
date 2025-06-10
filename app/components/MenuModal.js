import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function MenuModal({ menuVisible, handleRestart, resumeGame }) {
  const router = useRouter();

  return (
    <Modal visible={menuVisible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Game Menu</Text>

          <TouchableOpacity style={styles.menuButton} onPress={resumeGame}>
            <Ionicons name="play-circle-outline" size={24} color="#4ecdc4" />
            <Text style={styles.menuButtonText}>Resume Game</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={handleRestart}>
            <Ionicons name="refresh-outline" size={24} color="#4ecdc4" />
            <Text style={styles.menuButtonText}>Restart Level</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuButton, styles.exitButton]}
            onPress={() => router.replace("/")}
          >
            <Ionicons name="home-outline" size={24} color="#ff6b6b" />
            <Text style={[styles.menuButtonText, styles.exitText]}>
              Main Menu
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    backgroundColor: "#1e1e1e",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  menuTitle: {
    fontSize: 28,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 30,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#4ecdc4",
  },
  exitButton: {
    backgroundColor: "#3a1f1f",
    borderColor: "#ff6b6b",
  },
  menuButtonText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "600",
    marginLeft: 12,
  },
  exitText: {
    color: "#ff6b6b",
  },
});
