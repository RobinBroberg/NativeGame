import createLevel1 from "./createLevel1";
import createLevel2 from "./createLevel2";
import createLevel3 from "./createLevel3";

export default function createLevelByNumber(levelNum) {
  switch (levelNum) {
    case 1:
      return createLevel1();
    case 2:
      return createLevel2();
    case 3:
      return createLevel3();
    default:
      return null;
  }
}
