import Bowman from '../js/characters/bowman';
import Deamon from '../js/characters/deamon';
import Magician from '../js/characters/magician';
import Swordsman from '../js/characters/swordsman';
import Undead from '../js/characters/undead';
import Vampire from '../js/characters/vampire';
import { getCharacter } from '../js/utils';

const testList = [
  { character: new Bowman(1), position: 1 },
  { character: new Deamon(1), position: 2 },
  { character: new Magician(1), position: 3 },
  { character: new Swordsman(1), position: 4 },
  { character: new Undead(1), position: 5 },
  { character: new Vampire(1), position: 6 },
];

test.each([
  [1, new Bowman(1)],
  [2, new Deamon(1)],
  [3, new Magician(1)],
  [4, new Swordsman(1)],
  [5, new Undead(1)],
  [6, new Vampire(1)],
])('position %s to Be Instance Of %s', (position, createdClass) => {
  expect(getCharacter(position, testList)).toEqual(createdClass);
});
