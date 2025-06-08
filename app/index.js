import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import "react-native-reanimated";

export default function Home() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to the Tilt Game!</Text>
      <Button title="Start Game" onPress={() => router.push("/Game")} />
    </View>
  );
}
