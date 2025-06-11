import { Modal, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import GameButton from "./GameButton";

export default function MenuModal({ menuVisible, handleRestart, resumeGame }) {
  const router = useRouter();

  return (
    <Modal visible={menuVisible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Game Menu</Text>

          <GameButton
            title="Resume Game"
            icon="play-circle-outline"
            onPress={resumeGame}
            width={250}
          />
          <GameButton
            title="Restart Level"
            icon="refresh-outline"
            onPress={handleRestart}
            width={250}
          />
          <GameButton
            title="Main Menu"
            icon="arrow-back"
            onPress={() => router.replace("/")}
            color="#ff6b6b"
            borderColor="#ff6b6b"
            width={250}
          />
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
    fontSize: 32,
    fontWeight: "800",
    color: "#ffc107",
    marginBottom: 30,
    textShadowColor: "#ff9800",
    textShadowRadius: 4,
    textAlign: "center",
    letterSpacing: 1,
  },
});
