import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { Accelerometer } from "expo-sensors";
import Ball from "./components/Ball";
import Platform from "./components/Platform";
import createLevel from "./helpers/createLevel";
import Physics, { getTiltRef } from "./systems/Physics";

const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");

export default function Game() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const cameraY = useRef(0);
  const cameraX = useRef(0);
  const engine = useRef(
    Matter.Engine.create({ enableSleeping: false })
  ).current;
  const world = engine.world;
  const { ball, platforms } = useRef(createLevel()).current;

  const tiltRef = getTiltRef();
  const jumpCount = useRef(0);
  const maxJumps = 2;

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
          jumpCount.current = 0; // reset on contact
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
  };

  platforms.forEach((platform, i) => {
    entities[`platform${i}`] = {
      body: platform,
      size: [platform.bounds.max.x - platform.bounds.min.x, 20],
      renderer: Platform,
    };
  });

  const handleJump = useCallback(() => {
    if (jumpCount.current < maxJumps) {
      Matter.Body.setVelocity(ball, {
        x: ball.velocity.x,
        y: -10,
      });
      jumpCount.current += 1;
    }
  }, [ball]);

  return (
    <TouchableWithoutFeedback onPress={handleJump}>
      <View style={styles.container}>
        <View
          style={{
            height: HEIGHT * 5,
            width: WIDTH,
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
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#aee2ff",
  },
});
