const pg = require('pg');
const { Pool, Client } = require('pg');
const connectionString =
  process.env.DATABASE_URL || 'postgres://localhost:5432/';

// const client = pg.Client(connectionString);

const pool = new Pool({
  user: 'achou',
  host: '127.0.0.1',
  database: 'sunchamps_dev',
  // port: 5432,
});
// const client = new Client();

//READ
// const selectProduct = pool.connect((err, client, done) => {
//   if (err) throw err;

const selectProduct = itemId => {
  const query = 'SELECT * FROM items WHERE item_id = $1';
  const params = [itemId];
  return pool.query(query, params).then(result => {
    return result.rows;
  });
};

// add a route to get just the review rating
//TODO cartItem

// pool.connect((err, client, done) => {
//   if (err) throw err;

//   client.query(
//     'SELECT items.item_id, name, price, rating, numOfRatings, imgUrl FROM items INNER JOIN cartItems ON items.item_id = cartItems.item_id',
//     (err, results) => {
//       if (err) {
//         return res.send(err);
//       }
//       res.send(results);
//     },
//   );
// });

//TODO
// pool.connect((err, client, done) => {
const findRelated = itemId => {
  const query1 = {
    text: 'SELECT category_id FROM items where item_id = $1',
    values: [itemId],
  };
  return pool
    .query(query1)
    .then(result => {
      const categoryId = result.rows[0].category_id;
      const query2 = {
        text:
          'SELECT item_id, name, price, rating, numOfRatings, imgUrl FROM items WHERE item_id > $1 and category_id = $2 limit 3',
        values: [itemId, categoryId],
      };
      return pool.query(query2);
    })
    .then(result => result.rows);
};
// });

//CREATE
//TODO use a variable for quantity
const addToCart = (itemId, quantity) => {
  const query = {
    text: 'INSERT INTO cartItems (item_id, quantity) VALUES ($1, $2)',
    values: [itemId, quantity],
  };
  return pool.query(query);
};

//UPDATE
const updateCart = pool.connect((err, client, done) => {
  const query = `UPDATE items SET onlist = $1 WHERE item_id = $2`;
  const params = [false, 9999];
  client.query(query, params, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result.rows[0]);
    }
  });
});

//DELETE
const removeItem = pool.connect((err, client, done) => {
  const query = `DELETE FROM cartItems WHERE item_id = $1`;
  const params = [9998];
  client.query(query, params, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result.rows[0]);
    }
  });
});

module.exports = {
  selectProduct,
  findRelated,
  // removeItem,
  addToCart,
  // updateCart,
};
