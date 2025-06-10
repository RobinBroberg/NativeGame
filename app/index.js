import { Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import "react-native-reanimated";

export default function Home() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#4682b4", "#5ca0d3", "#87cefa", "#aee2ff"]}
      style={styles.container}
    >
      <Image source={require("../assets/tiltball3.png")} style={styles.logo} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/Game")}
      >
        <Text style={styles.buttonText}>Start Game</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 5,
  },
  buttonText: {
    fontSize: 20,
    color: "#4682b4",
    fontWeight: "600",
  },
});
