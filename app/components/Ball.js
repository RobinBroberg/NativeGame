import { Image, View } from "react-native";

export default function Ball({ body, radius }) {
  const x = body.position.x - radius;
  const y = body.position.y - radius;
  const angle = body.angle;

  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y + 2,
        width: radius * 2,
        height: radius * 2,
        transform: [{ rotate: `${angle}rad` }],
      }}
    >
      <Image
        source={require("../../assets/football.png")}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: radius,
        }}
        resizeMode="contain"
      />
    </View>
  );
}
