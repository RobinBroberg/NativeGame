import { View } from "react-native";

export default function SpinningPlatform({ body, size, cameraY }) {
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
        backgroundColor: "#4444AA",
        borderWidth: 1,
        borderColor: "#222288",
        transform: [{ rotate: `${body.angle}rad` }],
      }}
    />
  );
}
