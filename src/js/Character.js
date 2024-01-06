/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    // TODO: выбросите исключение, если кто-то использует "new Character()"
    if (new.target.name === 'Character') {
      throw new Error('Нельзя создать персонаж из базового класса');
    }
  }

  /* eslint no-mixed-operators: "error" */
  levelUp() {
    this.level += 1;
    this.attack = Math.round(Math.max(this.attack, this.attack * (80 + this.health) / 100));
    this.defence = Math.round(Math.max(this.defence, this.defence * (80 + this.health) / 100));

    const health = this.health + 80;

    if (health > 100) {
      this.health = 100;
    } else {
      this.health = health;
    }
  }
}
