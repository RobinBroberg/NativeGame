import Matter from "matter-js";
import { Dimensions } from "react-native";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export default function createLevel1() {
  const goalTopBar = Matter.Bodies.rectangle(WIDTH / 2, HEIGHT - 1575, 90, 1, {
    isStatic: true,
    isSensor: false,
    label: "goal-bar",
    render: { visible: false },
  });

  const goalPlatform = Matter.Bodies.rectangle(
    WIDTH / 2,
    HEIGHT - 1500,
    70,
    10,
    {
      isStatic: true,
      isSensor: true,
      label: "goal",
    }
  );

  const movingPlatform = Matter.Bodies.rectangle(
    WIDTH / 2,
    HEIGHT + 1600,
    200,
    20,
    {
      isStatic: true,
      friction: 1,
      label: "moving-platform",
    }
  );

  const walls = [
    Matter.Bodies.rectangle(WIDTH * 1.6, HEIGHT - 1200, 20, 220, {
      isStatic: true,
      friction: 0.6,
    }),
  ];

  const roundWall = Matter.Bodies.circle(WIDTH - 600, HEIGHT - 750, 40, {
    isStatic: true,
    friction: 0.6,
    label: "round-wall",
  });

  const platforms = [
    Matter.Bodies.rectangle(WIDTH / 2.6, HEIGHT - 1550, 10, 1, {
      isStatic: true,
      friction: 0.6,
      angle: Math.PI / 2,
      label: "goal-post",
    }),
    Matter.Bodies.rectangle(WIDTH / 1.6, HEIGHT - 1550, 10, 1, {
      isStatic: true,
      friction: 0.6,
      angle: Math.PI / 2,
      label: "goal-post",
    }),
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT - 1350, 220, 20, {
      isStatic: true,
      friction: 0.6,
    }),

    Matter.Bodies.rectangle(WIDTH * 0.75, HEIGHT - 1100, 220, 20, {
      isStatic: true,
      angle: Math.PI / 6,
      friction: 0.6,
    }),
    Matter.Bodies.rectangle(WIDTH / 3, HEIGHT - 900, 270, 20, {
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
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT + 1000, 200, 20, {
      isStatic: true,
      friction: 0.6,
    }),
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
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT + 2200, 500, 20, {
      isStatic: true,
      friction: 1.0,
    }),
  ];

  const lowestPlatform = platforms.reduce((lowest, current) => {
    return current.position.y > lowest.position.y ? current : lowest;
  }, platforms[0]);

  const ball = Matter.Bodies.circle(
    lowestPlatform.position.x,
    lowestPlatform.position.y - 30, // adjust starting distance above lowest platform
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
      ...walls,
      goalPlatform,
      goalTopBar,
      movingPlatform,
      roundWall,
    ],
    walls,
    goalPlatform,
    lowestPlatformY: lowestPlatform.position.y,
    movingPlatform,
    roundWall,
  };
}
