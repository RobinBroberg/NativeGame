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
        backgroundColor: "#ff4c4c",
        borderWidth: 2,
        borderColor: "#600000",
        shadowColor: "#ff0000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 8,
        elevation: 10,
        transform: [{ rotate: `${body.angle}rad` }],
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: diameter * 0.5,
          height: diameter * 0.5,
          borderRadius: (diameter * 0.5) / 2,
          backgroundColor: "#800000",
        }}
      />
    </View>
  );
}
