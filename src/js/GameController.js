import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import { randomList } from './randomInteger';
import Bowman from './characters/bowman';
import Deamon from './characters/deamon';
import Magician from './characters/magician';
import Swordsman from './characters/swordsman';
import Undead from './characters/undead';
import Vampire from './characters/vampire';
import { getCharacter, getColorTeam } from './utils';
import GameState from './GameState';
import GamePlay from './GamePlay';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.showCellTooltip = this.gamePlay.showCellTooltip.bind(this.gamePlay);
    this.stateService = stateService;
    this.whiteTeam = generateTeam([Bowman, Swordsman, Magician], 1, 3);
    this.blackTeam = generateTeam([Vampire, Undead, Deamon], 1, 3);
    this.whitePosition = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
    this.blackPosition = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
    this.randomListWhitePosition = randomList(this.whitePosition, this.whiteTeam.characters.length);
    this.randomListBlackPosition = randomList(this.blackPosition, this.blackTeam.characters.length);
    this.positionCharacters = [];
    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.startPositions = this.startPositions.bind(this);
    this.activeCell = null;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi('prairie');
    this.startPositions();

    this.playerListener();
  }

  playerListener() {
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addCellClickListener(this.onCellClick);
  }

  onCellClick(index) {
    // TODO: react to click
    const field = document.querySelectorAll('.cell');
    if (field[index].childNodes.length !== 0) {
      if (getColorTeam(field[index].querySelector('.character').classList[1]) == 'white') {
        if (this.activeCell !== null) {
          this.gamePlay.deselectCell(this.activeCell);
        }
        this.gamePlay.selectCell(index);
        this.activeCell = index;
      } else {
        GamePlay.showError('Персонаж чужой команды');
      }
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const field = document.querySelectorAll('.cell');
    if (field[index].childNodes.length !== 0) {
      const character = getCharacter(index, this.positionCharacters);
      this.gamePlay.showCellTooltip(
        `\u{1F396} ${character.level}\u{2694} ${character.attack}\u{1F6E1} ${character.defence}\u{2764}${character.health}`,
        index,
      );
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
  }

  startPositions() {
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
}
