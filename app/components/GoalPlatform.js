import { Image } from "react-native";

export default function GoalPlatform({ body, size, cameraY }) {
  const width = size[0];
  const height = size[1];

  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2 - 20;

  return (
    <Image
      source={require("../../assets/soccer-goal.png")}
      style={{
        position: "absolute",
        left: x - width,
        top: y - height * 5,
        width: width * 3,
        height: height * 7,
        resizeMode: "contain",
        transform: [{ rotate: `${body.angle}rad` }],
      }}
    />
  );
}
