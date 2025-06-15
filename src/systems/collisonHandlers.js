import Matter from "matter-js";
import { Vibration } from "react-native";

export function setupCollisionHandlers({
  engine,
  level,
  gameEngineRef,
  setIsPaused,
  setHasFinished,
  setIsRunning,
  isBallTouching,
  jumpCount,
  setIsGameOver,
}) {
  function handleCollisionStart(event) {
    if (!level?.ball) return;
    const currentBall = level.ball;

    event.pairs.forEach(({ bodyA, bodyB }) => {
      const isBallA = bodyA === currentBall;
      const isBallB = bodyB === currentBall;

      if (isBallA || isBallB) {
        const other = isBallA ? bodyB : bodyA;

        if (other.label === "hazard") {
          setIsPaused(true);
          setIsRunning(false);
          setTimeout(() => {
            setIsGameOver(true);
          }, 200);

          if (gameEngineRef.current?.state?.entities?.physics) {
            gameEngineRef.current.state.entities.physics.isPaused = true;
          }

          Vibration.vibrate(500);
          return;
        }

        if (other.label !== "wall") {
          isBallTouching.current = true;
          jumpCount.current = 0;
        }

        if (other.label === "goal-bar") {
          setIsPaused(true);
          if (gameEngineRef.current?.state?.entities?.physics) {
            gameEngineRef.current.state.entities.physics.isPaused = true;
          }
          setTimeout(() => {
            setHasFinished(true);
          }, 100);
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
      }
    });
  }

  function handleCollisionEnd(event) {
    if (!level?.ball) return;
    const currentBall = level.ball;
    event.pairs.forEach(({ bodyA, bodyB }) => {
      if (bodyA === currentBall || bodyB === currentBall) {
        isBallTouching.current = false;
      }
    });
  }

  Matter.Events.on(engine, "collisionStart", handleCollisionStart);
  Matter.Events.on(engine, "collisionEnd", handleCollisionEnd);

  return () => {
    Matter.Events.off(engine, "collisionStart", handleCollisionStart);
    Matter.Events.off(engine, "collisionEnd", handleCollisionEnd);
  };
}
