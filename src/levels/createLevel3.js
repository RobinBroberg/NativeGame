import Matter from "matter-js";
import { Dimensions } from "react-native";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export default function createLevel3() {
  const platforms = [
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT - 300, 600, 20, {
      isStatic: true,
      friction: 0.6,
      label: "platform",
    }),
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT - 480, 600, 20, {
      isStatic: true,
      friction: 0.6,
      label: "platform",
    }),
  ];

  const roundWalls = [
    Matter.Bodies.circle(WIDTH / 1.3, HEIGHT - 1200, 40, {
      isStatic: true,
      friction: 0.6,
      restitution: 1,
      label: "round-wall",
    }),
    Matter.Bodies.circle(WIDTH - 400, HEIGHT - 1500, 40, {
      isStatic: true,
      friction: 0.6,
      restitution: 1,
      label: "round-wall",
    }),
    Matter.Bodies.circle(WIDTH - 100, HEIGHT - 1750, 40, {
      isStatic: true,
      friction: 0.6,
      restitution: 1,
      label: "round-wall",
    }),
    Matter.Bodies.circle(WIDTH + 145, HEIGHT - 260, 40, {
      isStatic: true,
      friction: 0.6,
      restitution: 1,
      label: "round-wall",
    }),
  ];

  const spinningPlatforms = [
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT - 600, 150, 20, {
      isStatic: true,
      friction: 0,
      label: "spinning-platform",
    }),
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT - 800, 150, 20, {
      isStatic: true,
      friction: 0,
      label: "spinning-platform",
    }),
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT - 1000, 150, 20, {
      isStatic: true,
      friction: 0,
      label: "spinning-platform",
    }),
  ];

  const walls = [
    Matter.Bodies.rectangle(WIDTH / 2 - 90, HEIGHT - 800, 20, 500, {
      isStatic: true,
      friction: 0,
      label: "wall",
    }),
    Matter.Bodies.rectangle(WIDTH / 2 + 90, HEIGHT - 800, 20, 500, {
      isStatic: true,
      friction: 0,
      label: "wall",
    }),
    Matter.Bodies.rectangle(WIDTH - 505, HEIGHT - 390, 20, 200, {
      isStatic: true,
      friction: 0,
      label: "wall",
    }),
    Matter.Bodies.rectangle(WIDTH + 200, HEIGHT - 400, 20, 200, {
      isStatic: true,
      friction: 0,
      label: "wall",
    }),
    Matter.Bodies.rectangle(WIDTH - 190, HEIGHT - 320, 20, 25, {
      isStatic: true,
      friction: 0,
      label: "wall",
    }),
    Matter.Bodies.rectangle(WIDTH - 70, HEIGHT - 320, 20, 25, {
      isStatic: true,
      friction: 0,
      label: "wall",
    }),
  ];

  const hazards = [
    Matter.Bodies.rectangle(WIDTH / 1.5, HEIGHT - 320, 100, 20, {
      isStatic: true,
      isSensor: true,
      label: "hazard",
    }),
  ];

  const goalPlatform = Matter.Bodies.rectangle(
    WIDTH / 2,
    HEIGHT - 2150,
    70,
    10,
    {
      isStatic: true,
      isSensor: true,
      label: "goal",
    }
  );
  const goalTopBar = Matter.Bodies.rectangle(WIDTH / 2, HEIGHT - 2225, 90, 1, {
    isStatic: true,
    isSensor: false,
    label: "goal-bar",
    render: { visible: false },
  });

  const lowestPlatform = platforms.reduce((lowest, current) => {
    return current.position.y > lowest.position.y ? current : lowest;
  }, platforms[0]);

  const ball = Matter.Bodies.circle(
    lowestPlatform.position.x - 250,
    lowestPlatform.position.y - 30,
    20,
    {
      friction: 0.05,
      frictionStatic: 0,
      frictionAir: 0.01,
      restitution: 0.4,
      mass: 1,
      inertia: Infinity,
      inverseInertia: 0,
    }
  );

  return {
    ball,
    platforms: [
      ...platforms,
      ...spinningPlatforms,
      ...hazards,
      ...walls,
      ...roundWalls,
      goalPlatform,
      goalTopBar,
    ],
    goalPlatform,
    goalTopBar,
    walls,
    roundWalls,
    lowestPlatformY: lowestPlatform.position.y,
  };
}
