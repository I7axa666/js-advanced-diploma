import Chatacter from '../js/Character';
import Bowman from '../js/characters/bowman';
import Deamon from '../js/characters/deamon';
import Magician from '../js/characters/magician';
import Swordsman from '../js/characters/swordsman';
import Undead from '../js/characters/undead';
import Vampire from '../js/characters/vampire';

test('', () => {
  expect(() => {
    const character = new Chatacter(1);
    return character;
  }).toThrow(new Error('Нельзя создать персонаж из базового класса'));
});

test.each([
  [new Bowman(1), Chatacter],
  [new Deamon(1), Chatacter],
  [new Magician(1), Chatacter],
  [new Swordsman(1), Chatacter],
  [new Undead(1), Chatacter],
  [new Vampire(1), Chatacter],
])('class %s to Be Instance Of %s', (createdClass, classBase) => {
  expect(createdClass).toBeInstanceOf(classBase);
});

test.each([
  [Bowman, 1, 25, 25, 50, 'bowman'],
  [Deamon, 1, 10, 10, 50, 'daemon'],
  [Magician, 1, 10, 40, 50, 'magician'],
  [Swordsman, 1, 40, 10, 50, 'swordsman'],
  [Undead, 1, 40, 10, 50, 'undead'],
  [Vampire, 1, 25, 25, 50, 'vampire'],
])('creatind class %s', (ClassName, level, attack, defence, health, type) => {
  const character = new ClassName(1);
  expect(character.level).toBe(level);
  expect(character.attack).toBe(attack);
  expect(character.defence).toBe(defence);
  expect(character.health).toBe(health);
  expect(character.type).toBe(type);
});
