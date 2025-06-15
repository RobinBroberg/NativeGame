import Matter from "matter-js";
import { Dimensions } from "react-native";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export default function createLevel2() {
  const platforms = [
    Matter.Bodies.rectangle(WIDTH / 1.7, HEIGHT - 300, 220, 20, {
      isStatic: true,
      friction: 0.6,
      label: "platform",
    }),
    // Matter.Bodies.rectangle(WIDTH / 2, HEIGHT - 800, 150, 20, {
    //   isStatic: true,
    //   friction: 0.6,
    //   label: "platform",
    // }),
  ];

  const spinningPlatforms = [
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT - 600, 170, 20, {
      isStatic: true,
      friction: 0,
      label: "spinning-platform",
      plugin: { spinDirection: 1 },
    }),
    Matter.Bodies.rectangle(WIDTH - 400, HEIGHT - 800, 170, 20, {
      isStatic: true,
      friction: 0,
      label: "spinning-platform",
      plugin: { spinDirection: -1 },
    }),
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT - 1000, 170, 20, {
      isStatic: true,
      friction: 0,
      label: "spinning-platform",
      plugin: { spinDirection: 1 },
    }),
    Matter.Bodies.rectangle(WIDTH + 100, HEIGHT - 1200, 170, 20, {
      isStatic: true,
      friction: 0,
      label: "spinning-platform",
      plugin: { spinDirection: 1 },
    }),
  ];

  const movingPlatforms = [
    Matter.Bodies.rectangle(WIDTH + 300, HEIGHT - 1400, 200, 20, {
      isStatic: true,
      friction: 1,
      label: "moving-platform",
    }),
  ];

  const walls = [
    // Matter.Bodies.rectangle(WIDTH - 125, HEIGHT - 325, 20, 40, {
    //   isStatic: true,
    //   friction: 0.6,
    // }),
    // Matter.Bodies.rectangle(WIDTH - 260, HEIGHT - 325, 20, 40, {
    //   isStatic: true,
    //   friction: 0.6,
    // }),
  ];

  const hazards = [
    // Matter.Bodies.rectangle(WIDTH / 2, HEIGHT - 325, 100, 20, {
    //   isStatic: true,
    //   isSensor: true,
    //   label: "hazard",
    // }),
  ];

  const goalPlatform = Matter.Bodies.rectangle(
    WIDTH / 2,
    HEIGHT - 1600,
    70,
    10,
    {
      isStatic: true,
      isSensor: true,
      label: "goal",
    }
  );
  const goalTopBar = Matter.Bodies.rectangle(WIDTH / 2, HEIGHT - 1675, 90, 1, {
    isStatic: true,
    isSensor: false,
    label: "goal-bar",
    render: { visible: false },
  });

  const lowestPlatform = platforms.reduce((lowest, current) => {
    return current.position.y > lowest.position.y ? current : lowest;
  }, platforms[0]);

  const ball = Matter.Bodies.circle(
    lowestPlatform.position.x,
    lowestPlatform.position.y - 30,
    20,
    {
      friction: 0.05,
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
      goalPlatform,
      goalTopBar,
      ...movingPlatforms,
    ],
    goalPlatform,
    goalTopBar,
    walls,
    roundWalls: [],
    lowestPlatformY: lowestPlatform.position.y,
  };
}
