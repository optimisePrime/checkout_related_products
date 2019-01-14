const fs = require('fs');
const faker = require('faker');

const dataGen = () => {
  const file = fs.createWriteStream('database/seedChunkCat5M.csv');
  let i = 0;
  const numEntries = 5000000;

  const writer = () => {
    let result = true;

    //replaced relatedItems with category id column
    while (i < numEntries && result) {
      const item_id = i + 1;
      const name = faker.commerce.productName();
      const price = faker.commerce.price(3, 10000, 2);
      const stock = faker.random.number({ min: 0, max: 30 });
      const onList = faker.random.boolean();
      const rating = faker.random.number({ min: 0, max: 5 });
      const numOfRatings = faker.random.number({ min: 0, max: 1000 });
      // const relatedItems = JSON.stringify([
      //   faker.random.number({ min: 1, max: 5000000 }),
      //   faker.random.number({ min: 1, max: 5000000 }),
      //   faker.random.number({ min: 1, max: 5000000 }),
      // ]);
      const category_id = (i % 5) + 1;
      const imgUrl = faker.image.fashion(200, 200, true);

      result = file.write(
        `${item_id},${name},${price},${stock},${onList},${rating},${numOfRatings},${category_id},${imgUrl}\n`,
      );
      i += 1;
    }
    if ((i + 1) % 100000 === 0) {
      console.log(i + 1, ' created');
    }
    if (i < numEntries) {
      file.once('drain', writer);
    }
  };
  return writer;
};

const createData = dataGen();
createData();
