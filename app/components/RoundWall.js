import { View } from "react-native";

export default function RoundWall({ body, size, cameraY }) {
  const diameter = size[0];
  const yOffset = cameraY?.current ?? 0;

  const x = body.position.x - diameter / 2;
  const y = body.position.y - diameter / 2 + yOffset;

  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: diameter,
        height: diameter,
        backgroundColor: "#8B0000",
        borderWidth: 1,
        borderColor: "#600000",
        borderRadius: diameter / 2,
        transform: [{ rotate: `${body.angle}rad` }],
      }}
    />
  );
}
