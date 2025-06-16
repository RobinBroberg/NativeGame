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
    Matter.Bodies.rectangle(WIDTH + 650, HEIGHT - 1450, 150, 20, {
      isStatic: true,
      friction: 0.6,
      label: "platform",
    }),
    Matter.Bodies.rectangle(WIDTH + 2000, HEIGHT - 2400, 150, 20, {
      isStatic: true,
      friction: 0.6,
      label: "platform",
    }),
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
    Matter.Bodies.rectangle(WIDTH, HEIGHT - 1200, 170, 20, {
      isStatic: true,
      friction: 0,
      label: "spinning-platform",
      plugin: { spinDirection: 1 },
    }),
  ];

  const movingPlatforms = [
    Matter.Bodies.rectangle(WIDTH + 350, HEIGHT - 1300, 220, 20, {
      isStatic: true,
      friction: 1,
      label: "moving-platform",
    }),
  ];

  const roundWalls = [
    Matter.Bodies.circle(WIDTH + 1000, HEIGHT - 1500, 40, {
      isStatic: true,
      friction: 0.6,
      restitution: 1,
      label: "round-wall",
    }),
    Matter.Bodies.circle(WIDTH + 1300, HEIGHT - 1700, 40, {
      isStatic: true,
      friction: 0.6,
      restitution: 1,
      label: "round-wall",
    }),
    Matter.Bodies.circle(WIDTH + 1600, HEIGHT - 1900, 40, {
      isStatic: true,
      friction: 0.6,
      restitution: 1,
      label: "round-wall",
    }),
    Matter.Bodies.circle(WIDTH + 1800, HEIGHT - 2100, 40, {
      isStatic: true,
      friction: 0.6,
      restitution: 1,
      label: "round-wall",
    }),
  ];

  const clouds = [
    { x: WIDTH - 50, y: HEIGHT - 250 },
    { x: WIDTH - 300, y: HEIGHT - 150 },
    { x: WIDTH - 300, y: HEIGHT - 800 },
    { x: WIDTH - 400, y: HEIGHT - 1400 },
    { x: WIDTH, y: HEIGHT - 1500 },
    { x: WIDTH + 350, y: HEIGHT - 1400 },
    { x: WIDTH + 550, y: HEIGHT - 1600 },
    { x: WIDTH + 850, y: HEIGHT - 1650 },
    { x: WIDTH + 1150, y: HEIGHT - 1900 },
    { x: WIDTH + 2100, y: HEIGHT - 2250 },

    { x: WIDTH + 2050, y: HEIGHT - 1800 },
    { x: WIDTH + 1900, y: HEIGHT - 1500 },
    { x: WIDTH + 2100, y: HEIGHT - 1100 },

    { x: WIDTH + 1700, y: HEIGHT - 1500 },
    { x: WIDTH + 1300, y: HEIGHT - 1100 },
    { x: WIDTH + 1100, y: HEIGHT - 1200 },
    { x: WIDTH + 1000, y: HEIGHT - 900 },

    { x: WIDTH + 2100, y: HEIGHT - 2800 },
    { x: WIDTH + 1800, y: HEIGHT - 2750 },
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
    WIDTH + 2000,
    HEIGHT - 2600,
    70,
    10,
    {
      isStatic: true,
      isSensor: true,
      label: "goal",
    }
  );
  const goalTopBar = Matter.Bodies.rectangle(
    WIDTH + 2000,
    HEIGHT - 2675,
    90,
    1,
    {
      isStatic: true,
      isSensor: false,
      label: "goal-bar",
      render: { visible: false },
    }
  );

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
      ...roundWalls,
      ...movingPlatforms,
    ],
    goalPlatform,
    goalTopBar,
    walls,
    roundWalls,
    clouds,
    lowestPlatformY: lowestPlatform.position.y,
  };
}
