export default class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }

  save(state) {
    // console.log(state);
    this.storage.setItem('state', JSON.stringify(state));
    // console.log(JSON.parse(this.storage.getItem('state')));
  }

  load() {
    try {
      return JSON.parse(this.storage.getItem('state'));
    } catch (e) {
      throw new Error('Invalid state');
    }
  }
}
