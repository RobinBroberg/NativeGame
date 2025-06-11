import { memo } from "react";
import { View } from "react-native";

const Wall = memo(function Wall({ body, size, cameraY }) {
  const width = size[0];
  const height = size[1];
  const yOffset = cameraY?.current ?? 0;

  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2 + yOffset;

  return (
    <View
      style={{
        position: "absolute",
        width,
        height,
        backgroundColor: "#8B0000",
        borderWidth: 1,
        borderColor: "#600000",
        transform: [
          { translateX: x },
          { translateY: y },
          { rotate: `${body.angle}rad` },
        ],
      }}
    />
  );
});

export default Wall;
