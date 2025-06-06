import { Image, StyleSheet, Dimensions } from "react-native";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export default function Background({ scrollY, scrollX }) {
  const repeats = 10;

  return (
    <>
      {Array.from({ length: repeats }).map((_, i) => (
        <Image
          key={i}
          source={require("../assets/background.jpg")}
          style={[
            styles.image,
            {
              top: i * HEIGHT + scrollY,
              left: scrollX,
            },
          ]}
          resizeMode="cover"
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    position: "absolute",
    width: WIDTH,
    height: HEIGHT,
    zIndex: -1,
  },
});
