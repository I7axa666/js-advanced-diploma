import GameStateService from '../js/GameStateService';
import Storage from '../__mocks__/storageForMock';

jest.mock('../__mocks__/storageForMock');
beforeEach(() => jest.resetAllMocks());

const storage = new Storage();
const gameState = new GameStateService(storage);

test('should return string', () => {
  storage.setItem.mockReturnValue(JSON.stringify({}));
  gameState.save();
  expect(storage.setItem()).toEqual('{}');
});

test('should return value', () => {
  storage.getItem.mockReturnValue(123);
  gameState.load();
  expect(storage.getItem()).toEqual(123);
});

test('should handel invalid storage', () => {
  storage.getItem.mockReturnValue('');

  expect(() => gameState.load()).toThrowError('Invalid state');
});
