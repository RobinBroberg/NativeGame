import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Text,
} from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { Accelerometer } from "expo-sensors";
import Ball from "./components/Ball";
import Platform from "./components/Platform";
import createLevel from "./helpers/createLevel";
import Physics, { getTiltRef } from "./systems/Physics";
import GoalPlatform from "./components/GoalPlatform";
import Wall from "./components/Wall";

const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");

export default function Game() {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const cameraY = useRef(0);
  const cameraX = useRef(0);
  const engine = useRef(
    Matter.Engine.create({ enableSleeping: false })
  ).current;
  const world = engine.world;
  const { ball, platforms, goalPlatform, walls, lowestPlatformY } = useRef(
    createLevel()
  ).current;

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
        const other = bodyA === ball ? bodyB : bodyA;
        if (other.label === "goal-bar") {
          setHasFinished(true);
          setIsRunning(false);
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
      setIsGameOver,
      lowestPlatformY,
    },
  };

  platforms.forEach((platform, i) => {
    if (
      platform.label !== "goal" &&
      platform.label !== "goal-bar" &&
      platform.label !== "goal-post"
    ) {
      entities[`platform${i}`] = {
        body: platform,
        size: [platform.bounds.max.x - platform.bounds.min.x, 20],
        renderer: Platform,
      };
    }
  });

  walls.forEach((wall, i) => {
    entities[`wall${i}`] = {
      body: wall,
      size: [
        wall.bounds.max.x - wall.bounds.min.x,
        wall.bounds.max.y - wall.bounds.min.y,
      ],
      renderer: Wall,
    };
  });

  entities["goalPlatform"] = {
    body: goalPlatform,
    size: [goalPlatform.bounds.max.x - goalPlatform.bounds.min.x, 15],
    renderer: GoalPlatform,
  };

  entities["ball"] = {
    body: ball,
    radius: 20,
    renderer: Ball,
  };

  const handleJump = useCallback(() => {
    if (jumpCount.current < maxJumps) {
      Matter.Body.setVelocity(ball, {
        x: ball.velocity.x,
        y: -10,
      });
      jumpCount.current += 1;
    }
    if (!isRunning) {
      setIsRunning(true);
    }
  }, [ball]);

  useEffect(() => {
    let interval;

    if (isRunning && !hasFinished && !isGameOver) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 0.1);
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isRunning, hasFinished, isGameOver]);

  return (
    <TouchableWithoutFeedback onPress={handleJump}>
      <View style={styles.container}>
        <View style={styles.overlay}>
          {hasFinished && <Text style={styles.goalText}>FINISH</Text>}
          <Text style={styles.timer}>{timer.toFixed(1)}s</Text>
        </View>
        {isGameOver && !hasFinished && (
          <View style={styles.gameOverView}>
            <Text style={styles.gameOverText}>Game Over</Text>
          </View>
        )}

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
  overlay: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  goalText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#28a745",
    marginBottom: 8,
  },
  timer: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  gameOverView: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "red",
  },
});
