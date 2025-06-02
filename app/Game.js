import { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { Accelerometer } from "expo-sensors";
import Ball from "../components/Ball";
import Platform from "../components/Platform";
import createLevel from "../helpers/createLevel";
import { Physics, getTiltRef } from "../systems/Physics";

export default function Game() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const cameraY = useRef(0);
  const cameraX = useRef(0);
  const engine = useRef(
    Matter.Engine.create({ enableSleeping: false })
  ).current;
  const world = engine.world;
  const { ball, platforms } = createLevel();

  const tiltRef = getTiltRef();

  useEffect(() => {
    Matter.World.add(world, [ball, ...platforms]);

    let smoothed = 0;
    Accelerometer.setUpdateInterval(16);
    const subscription = Accelerometer.addListener(({ x }) => {
      smoothed = smoothed * 0.8 + x * 0.2;
      tiltRef.current = smoothed;
    });

    return () => subscription.remove();
  }, []);

  const isBallTouching = useRef(false);

  useEffect(() => {
    Matter.Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach(({ bodyA, bodyB }) => {
        if (bodyA === ball || bodyB === ball) {
          isBallTouching.current = true;
        }
      });
    });

    Matter.Events.on(engine, "collisionEnd", (event) => {
      event.pairs.forEach(({ bodyA, bodyB }) => {
        if (bodyA === ball || bodyB === ball) {
          isBallTouching.current = false;
        }
      });
    });
  }, []);

  const entities = {
    physics: {
      engine,
      world,
      cameraY,
      cameraX,
      setScrollX,
      setScrollY,
      isBallTouching,
    },
    ball: { body: ball, radius: 20, renderer: Ball },
    // ground: { body: ground, size: [WIDTH, 40], renderer: Platform },
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
      <View
        style={{
          flex: 1,
          transform: [{ translateY: scrollY }, { translateX: scrollX }],
        }}
      >
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
