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
        backgroundColor: "#ffc107",
        borderWidth: 2,
        borderColor: "#ff9800",
        elevation: 6,

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
