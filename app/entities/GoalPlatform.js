import { memo } from "react";
import { Image } from "react-native";

const GoalPlatform = memo(function GoalPlatform({ body, size, cameraY }) {
  const width = size[0];
  const height = size[1];
  const yOffset = cameraY?.current ?? 0;

  const baseX = body.position.x - width / 2;
  const baseY = body.position.y - height / 2 + yOffset;

  const imageWidth = width * 3;
  const imageHeight = height * 7;

  const translateX = baseX - width;
  const translateY = baseY - height * 5 - 15;

  return (
    <Image
      source={require("../../assets/soccer-goal.png")}
      style={{
        position: "absolute",
        width: imageWidth,
        height: imageHeight,
        resizeMode: "contain",
        transform: [
          { translateX },
          { translateY },
          { rotate: `${body.angle}rad` },
        ],
      }}
    />
  );
});

export default GoalPlatform;
