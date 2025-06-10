import { Image } from "react-native";

export default function Ball({ body, radius }) {
  const x = body.position.x - radius;
  const y = body.position.y - radius;
  const angle = body.angle;

  return (
    <Image
      source={require("../../assets/football.png")}
      style={{
        position: "absolute",
        width: radius * 2,
        height: radius * 2,
        borderRadius: radius,
        resizeMode: "contain",
        transform: [
          { translateX: x },
          { translateY: y },
          { rotate: `${angle}rad` },
        ],
      }}
    />
  );
}
