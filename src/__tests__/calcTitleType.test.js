import { calcTileType } from '../js/utils';

test.each([
  [0, 'top-left'],
  [7, 'top-right'],
  [56, 'bottom-left'],
  [63, 'bottom-right'],
  [16, 'left'],
  [1, 'top'],
  [60, 'bottom'],
])('calcTileType with index %s should return type %s', (index, type) => {
  expect(calcTileType(index, 8)).toBe(type);
});
