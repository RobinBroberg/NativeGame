import Matter from "matter-js";
import { Dimensions } from "react-native";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export default function createLevel() {
  const ball = Matter.Bodies.circle(WIDTH / 2, 100, 20, {
    friction: 0.1,
    frictionAir: 0.01,
    restitution: 0.3,
    mass: 1,
    inertia: Infinity,
    inverseInertia: 0,
  });

  // const ground = Matter.Bodies.rectangle(WIDTH / 2, 10000, WIDTH * 2, 60, {
  //   isStatic: true,
  //   friction: 0.06,
  // });

  const platforms = [
    // Starter platforms
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT / 2.5, 150, 20, {
      isStatic: true,
      friction: 0.6,
    }),
    Matter.Bodies.rectangle(WIDTH / 3, HEIGHT + 100, 200, 20, {
      isStatic: true,
      friction: 0.6,
    }),
    Matter.Bodies.rectangle(WIDTH * 0.75, HEIGHT + 250, 180, 20, {
      isStatic: true,
      friction: 0.6,
    }),

    // Angled pair
    Matter.Bodies.rectangle(WIDTH / 2 - 90, HEIGHT + 600, 250, 25, {
      isStatic: true,
      angle: Math.PI / 6,
      friction: 0.8,
    }),
    Matter.Bodies.rectangle(WIDTH / 2 + 90, HEIGHT + 800, 250, 25, {
      isStatic: true,
      angle: -Math.PI / 6,
      friction: 0.8,
    }),

    // Flat catch
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT + 1000, 200, 20, {
      isStatic: true,
      friction: 0.8,
    }),

    // Slight angle to roll toward center
    Matter.Bodies.rectangle(WIDTH / 4, HEIGHT + 1200, 200, 20, {
      isStatic: true,
      angle: Math.PI / 18,
      friction: 0.7,
    }),
    Matter.Bodies.rectangle(WIDTH * 0.75, HEIGHT + 1350, 200, 20, {
      isStatic: true,
      angle: -Math.PI / 18,
      friction: 0.7,
    }),

    // Long flat landing
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT + 1600, 250, 20, {
      isStatic: true,
      friction: 0.8,
    }),

    // Bounce ramp
    Matter.Bodies.rectangle(WIDTH / 2 - 100, HEIGHT + 1850, 250, 20, {
      isStatic: true,
      angle: Math.PI / 10,
      friction: 0.6,
    }),
    Matter.Bodies.rectangle(WIDTH / 2 + 100, HEIGHT + 2000, 300, 20, {
      isStatic: true,
      angle: -Math.PI / 10,
      friction: 0.6,
    }),

    // Final straight catcher
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT + 2200, 500, 25, {
      isStatic: true,
      friction: 1.0,
    }),
  ];

  return { ball, platforms };
}
