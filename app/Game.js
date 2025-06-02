import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { Accelerometer } from "expo-sensors";
import Ball from "../components/Ball";
import Platform from "../components/Platform";
import createLevel from "../helpers/createLevel";
import { Physics, getTiltRef } from "../systems/Physics";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

// const Physics = (entities, { time }) => {
//   const engine = entities.physics.engine;
//   const ball = entities.ball.body;
//   const cameraY = entities.physics.cameraY;
//   const setScrollY = entities.physics.setScrollY;

//   Matter.Engine.update(engine, Math.min(time.delta, 16.666));

//   const tilt = tiltRef.current;
//   Matter.Body.setVelocity(ball, {
//     x: tilt * 10,
//     y: ball.velocity.y,
//   });

//   // Update camera scroll
//   const newOffset = Math.min(0, HEIGHT * 0.7 - ball.position.y);
//   cameraY.current = newOffset;
//   setScrollY(newOffset); //

//   return entities;
// };

export default function Game() {
  const [scrollY, setScrollY] = useState(0);
  const cameraY = useRef(0);
  const engine = useRef(
    Matter.Engine.create({ enableSleeping: false })
  ).current;
  const world = engine.world;
  const { ball, ground, platforms } = createLevel();

  const tiltRef = getTiltRef();

  useEffect(() => {
    Matter.World.add(world, [ball, ground, ...platforms]);

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
