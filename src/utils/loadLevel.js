import Matter from "matter-js";
import createEntitiesFromLevel from "./createEntities";

export default function loadLevel({
  level,
  levelNumber,
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
}) {
  Matter.Engine.clear(engine);
  engine.events = {};
  Matter.World.clear(world, false);

  setCurrentLevelNumber(levelNumber);
  setLevel(level);
  setIsGameOver(false);
  setHasFinished(false);
  setIsRunning(false);
  setTimer(0);
  setMenuVisible(false);
  gameOverOpacity.value = 0;

  if (gameEngineRef.current) {
    const newEntities = createEntitiesFromLevel(
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
    );
    gameEngineRef.current.swap(newEntities);
  }
}
