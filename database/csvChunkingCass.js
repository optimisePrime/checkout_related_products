const fs = require('fs');
const faker = require('faker');

const fileName = {
  0: 'Electronics',
  1: 'Beauty',
  2: 'Books',
  3: 'Music',
  4: 'Arts',
};

const numEntries = 10000000;
const numFiles = 5; //5
const numElementsInFile = numEntries / numFiles; //200

const generateString = itemId => {
  const name = faker.commerce.productName();
  const price = faker.commerce.price(3, 10000, 2);
  const stock = faker.random.number({ min: 0, max: 30 });
  const onList = faker.random.boolean();
  const rating = faker.random.number({ min: 0, max: 5 });
  const numOfRatings = faker.random.number({ min: 0, max: 1000 });
  const imgUrl = faker.image.fashion(200, 200, true);
  return `${itemId},${name},${price},${stock},${onList},${rating},${numOfRatings},${imgUrl}\n`;
};

// pass itemId to generateString
// row to keep track of where the current row is in the file
const writeFile = (file, itemId, rowInFile) => {
  while (rowInFile < numElementsInFile) {
    if (!file.write(generateString(itemId))) {
      file.once('drain', () => {
        writeFile(file, itemId + 1, rowInFile + 1);
      });
      return;
    }
    itemId++;
    rowInFile++;
  }
};

const dataGen = fileNumber => {
  const file = fs.createWriteStream(
    `database/seedChunk${fileName[fileNumber]}2M.csv`,
  );
  writeFile(file, fileNumber * numElementsInFile + 1, 0);
};

for (let i = 0; i < numFiles; i++) {
  dataGen(i);
}
