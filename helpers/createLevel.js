import Matter from "matter-js";
import { Dimensions } from "react-native";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export default function createLevel() {
  const ball = Matter.Bodies.circle(WIDTH / 2, 100, 20, {
    friction: 0.1,
    frictionAir: 0.01,
    restitution: 0.5,
    mass: 1,
    inertia: Infinity,
    inverseInertia: 0,
  });

  const ground = Matter.Bodies.rectangle(WIDTH / 2, HEIGHT + 2000, WIDTH, 40, {
    isStatic: true,
    friction: 0.06,
  });

  const platforms = [
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT / 2.5, 150, 20, {
      isStatic: true,
    }),
    Matter.Bodies.rectangle(WIDTH / 3, HEIGHT + 100, 120, 20, {
      isStatic: true,
    }),
    Matter.Bodies.rectangle(WIDTH * 0.75, HEIGHT + 250, 160, 20, {
      isStatic: true,
    }),
    Matter.Bodies.rectangle(WIDTH / 2 - 90, HEIGHT + 600, 200, 25, {
      isStatic: true,
      angle: Math.PI / 6,
    }),

    Matter.Bodies.rectangle(WIDTH / 2 + 90, HEIGHT + 800, 200, 25, {
      isStatic: true,
      angle: -Math.PI / 6,
    }),
  ];

  return { ball, ground, platforms };
}
