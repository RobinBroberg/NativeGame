import Ball from "../components/Ball";
import Platform from "../components/Platform";
import GoalPlatform from "../components/GoalPlatform";
import Wall from "../components/Wall";
import RoundWall from "../components/RoundWall";

export default function createEntitiesFromLevel(
  level,
  engine,
  world,
  cameraX,
  cameraY,
  setScrollX,
  setScrollY,
  isBallTouching,
  setIsGameOver
) {
  const entities = {
    physics: {
      engine,
      world,
      cameraX,
      cameraY,
      setScrollX,
      setScrollY,
      isBallTouching,
      setIsGameOver,
      lowestPlatformY: level.lowestPlatformY,
    },
    ball: {
      body: level.ball,
      radius: 20,
      renderer: Ball,
    },
    goalPlatform: {
      body: level.goalPlatform,
      size: [
        level.goalPlatform.bounds.max.x - level.goalPlatform.bounds.min.x,
        15,
      ],
      renderer: GoalPlatform,
    },
    movingPlatform: {
      body: level.movingPlatform,
      size: [200, 20],
      renderer: Platform,
    },
    roundWall1: {
      body: level.roundWall,
      size: [
        level.roundWall.circleRadius * 2,
        level.roundWall.circleRadius * 2,
      ],
      renderer: RoundWall,
    },
  };

  level.platforms.forEach((platform, i) => {
    if (
      !["goal", "goal-bar", "goal-post", "round-wall"].includes(platform.label)
    ) {
      entities[`platform${i}`] = {
        body: platform,
        size: [platform.bounds.max.x - platform.bounds.min.x, 20],
        renderer: Platform,
      };
    }
  });

  level.walls.forEach((wall, i) => {
    entities[`wall${i}`] = {
      body: wall,
      size: [
        wall.bounds.max.x - wall.bounds.min.x,
        wall.bounds.max.y - wall.bounds.min.y,
      ],
      renderer: Wall,
    };
  });

  return entities;
}
