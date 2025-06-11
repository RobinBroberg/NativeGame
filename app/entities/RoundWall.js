import { memo } from "react";
import { View } from "react-native";

const RoundWall = memo(function RoundWall({ body, size, cameraY }) {
  const diameter = size[0];
  const yOffset = cameraY?.current ?? 0;

  const x = body.position.x - diameter / 2;
  const y = body.position.y - diameter / 2 + yOffset;

  return (
    <View
      style={{
        position: "absolute",
        width: diameter,
        height: diameter,
        borderRadius: diameter / 2,
        backgroundColor: "#b22222",
        borderWidth: 4,
        borderColor: "#d4af37",
        transform: [
          { translateX: x },
          { translateY: y },
          { rotate: `${body.angle}rad` },
        ],
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
});

export default RoundWall;
