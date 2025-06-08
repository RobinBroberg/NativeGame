// helpers/createLevel2.js
import Matter from "matter-js";
import { Dimensions } from "react-native";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export default function createLevel2() {
  // Ball
  const ball = Matter.Bodies.circle(WIDTH / 2, HEIGHT - 100, 20, {
    friction: 0.05,
    frictionAir: 0.01,
    restitution: 0.4,
    mass: 1,
    inertia: Infinity,
    inverseInertia: 0,
  });

  // Regular platforms
  const platforms = [
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT - 300, 220, 20, {
      isStatic: true,
      friction: 0.6,
      label: "platform",
    }),
  ];

  // Spinning platform (rotated constantly in Physics)
  const spinningPlatforms = [
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT - 600, 150, 20, {
      isStatic: true,
      friction: 0.6,
      label: "spinning-platform",
    }),
  ];

  // Hazard (like a red block that ends the game)
  const hazards = [
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT - 900, 100, 20, {
      isStatic: true,
      isSensor: true,
      label: "hazard",
    }),
  ];

  const goalPlatform = Matter.Bodies.rectangle(
    WIDTH / 2,
    HEIGHT - 1200,
    70,
    10,
    {
      isStatic: true,
      isSensor: true,
      label: "goal",
    }
  );

  return {
    ball,
    platforms,
    spinningPlatforms,
    hazards,
    goalPlatform,
    walls: [],
    roundWall: null,
    lowestPlatformY: HEIGHT - 100,
  };
}
