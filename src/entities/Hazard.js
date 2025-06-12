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
        backgroundColor: "#FF6B00",
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#FF3300",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: width * 0.3,
          height: height * 0.3,
          backgroundColor: "#FFD700",
          borderRadius: 999,
          opacity: 0.85,
        }}
      />
    </View>
  );
}
