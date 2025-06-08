import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Text,
  Vibration,
  TouchableOpacity,
} from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { Accelerometer } from "expo-sensors";
import createLevel1 from "./levels/createLevel1";
import Physics, { getTiltRef } from "./systems/Physics";
import createEntitiesFromLevel from "./helpers/createEntities";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import createLevel2 from "./levels/createLevel2";

const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");

export default function Game() {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [engineKey, setEngineKey] = useState(0);

  const engine = useRef(
    Matter.Engine.create({ enableSleeping: false })
  ).current;
  const world = engine.world;

  const cameraY = useRef(0);
  const cameraX = useRef(0);
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const isBallTouching = useRef(false);

  const [level, setLevel] = useState(createLevel1());

  const entities = useMemo(
    () =>
      createEntitiesFromLevel(
        level,
        engine,
        world,
        cameraX,
        cameraY,
        setScrollX,
        setScrollY,
        isBallTouching,
        setIsGameOver
      ),
    [level, engineKey]
  );

  const gameOverOpacity = useSharedValue(0);
  const gameOverAnimatedStyle = useAnimatedStyle(() => ({
    opacity: gameOverOpacity.value,
  }));

  const tiltRef = getTiltRef();

  const jumpCount = useRef(0);
  const lastJumpTime = useRef(0);
  const maxJumps = 2;

  useEffect(() => {
    Matter.World.add(world, [level.ball, ...level.platforms]);

    let smoothed = 0;
    Accelerometer.setUpdateInterval(16);
    const subscription = Accelerometer.addListener(({ x }) => {
      smoothed = smoothed * 0.8 + x * 0.2;
      tiltRef.current = smoothed;
    });

    return () => {
      subscription.remove();
    };
  }, [level]);

  function restartGame() {
    setLevel(createLevel1());
    setIsGameOver(false);
    setHasFinished(false);
    setIsRunning(false);
    setTimer(0);
    gameOverOpacity.value = 0;

    setEngineKey((prev) => prev + 1);
  }

  useEffect(() => {
    const handleCollisionStart = (event) => {
      const currentBall = level.ball;
      event.pairs.forEach(({ bodyA, bodyB }) => {
        if (bodyA === currentBall || bodyB === currentBall) {
          isBallTouching.current = true;
          jumpCount.current = 0;
        }

        const other = bodyA === currentBall ? bodyB : bodyA;
        if (other.label === "goal-bar") {
          setHasFinished(true);
          setIsRunning(false);
          Vibration.vibrate(1000);
        }
        if (other.label === "round-wall") {
          const normal = Matter.Vector.normalise({
            x: currentBall.position.x - other.position.x,
            y: currentBall.position.y - other.position.y,
          });

          Matter.Body.setVelocity(currentBall, {
            x: normal.x * 19,
            y: normal.y * 10,
          });
        }
      });
    };

    const handleCollisionEnd = (event) => {
      const currentBall = level.ball;
      event.pairs.forEach(({ bodyA, bodyB }) => {
        if (bodyA === currentBall || bodyB === currentBall) {
          isBallTouching.current = false;
        }
      });
    };

    Matter.Events.on(engine, "collisionStart", handleCollisionStart);
    Matter.Events.on(engine, "collisionEnd", handleCollisionEnd);

    return () => {
      Matter.Events.off(engine, "collisionStart", handleCollisionStart);
      Matter.Events.off(engine, "collisionEnd", handleCollisionEnd);
    };
  }, [level.ball]);

  const handleJump = useCallback(() => {
    const now = Date.now();
    const currentBall = level.ball;

    if (now - lastJumpTime.current < 300) return;

    if (jumpCount.current < maxJumps) {
      Matter.Body.setVelocity(currentBall, {
        x: currentBall.velocity.x,
        y: -10,
      });
      jumpCount.current += 1;
      lastJumpTime.current = now;
    }

    if (!isRunning) {
      setIsRunning(true);
    }
  }, [level.ball]);

  useEffect(() => {
    let interval;

    if (isRunning && !hasFinished && !isGameOver) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 0.1);
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isRunning, hasFinished, isGameOver]);

  useEffect(() => {
    if (isGameOver && !hasFinished) {
      gameOverOpacity.value = withTiming(1, { duration: 500 });
      Vibration.vibrate(500);
    }
  }, [isGameOver, hasFinished]);

  return (
    <TouchableWithoutFeedback onPress={handleJump}>
      <View style={styles.container}>
        <View style={styles.overlay}>
          {hasFinished && <Text style={styles.goalText}>FINISH</Text>}
          <Text style={styles.timer}>{timer.toFixed(1)}s</Text>
        </View>
        <Animated.View
          pointerEvents={isGameOver && !hasFinished ? "auto" : "none"}
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.6)", // dark overlay
              justifyContent: "center",
              alignItems: "center",
              zIndex: 99,
            },
            gameOverAnimatedStyle,
          ]}
        >
          <Text style={styles.gameOverText}>Game Over</Text>
          <TouchableOpacity onPress={restartGame} style={styles.restartButton}>
            <Text style={styles.restartButtonText}>Try Again</Text>
          </TouchableOpacity>
        </Animated.View>

        <View
          style={{
            height: HEIGHT * 5,
            width: WIDTH,
            transform: [{ translateY: scrollY }, { translateX: scrollX }],
          }}
        >
          <GameEngine key={engineKey} systems={[Physics]} entities={entities} />
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
  restartButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    elevation: 3,
  },
  restartButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
