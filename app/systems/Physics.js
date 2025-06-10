import Matter from "matter-js";
import { Dimensions } from "react-native";

const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");

const tiltRef = { current: 0 };
export const getTiltRef = () => tiltRef;
let tick = 0;

export function Physics(entities, { time }) {
  if (entities.physics.isPaused) return entities;
  const engine = entities.physics.engine;
  const ball = entities.ball.body;
  const { cameraY, setScrollY, cameraX, setScrollX } = entities.physics;

  Matter.Engine.update(engine, Math.min(time.delta, 16.666));

  tick += time.delta;

  const amplitude = 100;
  const speed = 0.002;
  const baseX = WIDTH / 2;

  Object.entries(entities).forEach(([key, value]) => {
    if (key.startsWith("spinningPlatform") && value.body) {
      Matter.Body.setAngle(value.body, value.body.angle + 0.03);
    }
  });

  Object.entries(entities).forEach(([key, value]) => {
    if (key.startsWith("movingPlatform") && value.body) {
      const offset = Math.sin(tick * speed) * amplitude;
      Matter.Body.setPosition(value.body, {
        x: baseX + offset,
        y: value.body.position.y,
      });
    }
  });

  const tilt = tiltRef.current;
  const forceMagnitude = tilt * 0.001;
  Matter.Body.applyForce(ball, ball.position, { x: forceMagnitude, y: 0 });

  if (entities.physics.isBallTouching?.current) {
    Matter.Body.setAngularVelocity(ball, tilt * 0.6);
  }

  if (entities.ball && entities.physics.lowestPlatformY) {
    const ballY = entities.ball.body.position.y;
    const threshold = entities.physics.lowestPlatformY + 400;

    if (ballY > threshold) {
      entities.physics.setIsGameOver(true);
      Matter.Engine.clear(engine);
      engine.events = {};
      Matter.World.clear(engine.world, false);
    }
  }

  const newOffset = HEIGHT * 0.5 - ball.position.y;
  cameraY.current = newOffset;
  setScrollY(newOffset);

  const offsetX = WIDTH / 2 - ball.position.x;
  cameraX.current = offsetX;
  setScrollX(offsetX);

  return entities;
}

export default Physics;
