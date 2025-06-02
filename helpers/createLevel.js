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

  // const ground = Matter.Bodies.rectangle(WIDTH / 2, 20000, WIDTH * 2, 60, {
  //   isStatic: true,
  //   friction: 0.06,
  // });

  const platforms = [];

  const startingPlatform = Matter.Bodies.rectangle(
    WIDTH / 2,
    HEIGHT / 3.5,
    150,
    20,
    {
      isStatic: true,
      angle: 0,
      friction: 0.6,
    }
  );
  platforms.push(startingPlatform);

  const count = 20;
  const spacing = 200;

  for (let i = 0; i < count; i++) {
    const y = HEIGHT / 2 + i * spacing;
    const width = 120 + Math.random() * 80;
    const x = 50 + Math.random() * (WIDTH - 100);
    const angle =
      i % 2 === 0 ? (Math.random() > 0.5 ? Math.PI / 5 : -Math.PI / 5) : 0;

    const platform = Matter.Bodies.rectangle(x, y, width, 20, {
      isStatic: true,
      friction: 0.6,
      angle,
    });

    platforms.push(platform);
  }

  return { ball, platforms };
}
