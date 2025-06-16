export function pauseGame({ setIsPaused, gameEngineRef }) {
  setIsPaused(true);
  const physics = gameEngineRef.current?.state?.entities?.physics;
  if (physics) {
    physics.isPaused = true;
  }
}

export function resumeGame({ setIsPaused, gameEngineRef }) {
  setIsPaused(false);
  const physics = gameEngineRef.current?.state?.entities?.physics;
  if (physics) {
    physics.isPaused = false;
  }
}

export function startGame({ setShowIntro, setIsPaused, gameEngineRef }) {
  setShowIntro(false);
  setIsPaused(false);
  const physics = gameEngineRef.current?.state?.entities?.physics;
  if (physics) {
    physics.isPaused = false;
  }
}

export function restartGame({
  setMenuVisible,
  setIsPaused,
  createLevelByNumber,
  currentLevelNumber,
  gameState,
  loadLevel,
}) {
  setMenuVisible(false);
  setIsPaused(false);

  const newLevel = createLevelByNumber(currentLevelNumber);

  loadLevel({
    ...gameState,
    level: newLevel,
    levelNumber: currentLevelNumber,
  });
  gameState.setShowIntro(false);
}
