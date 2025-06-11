import AsyncStorage from "@react-native-async-storage/async-storage";

const getKey = (level) => `highscore-level-${level}`;

export async function saveHighscore(level, time) {
  try {
    const key = getKey(level);
    const existing = await AsyncStorage.getItem(key);

    if (!existing || time < parseFloat(existing)) {
      await AsyncStorage.setItem(key, time.toString());
    }
  } catch (e) {
    console.error("Error saving highscore:", e);
  }
}

export async function getHighscore(level) {
  try {
    const key = getKey(level);
    const score = await AsyncStorage.getItem(key);
    return score ? parseFloat(score) : null;
  } catch (e) {
    console.error("Error retrieving highscore:", e);
    return null;
  }
}

export async function clearHighscores() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const highscoreKeys = keys.filter((key) =>
      key.startsWith("highscore-level-")
    );
    await AsyncStorage.multiRemove(highscoreKeys);
  } catch (e) {
    console.error("Error clearing highscores:", e);
  }
}
