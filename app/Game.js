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
import Physics, { getTiltRef } from "../src/systems/physics";
import createEntitiesFromLevel from "../src/utils/createEntities";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import MenuModal from "../src/components/MenuModal";
import loadLevel from "../src/utils/loadLevel";
import GameButton from "../src/components/GameButton";
import { router } from "expo-router";
import { saveHighscore, getHighscore } from "../src/utils/highscoreManager";
import createLevelByNumber from "../src/levels/levelsFactory";
import { setupCollisionHandlers } from "../src/systems/collisonHandlers";
import {
  pauseGame,
  resumeGame,
  startGame,
  restartGame,
} from "../src/utils/gameControls";

const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");

export default function Game() {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentLevelNumber, setCurrentLevelNumber] = useState(1);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highscore, setHighscore] = useState(null);
  const [isNewHighscore, setIsNewHighscore] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

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

  const [level, setLevel] = useState(createLevelByNumber(currentLevelNumber));

  const gameOverOpacity = useSharedValue(0);
  const gameOverAnimatedStyle = useAnimatedStyle(() => ({
    opacity: gameOverOpacity.value,
  }));

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
        setIsGameOver,
        isPaused
      ),
    [level]
  );

  const gameState = {
    engine,
    world,
    cameraX,
    cameraY,
    setScrollX,
    setScrollY,
    isBallTouching,
    setIsGameOver,
    isPaused,
    gameEngineRef,
    gameOverOpacity,
    setLevel,
    setCurrentLevelNumber,
    setHasFinished,
    setIsRunning,
    setTimer,
    setMenuVisible,
  };

  const tiltRef = getTiltRef();

  const jumpCount = useRef(0);
  const lastJumpTime = useRef(0);
  const maxJumps = 2;

  const nextLevelNum = currentLevelNumber + 1;
  const nextLevelExists = createLevelByNumber(nextLevelNum) !== null;

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

  function nextLevel() {
    setMenuVisible(false);
    setIsPaused(false);
    const nextLevelNum = currentLevelNumber + 1;
    const newLevel = createLevelByNumber(nextLevelNum);
    if (!newLevel) {
      return;
    }
    loadLevel({
      ...gameState,
      level: newLevel,
      levelNumber: nextLevelNum,
    });
    setCurrentLevelNumber(nextLevelNum);
  }

  function handleGameEvent(event) {
    if (event.type === "next-level") {
      nextLevel();
    } else if (event.type === "restart-level") {
      restartGame({
        setMenuVisible,
        setIsPaused,
        createLevelByNumber,
        currentLevelNumber,
        gameState,
        loadLevel,
      });
    }
  }

  useEffect(() => {
    const cleanup = setupCollisionHandlers({
      engine,
      level,
      gameEngineRef,
      setIsPaused,
      setHasFinished,
      setIsRunning,
      isBallTouching,
      jumpCount,
    });

    return cleanup;
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

    if (isRunning && !hasFinished && !isGameOver && !isPaused) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 0.1);
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isRunning, hasFinished, isGameOver, isPaused]);

  useEffect(() => {
    async function loadHighscore() {
      const score = await getHighscore(currentLevelNumber);
      setHighscore(score);
    }

    loadHighscore();
  }, [currentLevelNumber]);

  useEffect(() => {
    if (hasFinished) {
      async function updateScore() {
        const previousHigh = await getHighscore(currentLevelNumber);
        const isNew = !previousHigh || timer < previousHigh;

        if (isNew) {
          await saveHighscore(currentLevelNumber, timer);
          setIsNewHighscore(true);
        } else {
          setIsNewHighscore(false);
        }

        setHighscore(await getHighscore(currentLevelNumber));
      }

      updateScore();
    }
  }, [hasFinished]);

  useEffect(() => {
    if (isGameOver && !hasFinished) {
      gameOverOpacity.value = withTiming(1, { duration: 500 });
      Vibration.vibrate(500);
    }
  }, [isGameOver, hasFinished]);

  useEffect(() => {
    setShowIntro(true);
    setIsPaused(true);

    setTimeout(() => {
      if (gameEngineRef.current?.state?.entities?.physics) {
        gameEngineRef.current.state.entities.physics.isPaused = true;
      }
    }, 50);
  }, [currentLevelNumber]);

  return (
    <TouchableWithoutFeedback onPress={handleJump}>
      <LinearGradient
        colors={["rgb(70, 130, 182)", "#5ca0d3", "#87cefa", "#aee2ff"]}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <StatusBar hidden />
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setMenuVisible(true);
              pauseGame({ setIsPaused, gameEngineRef });
            }}
            hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
          >
            <Ionicons name="settings-sharp" size={28} style={styles.menuIcon} />
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
            handleRestart={() =>
              restartGame({
                setMenuVisible,
                setIsPaused,
                createLevelByNumber,
                currentLevelNumber,
                gameState,
                loadLevel,
              })
            }
            resumeGame={() => {
              setMenuVisible(false);
              if (!hasFinished && !isGameOver) {
                resumeGame({ setIsPaused, gameEngineRef });
              }
            }}
          />

          <Animated.View
            pointerEvents={isGameOver && !hasFinished ? "auto" : "none"}
            style={[styles.gameOverOverlay, gameOverAnimatedStyle]}
          >
            <Text style={styles.gameOverText}>Game Over</Text>
            <GameButton
              title="Play Again"
              onPress={() =>
                restartGame({
                  setMenuVisible,
                  setIsPaused,
                  createLevelByNumber,
                  currentLevelNumber,
                  gameState,
                  loadLevel,
                })
              }
              width={200}
              justifyContent="center"
              fontSize={24}
            />
          </Animated.View>

          {hasFinished && (
            <View style={styles.levelCompleteOverlay}>
              <Text style={styles.levelCompleteText}>
                Level {currentLevelNumber} Complete!
              </Text>
              <Text style={styles.timeText}>
                Time:{" "}
                <Text
                  style={isNewHighscore ? styles.goldText : styles.timeText}
                >
                  {timer.toFixed(1)}
                </Text>
                s
              </Text>

              {isNewHighscore ? (
                <Text style={styles.highscoreText}>
                  <Ionicons name="trophy" size={22} /> New Record!
                </Text>
              ) : highscore !== null ? (
                <Text style={styles.highscoreText2}>
                  Best Time: {highscore.toFixed(1)}s
                </Text>
              ) : null}

              <View style={styles.buttonContainer}>
                <GameButton
                  title="Restart level"
                  onPress={() =>
                    restartGame({
                      setMenuVisible,
                      setIsPaused,
                      createLevelByNumber,
                      currentLevelNumber,
                      gameState,
                      loadLevel,
                    })
                  }
                  icon="refresh-outline"
                  color={nextLevelExists ? "#ff6b6b" : undefined}
                  borderColor={nextLevelExists ? "#ff5252" : undefined}
                  justifyContent="center"
                />

                {nextLevelExists ? (
                  <GameButton
                    title="Next Level"
                    icon="arrow-forward"
                    onPress={nextLevel}
                  />
                ) : (
                  <GameButton
                    title="Main Menu"
                    onPress={() => router.replace("/")}
                    icon="arrow-back"
                    color="#ff6b6b"
                    borderColor="#ff5252"
                    justifyContent="center"
                  />
                )}
              </View>
              {!nextLevelExists && (
                <Text style={[styles.timeText, styles.completedText]}>
                  All levels completed
                </Text>
              )}
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
            {!showIntro && (
              <>
                <Text
                  style={{
                    position: "absolute",
                    top: level.lowestPlatformY + 20,
                    left: WIDTH / 2 - 50,
                    fontSize: 42,
                    fontWeight: "bold",
                    color: "#FFA500",
                    textShadowColor: "#000",
                    textShadowOffset: { width: 2, height: 2 },
                    textShadowRadius: 5,
                  }}
                >
                  Level {currentLevelNumber}
                </Text>

                {highscore !== null && (
                  <Text
                    style={{
                      position: "absolute",
                      top: level.lowestPlatformY + 75,
                      left: WIDTH / 2 - 50,
                      fontSize: 18,
                      color: "#fff",
                      textShadowColor: "#000",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    }}
                  >
                    Best time: {highscore.toFixed(1)}s
                  </Text>
                )}
              </>
            )}
          </View>
          {showIntro && (
            <TouchableWithoutFeedback
              onPress={() =>
                startGame({ setShowIntro, setIsPaused, gameEngineRef })
              }
            >
              <View style={styles.introOverlay}>
                <Text style={styles.introTitle}>
                  Level {currentLevelNumber}
                </Text>
                <Text style={styles.introSubtitle}>Tap to Start</Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  completedText: {
    marginTop: 20,
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
    top: 7,
    backgroundColor: "rgba(37, 70, 136, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 4,
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
    fontWeight: "800",
    color: "#ffc107",
    marginBottom: 30,
    textShadowColor: "#ff9800",
    textShadowRadius: 4,
    textAlign: "center",
    letterSpacing: 1,
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
    flexDirection: "column",
    gap: 20,
  },

  menuButton: {
    position: "absolute",
    top: 30,
    left: 30,
    zIndex: 100,
    borderRadius: 20,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  menuIcon: {
    fontSize: 30,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  highscoreText: {
    fontSize: 20,
    color: "#ffd700",
    fontWeight: "bold",
    marginTop: 5,
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  highscoreText2: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 5,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  goldText: {
    color: "#ffd700",
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  introOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    paddingBottom: 100,
  },
  introTitle: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#FFD700",
  },
  introSubtitle: {
    fontSize: 24,
    color: "#fff",
    marginTop: 10,
  },
});
