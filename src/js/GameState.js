import PositionedCharacter from './PositionedCharacter';
import Bowman from './characters/bowman';
import Daemon from './characters/daemon';
import Magician from './characters/magician';
import Swordsman from './characters/swordsman';
import Undead from './characters/undead';
import Vampire from './characters/vampire';

export default class GameState {
  static from(object) {
    // TODO: create object
    const charactersList = {
      bowman: Bowman,
      daemon: Daemon,
      magician: Magician,
      swordsman: Swordsman,
      undead: Undead,
      vampire: Vampire,
    };
    const positionCharacters = [];

    object.forEach((obj) => {
      const character = new charactersList[obj.character.type](obj.character.level);

      for (const key in obj.character) {
        if (character[key]) {
          // console.log(key, character[key], obj.character[key]);
          character[key] = obj.character[key];
        }
      }

      positionCharacters.push(new PositionedCharacter(
        character,
        obj.position,
      ));
    });
    return positionCharacters;
  }
}
