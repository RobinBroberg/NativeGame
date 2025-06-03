import Matter from "matter-js";
import { Dimensions } from "react-native";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export default function createLevel() {
  const platforms = [
    Matter.Bodies.rectangle(WIDTH / 2.5, HEIGHT - 900, 250, 20, {
      isStatic: true,
      friction: 0.6,
    }),
    Matter.Bodies.rectangle(WIDTH / 3, HEIGHT - 680, 200, 20, {
      isStatic: true,
      friction: 0.6,
    }),
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT - 450, 220, 20, {
      isStatic: true,
      angle: Math.PI / 6,
      friction: 0.6,
    }),
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT - 250, 250, 20, {
      isStatic: true,
      friction: 0.6,
    }),

    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT, 225, 20, {
      isStatic: true,
      friction: 0.6,
    }),
    Matter.Bodies.rectangle(WIDTH / 3, HEIGHT + 100, 200, 20, {
      isStatic: true,
      friction: 0.6,
    }),
    Matter.Bodies.rectangle(WIDTH * 0.75, HEIGHT + 300, 180, 20, {
      isStatic: true,
      friction: 0.6,
    }),

    // Angled pair
    Matter.Bodies.rectangle(WIDTH / 2 - 90, HEIGHT + 550, 250, 20, {
      isStatic: true,
      angle: Math.PI / 6,
      friction: 0.6,
    }),
    Matter.Bodies.rectangle(WIDTH / 2 + 90, HEIGHT + 800, 250, 20, {
      isStatic: true,
      angle: -Math.PI / 6,
      friction: 0.6,
    }),

    // Flat catch
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT + 1000, 200, 20, {
      isStatic: true,
      friction: 0.6,
    }),

    // Slight angle to roll toward center
    Matter.Bodies.rectangle(WIDTH / 4, HEIGHT + 1200, 200, 20, {
      isStatic: true,
      angle: Math.PI / 18,
      friction: 0.6,
    }),
    Matter.Bodies.rectangle(WIDTH * 0.75, HEIGHT + 1350, 200, 20, {
      isStatic: true,
      angle: -Math.PI / 18,
      friction: 0.6,
    }),

    // Long flat landing
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT + 1600, 250, 20, {
      isStatic: true,
      friction: 0.6,
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
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT + 2200, 500, 20, {
      isStatic: true,
      friction: 1.0,
    }),
  ];

  const lowestPlatform = platforms.reduce((lowest, current) => {
    return current.position.y > lowest.position.y ? current : lowest;
  }, platforms[0]);

  // Position ball slightly above the lowest platform
  const ball = Matter.Bodies.circle(
    lowestPlatform.position.x,
    lowestPlatform.position.y - 30, // adjust distance above platform
    20,
    {
      friction: 0.05,
      frictionAir: 0.01,
      restitution: 0.3,
      mass: 1,
      inertia: Infinity,
      inverseInertia: 0,
    }
  );

  return { ball, platforms };
}
