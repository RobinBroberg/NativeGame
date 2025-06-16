import {
  StyleSheet,
  Image,
  Text,
  Modal,
  View,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import "react-native-reanimated";
import GameButton from "../src/components/GameButton";
import { useEffect, useState } from "react";
import { getHighscore, clearHighscores } from "../src/utils/highscoreManager";
import InfoModal from "../src/components/InfoModal";

export default function Home() {
  const router = useRouter();
  const [highscores, setHighscores] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function loadScores() {
      const levels = [1, 2, 3];
      const scores = {};
      for (const level of levels) {
        const score = await getHighscore(level);
        scores[level] = score;
      }
      setHighscores(scores);
    }

    loadScores();
  }, []);

  async function handleClearHighscores() {
    await clearHighscores();
    setHighscores({});
  }

  return (
    <LinearGradient
      colors={["#4682b6", "#5ca0d3", "#87cefa", "#aee2ff"]}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.infoText}>?</Text>
      </TouchableOpacity>
      <InfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      <Image source={require("../assets/tiltball3.png")} style={styles.logo} />

      <GameButton
        title="Start Game"
        onPress={() => {
          setTimeout(() => {
            router.push("/Game");
          }, 200);
        }}
        marginVertical={0}
      />
      {/* <GameButton title="Clear highscore" onPress={handleClearHighscores} /> */}
      {Object.keys(highscores).length > 0 && (
        <>
          <Text style={styles.header}>Record Times</Text>
          {Object.entries(highscores).map(([level, score]) => (
            <Text key={level} style={styles.scoreText}>
              Level {level}: {score ? `${score.toFixed(1)}s` : "–"}
            </Text>
          ))}
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 750,
    height: undefined,
    aspectRatio: 3,
    resizeMode: "contain",
  },
  header: {
    fontSize: 28,
    marginTop: 40,
    color: "#ffd700",
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  scoreText: {
    fontSize: 22,
    color: "#fff",
    marginTop: 4,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  infoButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#ffd700",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  infoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});
