import { View, Image } from "react-native";

export default function GoalPlatform({ body, size, cameraY }) {
  const width = size[0];
  const height = size[1];
  const yOffset = cameraY?.current ?? 0;

  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2 + yOffset;

  return (
    // <View
    //   style={{
    //     position: "absolute",
    //     left: x,
    //     top: y,
    //     width,
    //     height,
    //     backgroundColor: "gold", // fallback if no image
    //     borderRadius: 6,
    //     borderWidth: 2,
    //     borderColor: "#ffaa00",
    //   }}
    // >
    <Image
      source={require("../../assets/soccer-goal.png")}
      style={{
        position: "absolute",
        left: x - width, // center image over platform
        top: y - height * 5, // shift up a bit for better placement
        width: width * 3, // scale wider
        height: height * 7, // scale taller
        resizeMode: "contain",
        transform: [{ rotate: `${body.angle}rad` }],
      }}
    />
    // </View>
  );
}
