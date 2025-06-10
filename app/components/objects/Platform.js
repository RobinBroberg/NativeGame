import { memo } from "react";
import { Image } from "react-native";

const Platform = memo(function Platform({ body, size, cameraY }) {
  const width = size[0];
  const height = size[1];
  const yOffset = cameraY?.current ?? 0;
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2 + yOffset;

  return (
    <Image
      source={require("../../../assets/bricks-1.webp")}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        transform: [{ rotate: `${body.angle}rad` }],
        resizeMode: "repeat",
      }}
    />
  );
});

export default Platform;
