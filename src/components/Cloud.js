import { Image } from "react-native";

export default function Cloud({ position }) {
  return (
    <Image
      source={require("../../assets/cloud3.webp")}
      style={{
        position: "absolute",
        width: 120,
        height: 120,
        left: position.x - 30,
        top: position.y - 30,
        opacity: 1,
        zIndex: 1,
      }}
    />
  );
}
