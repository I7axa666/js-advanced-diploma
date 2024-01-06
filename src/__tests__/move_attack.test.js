import { canMove, canAttack } from '../js/utils';

test.each([
  ['magician', 0, [8, 1, 9], [8, 16, 24, 32, 1, 2, 3, 4, 9, 18, 27, 36]],
  ['vampire', 18, [10, 2, 26, 34, 17, 16, 19, 20, 9, 0, 11, 4, 25, 32, 27, 36], [10, 2, 26, 34, 17, 16, 19, 20, 9, 0, 11, 4, 25, 32, 27, 36]],
  ['swordsman', 63, [55, 47, 39, 31, 62, 61, 60, 59, 54, 45, 36, 27], [55, 62, 54]],
])('%s on position %s should move %s and attack %s', (type, index, arrayMove, arrayAttack) => {
  expect(canMove(type, index)).toEqual(arrayMove);
  expect(canAttack(type, index)).toEqual(arrayAttack);
});
