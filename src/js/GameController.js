import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import { randomInteger, randomList } from './randomInteger';
import Bowman from './characters/bowman';
import Daemon from './characters/daemon';
import Magician from './characters/magician';
import Swordsman from './characters/swordsman';
import Undead from './characters/undead';
import Vampire from './characters/vampire';
import {
  getCharacter, getColorTeam, canAttack, canMove, getTeamInfo,
} from './utils';
import GameState from './GameState';
import GamePlay from './GamePlay';
import themes from './themes';
import Team from './Team';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.showCellTooltip = this.gamePlay.showCellTooltip.bind(this.gamePlay);
    this.stateService = stateService;
    this.whiteTeam = generateTeam([Bowman, Swordsman, Magician], 1, 3);
    this.blackTeam = generateTeam([Vampire, Undead, Daemon], 1, 3);
    this.whitePosition = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
    this.blackPosition = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
    this.randomListWhitePosition = randomList(this.whitePosition, this.whiteTeam.characters.length);
    this.randomListBlackPosition = randomList(this.blackPosition, this.blackTeam.characters.length);
    this.positionCharacters = [];
    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.startPositions = this.startPositions.bind(this);
    this.newGame = this.newGame.bind(this);
    this.saveGame = this.saveGame.bind(this);
    this.loadGame = this.loadGame.bind(this);
    this.activeCell = undefined;
    this.character = undefined;
    this.characterForPreview = undefined;
    this.attack = false;
    this.move = false;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    // if (localStorage.state) {
    //   this.loadGame();
    // } else {
    //   this.gamePlay.drawUi(Object.values(themes)[0]);
    //   this.startPositions();
    // }

    this.gamePlay.drawUi(Object.values(themes)[0]);
    this.startPositions();

    this.playerListener();
  }

  playerListener() {
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addCellClickListener(this.onCellClick);
    this.gamePlay.addNewGameListener(this.newGame);
    this.gamePlay.addSaveGameListener(this.saveGame);
    this.gamePlay.addLoadGameListener(this.loadGame);
  }

  onCellClick(index) {
    // TODO: react to click
    const field = document.querySelectorAll('.cell');
    if (field[index].childNodes.length !== 0 && !this.move && !this.attack) {
      this.character = getCharacter(index, this.positionCharacters);

      if (getColorTeam(this.character.type) === 'white') {
        if (this.activeCell === index) {
          this.gamePlay.deselectCell(this.activeCell);
          this.activeCell = undefined;
          this.character = undefined;
        } else if (this.activeCell === undefined) {
          this.gamePlay.selectCell(index);
          this.activeCell = index;
        } else if (this.activeCell !== undefined) {
          this.gamePlay.deselectCell(this.activeCell);
          this.gamePlay.selectCell(index);
          this.activeCell = index;
        }
      } else if (this.activeCell === undefined) {
        GamePlay.showError('Персонаж чужой команды');
      }
    }

    if (field[index].childNodes.length === 0 && this.move) {
      const posIndex = this.positionCharacters.findIndex((obj) => obj.position === this.activeCell);

      this.positionCharacters[posIndex].position = index;

      this.gamePlay.redrawPositions(this.positionCharacters);
      this.clearSelected(index);

      this.computerActivity();
    }

    if (field[index].childNodes.length !== 0 && this.attack) {
      const posIndex = this.positionCharacters.findIndex((obj) => obj.position === index);
      const characterNormalAttack = this.character.attack;
      const characterDefence = this.positionCharacters[posIndex].character.defence;
      const characterAttack = Math.round(Math.max(
        characterNormalAttack - characterDefence,
        characterNormalAttack * 0.1,
      ));
      this.gamePlay.showDamage(index, characterAttack).then(() => {
        this.positionCharacters[posIndex].character.health -= characterAttack;

        if (this.positionCharacters[posIndex].character.health < 0) {
          this.positionCharacters.splice(posIndex, 1);
        }

        this.gamePlay.redrawPositions(this.positionCharacters);

        if (getTeamInfo(this.positionCharacters, this.blackTeam).length > 0) {
          this.computerActivity();
        } else {
          const teamForLevelUp = getTeamInfo(this.positionCharacters, this.whiteTeam);

          const { level } = teamForLevelUp[0].character;
          if (level === 4) {
            this.gameOver('white');
          } else {
            this.levelUp(teamForLevelUp);
          }
        }
      });
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const field = document.querySelectorAll('.cell');

    if (field[index].childNodes.length !== 0) {
      this.characterForPreview = getCharacter(index, this.positionCharacters);

      this.gamePlay.showCellTooltip(
        `\u{1F396} ${this.characterForPreview.level}\u{2694} ${this.characterForPreview.attack}\u{1F6E1} ${this.characterForPreview.defence}\u{2764}${this.characterForPreview.health}`,
        index,
      );

      if (getColorTeam(this.characterForPreview.type) === 'white') {
        this.gamePlay.setCursor('pointer');
      }
    }

    if (this.character) {
      if (
        canMove(this.character.type, this.activeCell).includes(index)
        && this.characterForPreview === undefined
      ) {
        this.gamePlay.setCursor('pointer');
        this.gamePlay.selectCell(index, 'green');
        this.move = true;
      } else if (canAttack(this.character.type, this.activeCell).includes(index) && this.characterForPreview && getColorTeam(this.characterForPreview.type) === 'black') {
        this.gamePlay.setCursor('crosshair');
        this.gamePlay.selectCell(index, 'red');
        this.attack = true;
      } else if (this.characterForPreview && getColorTeam(this.characterForPreview.type) === 'white') {
        this.gamePlay.setCursor('pointer');
      } else {
        this.gamePlay.setCursor('not-allowed');
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor('auto');
    this.characterForPreview = undefined;
    this.attack = false;
    this.move = false;

    if (this.activeCell !== index) {
      this.gamePlay.deselectCell(index);
    }
  }

  startPositions() {
    this.positionCharacters = [];

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

  clearSelected(index) {
    this.gamePlay.deselectCell(this.activeCell);
    this.gamePlay.deselectCell(index);
    this.gamePlay.selectCell(index);
    this.activeCell = index;
    this.gamePlay.selectCell(this.activeCell);
  }

  computerActivity() {
    const computerTeam = getTeamInfo(this.positionCharacters, this.blackTeam);
    const playerTeam = getTeamInfo(this.positionCharacters, this.whiteTeam);

    for (let j = 0; j < computerTeam.length; j++) {
      const cellsForAttack = canAttack(computerTeam[j].character.type, computerTeam[j].position);

      for (let i = 0; i < playerTeam.length; i++) {
        if (cellsForAttack.includes(playerTeam[i].position)) {
          const posIndex = this.positionCharacters.findIndex(
            (obj) => obj.position === playerTeam[i].position,
          );

          const characterNormalAttack = computerTeam[j].character.attack;
          const characterDefence = this.positionCharacters[posIndex].character.defence;
          const characterAttack = Math.round(Math.max(
            characterNormalAttack - characterDefence,
            characterNormalAttack * 0.1,
          ));
          return this.gamePlay.showDamage(
            playerTeam[i].position,
            characterAttack,
          ).then(() => {
            this.positionCharacters[posIndex].character.health -= characterAttack;
            if (this.positionCharacters[posIndex].character.health < 0) {
              this.positionCharacters.splice(posIndex, 1);
              this.gamePlay.deselectCell(playerTeam[i].position);

              if (playerTeam[i].position === this.activeCell) {
                this.activeCell = undefined;
                this.character = undefined;
                this.attack = false;
                this.gamePlay.setCursor('not-allowed');
                computerTeam.forEach((character) => {
                  this.gamePlay.deselectCell(character.position);
                });
              }
            }

            this.gamePlay.redrawPositions(this.positionCharacters);

            if (getTeamInfo(this.positionCharacters, this.whiteTeam).length === 0) {
              this.gameOver('black');
            }
          });
        }
      }
    }

    this.computerMove(computerTeam);
    this.gamePlay.redrawPositions(this.positionCharacters);
  }

  computerMove(computerTeam) {
    const activityCharacter = computerTeam[randomInteger(0, computerTeam.length - 1)];
    const posIndex = this.positionCharacters.findIndex(
      (obj) => obj.position === activityCharacter.position,
    );
    const steps = canMove(activityCharacter.character.type, activityCharacter.position);
    const cellsForMove = [];

    for (let i = 0; i < steps.length; i++) {
      if (this.positionCharacters.findIndex((obj) => obj.position === steps[i]) === -1) {
        cellsForMove.push(steps[i]);
      }
    }

    this.positionCharacters[posIndex].position = cellsForMove[randomInteger(
      0,
      cellsForMove.length - 1,
    )];
  }

  levelUp(team) {
    this.whiteTeam.characters = [];
    team.forEach((positionedCharacter) => {
      positionedCharacter.character.levelUp();
      this.whiteTeam.characters.push(positionedCharacter.character);
    });

    const { level } = team[0].character;

    this.blackTeam = generateTeam([Vampire, Undead, Daemon], 1, 3);
    this.gamePlay.drawUi(Object.values(themes)[level - 1]);

    this.startPositions();
  }

  gameOver(color = 'white') {
    const field = document.querySelector('.board');
    field.style.pointerEvents = 'none';
    if (color === 'white') {
      GamePlay.showMessage('You win');
    } else {
      GamePlay.showMessage('Game over');
    }
  }

  newGame() {
    this.whiteTeam = generateTeam([Bowman, Swordsman, Magician], 1, 3);
    this.blackTeam = generateTeam([Vampire, Undead, Daemon], 1, 3);
    this.randomListWhitePosition = randomList(
      this.whitePosition,
      this.whiteTeam.characters.length,
    );
    this.randomListBlackPosition = randomList(
      this.blackPosition,
      this.blackTeam.characters.length,
    );
    this.gamePlay.drawUi(Object.values(themes)[0]);
    this.startPositions();
  }

  loadGame() {
    this.positionCharacters = GameState.from(this.stateService.load());
    // console.log(this.positionCharacters);

    const whiteList = [];
    const blackList = [];

    this.positionCharacters.forEach((el) => {
      if (getColorTeam(el.character.type) === 'white') {
        whiteList.push(el.character);
      } else {
        blackList.push(el.character);
      }
    });

    this.whiteTeam = new Team(whiteList);
    this.blackTeam = new Team(blackList);

    const level = this.whiteTeam.characters[0].level - 1;

    this.gamePlay.drawUi(Object.values(themes)[level]);
    this.gamePlay.redrawPositions(this.positionCharacters);
  }

  saveGame() {
    localStorage.clear();
    // console.log(this.positionCharacters)
    this.stateService.save(this.positionCharacters);
  }
}
