import { View } from "react-native";

export default function Hazard({ body, size, cameraY }) {
  const [width, height] = size;
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
        backgroundColor: "red",
        borderWidth: 1,
        borderColor: "#800",
      }}
    />
  );
}
