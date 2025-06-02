import Matter from "matter-js";
import { Dimensions } from "react-native";

const { height: HEIGHT } = Dimensions.get("window");

const tiltRef = { current: 0 };
export const getTiltRef = () => tiltRef;

export const Physics = (entities, { time }) => {
  const engine = entities.physics.engine;
  const ball = entities.ball.body;
  const cameraY = entities.physics.cameraY;
  const setScrollY = entities.physics.setScrollY;

  Matter.Engine.update(engine, Math.min(time.delta, 16.666));

  const tilt = tiltRef.current;
  Matter.Body.setVelocity(ball, {
    x: tilt * 10,
    y: ball.velocity.y,
  });

  Matter.Body.setAngularVelocity(ball, tilt * 0.3);
  const newOffset = Math.min(0, HEIGHT * 0.7 - ball.position.y);
  cameraY.current = newOffset;
  setScrollY(newOffset);

  return entities;
};
