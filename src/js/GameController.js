import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import { randomList } from './randomInteger';
import Bowman from './characters/bowman';
import Deamon from './characters/deamon';
import Magician from './characters/magician';
import Swordsman from './characters/swordsman';
import Undead from './characters/undead';
import Vampire from './characters/vampire';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.whiteTeam = generateTeam([Bowman, Swordsman, Magician], 1, 3);
    this.blackTeam = generateTeam([Vampire, Undead, Deamon], 1, 3);
    this.whitePosition = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
    this.blackPosition = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
    this.randomListWhitePosition = randomList(this.whitePosition, this.whiteTeam.characters.length);
    this.randomListBlackPosition = randomList(this.blackPosition, this.blackTeam.characters.length);
    this.positionCharacters = [];
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi('prairie');

    for (let i = 0; i < this.whiteTeam.characters.length; i++) {
      this.positionCharacters.push(new PositionedCharacter(
        this.whiteTeam.characters[i],
        this.randomListWhitePosition[i],
      ));
    }
    for (let i = 0; i < this.blackTeam.characters.length; i++) {
      this.positionCharacters.push(new PositionedCharacter(
        this.blackTeam.characters[i],
        this.randomListBlackPosition[i],
      ));
    }

    this.gamePlay.redrawPositions(this.positionCharacters);
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
