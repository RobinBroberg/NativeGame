import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";

export default function Hazard({ body, size, cameraY }) {
  const [width, height] = size;
  const yOffset = cameraY?.current ?? 0;
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2 + yOffset;

  // Animation values
  const glowIntensity = useSharedValue(0);
  const bubbleOffset1 = useSharedValue(0);
  const bubbleOffset2 = useSharedValue(0);
  const bubbleOffset3 = useSharedValue(0);

  useEffect(() => {
    // Pulsing glow effect
    glowIntensity.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );

    // Bubbling effect with different timings
    bubbleOffset1.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 800 }),
        withTiming(5, { duration: 800 })
      ),
      -1,
      true
    );

    bubbleOffset2.value = withRepeat(
      withSequence(
        withTiming(3, { duration: 1200 }),
        withTiming(-3, { duration: 1200 })
      ),
      -1,
      true
    );

    bubbleOffset3.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: 600 }),
        withTiming(4, { duration: 600 })
      ),
      -1,
      true
    );
  }, []);

  // Animated styles
  const glowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(glowIntensity.value, [0, 1], [0.6, 1]);
    const scale = interpolate(glowIntensity.value, [0, 1], [1, 1.05]);
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const bubble1Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: bubbleOffset1.value },
      { translateY: bubbleOffset1.value * 0.5 },
    ],
  }));

  const bubble2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: bubbleOffset2.value },
      { translateY: bubbleOffset2.value * -0.3 },
    ],
  }));

  const bubble3Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: bubbleOffset3.value },
      { translateY: bubbleOffset3.value * 0.8 },
    ],
  }));

  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
      }}
    >
      {/* Base lava */}
      <Animated.View
        style={[
          {
            width: "100%",
            height: "100%",
            backgroundColor: "#B22222", // Darker, more dangerous red
            borderRadius: 4,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "#FF0000",
          },
          glowStyle,
        ]}
      >
        {/* Gradient effect layers */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "40%",
            backgroundColor: "#FF6347", // Lighter top
            opacity: 0.8,
          }}
        />

        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "30%",
            backgroundColor: "#DC143C", // Darker bottom
            opacity: 0.6,
          }}
        />

        {/* Animated bubbles */}
        <Animated.View
          style={[
            {
              position: "absolute",
              width: 8,
              height: 8,
              backgroundColor: "#FFD700",
              borderRadius: 4,
              top: "20%",
              left: "15%",
              opacity: 0.8,
            },
            bubble1Style,
          ]}
        />

        <Animated.View
          style={[
            {
              position: "absolute",
              width: 6,
              height: 6,
              backgroundColor: "#FFA500",
              borderRadius: 3,
              top: "60%",
              left: "70%",
              opacity: 0.9,
            },
            bubble2Style,
          ]}
        />

        <Animated.View
          style={[
            {
              position: "absolute",
              width: 4,
              height: 4,
              backgroundColor: "#FFFF00",
              borderRadius: 2,
              top: "40%",
              left: "45%",
              opacity: 0.7,
            },
            bubble3Style,
          ]}
        />

        {/* Bright hot spots - more visible */}
        <View
          style={{
            position: "absolute",
            width: 16,
            height: 6,
            backgroundColor: "#FFFFFF",
            borderRadius: 3,
            top: "20%",
            left: "55%",
            opacity: 0.9,
            shadowColor: "#FF0000",
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 4,
            shadowOpacity: 1,
          }}
        />

        <View
          style={{
            position: "absolute",
            width: 12,
            height: 4,
            backgroundColor: "#FFFF00",
            borderRadius: 2,
            top: "65%",
            left: "20%",
            opacity: 1,
            shadowColor: "#FF4500",
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 3,
            shadowOpacity: 0.8,
          }}
        />

        <View
          style={{
            position: "absolute",
            width: 8,
            height: 8,
            backgroundColor: "#FF0000",
            borderRadius: 4,
            top: "40%",
            left: "75%",
            opacity: 1,
          }}
        />
      </Animated.View>

      {/* Outer glow effect - much more intense */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: width + 8,
            height: height + 8,
            left: -4,
            top: -4,
            backgroundColor: "#FF0000",
            borderRadius: 8,
            opacity: 0.6,
            zIndex: -1,
          },
          glowStyle,
        ]}
      />

      {/* Additional outer glow layer */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: width + 16,
            height: height + 16,
            left: -8,
            top: -8,
            backgroundColor: "#FF4500",
            borderRadius: 12,
            opacity: 0.3,
            zIndex: -2,
          },
          glowStyle,
        ]}
      />
    </View>
  );
}
