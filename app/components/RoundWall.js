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
        borderRadius: diameter / 2,
        backgroundColor: "#b22222",
        borderWidth: 4,
        borderColor: "#ff4d4d",
        shadowColor: "#ff0000",
        shadowOffset: { width: 0, height: 2 },
        elevation: 10,
        transform: [{ rotate: `${body.angle}rad` }],
        justifyContent: "center",
        alignItems: "center",
      }}
    ></View>
  );
}
