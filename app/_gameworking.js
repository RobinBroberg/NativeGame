import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { Accelerometer } from "expo-sensors";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

const Ball = ({ body, radius }) => {
  const x = body.position.x - radius;
  const y = body.position.y - radius;
  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: radius * 2,
        height: radius * 2,
        borderRadius: radius,
        backgroundColor: "red",
      }}
    />
  );
};

const Platform = ({ body, size }) => {
  const width = size[0];
  const height = size[1];
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;
  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        backgroundColor: "brown",
        borderRadius: 5,
      }}
    />
  );
};

const tiltRef = { current: 0 };

const Physics = (entities, { time }) => {
  const engine = entities.physics.engine;
  const ball = entities.ball.body;
  const cameraY = entities.physics.cameraY;
  const setScrollY = entities.physics.setScrollY;

  Matter.Engine.update(engine, Math.min(time.delta, 16.666));

  const tilt = tiltRef.current;
  Matter.Body.setVelocity(ball, {
    x: tilt * 10,
    y: ball.velocity.y,
  });

  // Update camera scroll
  const newOffset = Math.min(0, HEIGHT * 0.7 - ball.position.y);
  cameraY.current = newOffset;
  setScrollY(newOffset); //

  return entities;
};

export default function Game() {
  const [scrollY, setScrollY] = useState(0);
  const cameraY = useRef(0);
  const engine = useRef(
    Matter.Engine.create({ enableSleeping: false })
  ).current;
  const world = engine.world;

  const ball = Matter.Bodies.circle(WIDTH / 2, 100, 20, {
    friction: 0.01,
    frictionAir: 0.01,
    restitution: 0.2,
    mass: 1,
    inertia: Infinity,
    inverseInertia: 0,
  });

  const ground = Matter.Bodies.rectangle(WIDTH / 2, HEIGHT + 2000, WIDTH, 40, {
    isStatic: true,
    friction: 0.05,
  });

  const floatingPlatform = Matter.Bodies.rectangle(
    WIDTH / 2,
    HEIGHT / 2,
    150,
    20,
    {
      isStatic: true,
      friction: 0.05,
    }
  );
  const platforms = [
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT / 2, 150, 20, { isStatic: true }),
    Matter.Bodies.rectangle(WIDTH / 3, HEIGHT + 100, 120, 20, {
      isStatic: true,
    }),
    Matter.Bodies.rectangle(WIDTH * 0.75, HEIGHT + 250, 160, 20, {
      isStatic: true,
    }),
    Matter.Bodies.rectangle(WIDTH / 2, HEIGHT + 400, 150, 20, {
      isStatic: true,
    }),
  ];

  const leftWall = Matter.Bodies.rectangle(-25, HEIGHT / 2, 50, HEIGHT, {
    isStatic: true,
  });

  const rightWall = Matter.Bodies.rectangle(
    WIDTH + 25,
    HEIGHT / 2,
    50,
    HEIGHT,
    {
      isStatic: true,
    }
  );

  useEffect(() => {
    Matter.World.add(world, [
      ball,
      ground,
      floatingPlatform,
      leftWall,
      rightWall,
      ...platforms,
    ]);

    let smoothed = 0;
    Accelerometer.setUpdateInterval(16);
    const subscription = Accelerometer.addListener(({ x }) => {
      smoothed = smoothed * 0.8 + x * 0.2;
      tiltRef.current = smoothed;
    });

    return () => subscription.remove();
  }, []);

  const entities = {
    physics: { engine, world, cameraY, setScrollY },
    ball: { body: ball, radius: 20, renderer: Ball },
    ground: { body: ground, size: [WIDTH, 40], renderer: Platform },
    floatingPlatform: {
      body: floatingPlatform,
      size: [150, 20],
      renderer: Platform,
    },
  };

  platforms.forEach((platform, i) => {
    entities[`platform${i}`] = {
      body: platform,
      size: [platform.bounds.max.x - platform.bounds.min.x, 20],
      renderer: Platform,
    };
  });

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, transform: [{ translateY: scrollY }] }}>
        <GameEngine
          systems={[Physics]}
          entities={entities}
          style={{ flex: 1, position: "relative" }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d0e6f7",
  },
});
