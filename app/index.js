import { StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import "react-native-reanimated";
import GameButton from "../src/components/GameButton";
import { useEffect, useState } from "react";
import { getHighscore, clearHighscores } from "../src/utils/highscoreManager";

export default function Home() {
  const router = useRouter();
  const [highscores, setHighscores] = useState({});

  useEffect(() => {
    async function loadScores() {
      const levels = [1, 2];
      const scores = {};
      for (const level of levels) {
        const score = await getHighscore(level);
        scores[level] = score;
      }
      setHighscores(scores);
    }

    loadScores();
  }, []);

  const handleClearHighscores = async () => {
    await clearHighscores();
    setHighscores({});
  };

  return (
    <LinearGradient
      colors={["#4682b6", "#5ca0d3", "#87cefa", "#aee2ff"]}
      style={styles.container}
    >
      <Image source={require("../assets/tiltball3.png")} style={styles.logo} />

      <GameButton title="Start Game" onPress={() => router.push("/Game")} />
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
    width: 700,
    height: undefined,
    aspectRatio: 3,
    resizeMode: "contain",
  },
});
