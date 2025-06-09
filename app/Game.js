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
import createLevel2 from "./levels/createLevel2";
import Physics, { getTiltRef } from "./systems/Physics";
import createEntitiesFromLevel from "./helpers/createEntities";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import MenuModal from "./components/MenuModal";

const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");

export default function Game() {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentLevelNumber, setCurrentLevelNumber] = useState(1);
  const [menuVisible, setMenuVisible] = useState(false);

  const engine = useRef(
    Matter.Engine.create({ enableSleeping: false })
  ).current;
  const world = engine.world;
  const gameEngineRef = useRef(null);

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
    [level]
  );

  const gameOverOpacity = useSharedValue(0);
  const gameOverAnimatedStyle = useAnimatedStyle(() => ({
    opacity: gameOverOpacity.value,
  }));

  const tiltRef = getTiltRef();

  const jumpCount = useRef(0);
  const lastJumpTime = useRef(0);
  const maxJumps = 2;

  const createLevelByNumber = (levelNum) => {
    switch (levelNum) {
      case 1:
        return createLevel1();
      case 2:
        return createLevel2();
      default:
        return createLevel1();
    }
  };

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
    const newLevel = createLevelByNumber(currentLevelNumber);

    Matter.Engine.clear(engine);
    engine.events = {};
    Matter.World.clear(world, false);
    setLevel(newLevel);
    setIsGameOver(false);
    setHasFinished(false);
    setIsRunning(false);
    setTimer(0);
    setMenuVisible(false);
    gameOverOpacity.value = 0;

    if (gameEngineRef.current) {
      const newEntities = createEntitiesFromLevel(
        newLevel,
        engine,
        world,
        cameraX,
        cameraY,
        setScrollX,
        setScrollY,
        isBallTouching,
        setIsGameOver
      );
      gameEngineRef.current.swap(newEntities);
    }
  }

  function nextLevel() {
    const nextLevelNum = currentLevelNumber + 1;
    const newLevel = createLevelByNumber(nextLevelNum);

    Matter.Engine.clear(engine);
    engine.events = {};
    Matter.World.clear(world, false);

    setCurrentLevelNumber(nextLevelNum);
    setLevel(newLevel);
    setIsGameOver(false);
    setHasFinished(false);
    setIsRunning(false);
    setTimer(0);
    setMenuVisible(false);

    if (gameEngineRef.current) {
      const newEntities = createEntitiesFromLevel(
        newLevel,
        engine,
        world,
        cameraX,
        cameraY,
        setScrollX,
        setScrollY,
        isBallTouching,
        setIsGameOver
      );
      gameEngineRef.current.swap(newEntities);
    }
  }

  const handleGameEvent = (event) => {
    if (event.type === "next-level") {
      nextLevel();
    } else if (event.type === "restart-level") {
      restartGame();
    }
  };

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
            x: normal.x * 7,
            y: normal.y * 15,
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
      <LinearGradient
        colors={["#4682b4", "#5ca0d3", "#87cefa", "#aee2ff"]}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <StatusBar hidden />
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setMenuVisible(true)}
          >
            <Text style={styles.menuIcon}>
              <Ionicons name="settings-sharp" size={28} color="white" />
            </Text>
          </TouchableOpacity>
          <View style={styles.overlay}>
            <Text style={styles.timer}>{timer.toFixed(1)}s</Text>
            <Text style={styles.levelIndicator}>
              Level {currentLevelNumber}
            </Text>
          </View>
          <MenuModal
            menuVisible={menuVisible}
            setMenuVisible={setMenuVisible}
            handleRestart={restartGame}
          />

          <Animated.View
            pointerEvents={isGameOver && !hasFinished ? "auto" : "none"}
            style={[styles.gameOverOverlay, gameOverAnimatedStyle]}
          >
            <Text style={styles.gameOverText}>Game Over</Text>
            <TouchableOpacity
              onPress={restartGame}
              style={styles.restartButton}
            >
              <Text style={styles.restartButtonText}>Try Again</Text>
            </TouchableOpacity>
          </Animated.View>

          {hasFinished && (
            <View style={styles.levelCompleteOverlay}>
              <Text style={styles.levelCompleteText}>
                Level {currentLevelNumber} Complete!
              </Text>
              <Text style={styles.timeText}>Time: {timer.toFixed(1)}s</Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={restartGame}
                  style={[styles.menuButton2, styles.restartButtonStyle]}
                >
                  <Text style={styles.menuButtonText}>Restart Level</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={nextLevel}
                  style={[styles.menuButton2, styles.nextLevelButtonStyle]}
                >
                  <Text style={styles.menuButtonText}>Next Level</Text>
                </TouchableOpacity>
              </View>
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
              ref={gameEngineRef}
              systems={[Physics]}
              entities={entities}
              onEvent={handleGameEvent}
            />
          </View>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 100,
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  gameOverOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
  },
  menuButton2: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  levelCompleteOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
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
    color: "#fff",
    top: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
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
  levelIndicator: {
    position: "absolute",
    top: 5,
    right: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  levelCompleteText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },

  timeText: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    marginBottom: 30,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 20,
  },

  menuButton: {
    position: "absolute",
    top: 30,
    left: 30,
    zIndex: 100,
  },

  menuIcon: {
    fontSize: 26,
    color: "#fff",
  },

  restartButtonStyle: {
    backgroundColor: "#ff6b6b",
    borderWidth: 2,
    borderColor: "#ff5252",
  },

  nextLevelButtonStyle: {
    backgroundColor: "#4ecdc4",
    borderWidth: 2,
    borderColor: "#26a69a",
  },

  menuButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});
