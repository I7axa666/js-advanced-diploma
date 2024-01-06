export function randomInteger(min, max) {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

export function randomList(list, count) {
  const listOfNumbers = [];
  for (let i = 0; i < count; i++) {
    const newNumb = list[Math.floor((Math.random() * list.length))];
    if (listOfNumbers.includes(newNumb)) {
      i--;
    } else {
      listOfNumbers.push(newNumb);
    }
  }
  return listOfNumbers;
}
