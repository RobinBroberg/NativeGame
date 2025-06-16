import { Modal, View, Text, StyleSheet } from "react-native";
import GameButton from "./GameButton";

export default function InfoModal({ visible, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Welcome to TiltBall</Text>
          <Text style={styles.modalText}>
            • Tilt your phone to roll the ball left/right.
          </Text>
          <Text style={styles.modalText}>
            • Tap the screen to jump — you can double jump!
          </Text>
          <Text style={styles.modalText}>
            • Avoid hazards and reach the goal.
          </Text>

          <GameButton
            title="Got it!"
            icon="checkmark-circle-outline"
            onPress={onClose}
            width={250}
            marginVertical={20}
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
  modalContainer: {
    backgroundColor: "#1e1e1e",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffc107",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 1,
    textShadowColor: "#ff9800",
    textShadowRadius: 4,
  },
  modalText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
    lineHeight: 22,
  },
});
