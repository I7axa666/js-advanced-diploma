/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index) {
  // TODO: ваш код будет тут
  if (index === 0) {
    return 'top-left';
  } if (index === 7) {
    return 'top-right';
  } if (index === 56) {
    return 'bottom-left';
  } if (index === 63) {
    return 'bottom-right';
  } if (index > 0 & index < 7) {
    return 'top';
  } if (index > 56 & index < 63) {
    return 'bottom';
  } if (index % 8 === 0) {
    return 'left';
  } if (index % 8 === 7) {
    return 'right';
  }
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function getCharacter(index, list) {
  const { character } = list.find((anyCharacter) => anyCharacter.position === index);
  return character;
}

export function getColorTeam(type) {
  if (['bowman', 'swordsman', 'magician'].includes(type)) {
    return 'white';
  }
  return 'black';
}

function getPossible(currentCell, distance) {
  const row = Math.floor(currentCell / 8);
  const col = currentCell % 8;

  const moves = [];

  const directions = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
    { row: -1, col: -1 },
    { row: -1, col: 1 },
    { row: 1, col: -1 },
    { row: 1, col: 1 },
  ];

  for (const dir of directions) {
    for (let i = 1; i <= distance; i++) {
      const newRow = row + dir.row * i;
      const newCol = col + dir.col * i;

      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        moves.push(newRow * 8 + newCol);
      }
    }
  }

  return moves;
}

export function canMove(type, index) {
  if (type === 'swordsman' || type === 'undead') {
    return getPossible(index, 4);
  }
  if (type === 'bowman' || type === 'vampire') {
    return getPossible(index, 2);
  }
  if (type === 'magician' || type === 'daemon') {
    return getPossible(index, 1);
  }
}

export function canAttack(type, index) {
  if (type === 'swordsman' || type === 'undead') {
    return getPossible(index, 1);
  }
  if (type === 'bowman' || type === 'vampire') {
    return getPossible(index, 2);
  }
  if (type === 'magician' || type === 'daemon') {
    return getPossible(index, 4);
  }
}

export function getTeamInfo(positionCharacters, team) {
  return positionCharacters.filter(
    (obj1) => team.characters.some(
      (obj2) => obj1.character.type === obj2.type,
    ),
  );
}
