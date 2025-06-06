import React from "react";
import { View } from "react-native";

export default function Platform({ body, size, cameraY }) {
  const width = size[0];
  const height = size[1];
  const yOffset = cameraY?.current ?? 0;

  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2 + yOffset;

  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        backgroundColor: "brown",
        borderRadius: 5,
        transform: [{ rotate: `${body.angle}rad` }],
      }}
    />
  );
}
