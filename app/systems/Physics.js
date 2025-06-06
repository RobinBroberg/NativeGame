import Matter from "matter-js";
import { Dimensions } from "react-native";

const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");

const tiltRef = { current: 0 };
export const getTiltRef = () => tiltRef;

export const Physics = (entities, { time }) => {
  const engine = entities.physics.engine;
  const ball = entities.ball.body;
  const { cameraY, setScrollY, cameraX, setScrollX } = entities.physics;

  Matter.Engine.update(engine, Math.min(time.delta, 16.666));

  const tilt = tiltRef.current;

  const forceMagnitude = tilt * 0.001;
  Matter.Body.applyForce(ball, ball.position, { x: forceMagnitude, y: 0 });

  if (entities.ball && entities.physics.lowestPlatformY) {
    const ballY = entities.ball.body.position.y;
    const threshold = entities.physics.lowestPlatformY + 200;

    if (ballY > threshold) {
      entities.physics.setIsGameOver(true);
      Matter.Engine.clear(engine);
    }
  }

  if (entities.physics.isBallTouching?.current) {
    Matter.Body.setAngularVelocity(ball, tilt * 0.6);
  }

  const newOffset = HEIGHT * 0.5 - ball.position.y;
  cameraY.current = newOffset;
  setScrollY(newOffset);

  const offsetX = WIDTH / 2 - ball.position.x;
  cameraX.current = offsetX;
  setScrollX(offsetX);

  return entities;
};

export default Physics;
