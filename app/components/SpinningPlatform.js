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
        backgroundColor: "#b22222",
        borderWidth: 2,
        borderColor: "#ff4d4d",
        borderRadius: 6,
        elevation: 10,
        transform: [{ rotate: `${body.angle}rad` }],
      }}
    />
  );
}
