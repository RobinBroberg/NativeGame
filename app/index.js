import { StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import "react-native-reanimated";
import GameButton from "./components/GameButton";

export default function Home() {
  const router = useRouter();

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
    marginBottom: 10,
    resizeMode: "contain",
  },
});
