import Ball from "../entities/Ball";
import Platform from "../entities/Platform";
import GoalPlatform from "../entities/GoalPlatform";
import Wall from "../entities/Wall";
import RoundWall from "../entities/RoundWall";
import SpinningPlatform from "../entities/SpinningPlatform";
import Hazard from "../entities/Hazard";

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
  };

  if (level.roundWalls) {
    level.roundWalls.forEach((wall, i) => {
      entities[`roundWall${i}`] = {
        body: wall,
        size: [wall.circleRadius * 2, wall.circleRadius * 2],
        renderer: RoundWall,
      };
    });
  }

  // Handle different types of platforms
  level.platforms.forEach((platform, i) => {
    const width = platform.bounds.max.x - platform.bounds.min.x;
    const height = platform.bounds.max.y - platform.bounds.min.y;
    const spinDirection = platform.plugin?.spinDirection || 1;

    if (platform.label === "spinning-platform") {
      entities[`spinningPlatform${i}`] = {
        body: platform,
        size: [platform.bounds.max.x - platform.bounds.min.x, 20],
        spinDirection,
        renderer: SpinningPlatform,
      };
    } else if (platform.label === "moving-platform") {
      entities[`movingPlatform${i}`] = {
        body: platform,
        size: [width, height],
        baseX: platform.position.x,
        renderer: Platform,
      };
    } else if (platform.label === "hazard") {
      entities[`hazard${i}`] = {
        body: platform,
        size: [width, height],
        renderer: Hazard,
      };
    } else if (
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
