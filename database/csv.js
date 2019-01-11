const csvWriter = require('csv-write-stream');
const faker = require('faker');
const fs = require('fs');

const writer = csvWriter();

writer.pipe(fs.createWriteStream('seedCart.csv'));

// const result = [];
const numEntries = 100000;

for (let i = 0; i < numEntries; i += 1) {
  const item_id = i + 1;
  const name = faker.commerce.productName();
  const price = faker.commerce.price(3, 10000, 2);
  const stock = faker.random.number({ min: 0, max: 30 });
  const onList = faker.random.boolean();
  const rating = faker.random.number({ min: 0, max: 5 });
  const numOfRatings = faker.random.number({ min: 0, max: 1000 });
  const relatedItems = JSON.stringify([
    faker.random.number({ min: 1, max: 100 }),
    faker.random.number({ min: 1, max: 100 }),
    faker.random.number({ min: 1, max: 100 }),
  ]);

  const imgUrl = faker.image.fashion(200, 200, true);

  const data = {
    item_id: item_id,
    name: name,
    price: price,
    stock: stock,
    onList: onList,
    rating: rating,
    numOfRatings: numOfRatings,
    relatedItems: relatedItems,
    imgUrl: imgUrl,
  };
  writer.write(data);
  // result.push(data);
}
// result.forEach(dataObj => {
//   return writer.write(dataObj);
// });
writer.end();

// };
