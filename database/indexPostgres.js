const pg = require('pg');
const { Pool, Client } = require('pg');
const connectionString =
  process.env.DATABASE_URL || 'postgres://localhost:5432/';

const client = pg.Client(connectionString);

const pool = new Pool({
  user: 'achou',
  host: 'localhost',
  database: 'sunchamps_dev',
  port: 5432,
});
// const client = new Client();

//READ
const selectProduct = pool.connect((err, client, done) => {
  if (err) throw err;
  const query = 'SELECT * FROM items WHERE item_id = $1';
  const params = [9999];
  client.query(query, params, (err, result) => {
    done();
    if (err) {
      console.log(err);
    } else {
      console.log(result.rows[0]);
    }
  });
});

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

pool.connect((err, client, done) => {
  const query1 = {
    text: 'SELECT relatedItems FROM items where item_id = $1',
    values: [100],
  };
  client.query(query1, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result.rows[0]);
    }
    const related = JSON.parse(result.rows[0].relatedItems);

    const query2 = {
      text:
        'SELECT item_id, name, price, rating, numOfRatings, imgUrl FROM items WHERE item_id = $1 OR item_id = $2 OR item_id = $3',
      values: [related[0], related[1], related[2]],
    };

    client.query(query2, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result.rows[0]);
    });
  });
});

//CREATE
//TODO use a variable for quantity
const addToCart = pool.connect((err, client, done) => {
  const query = {
    text: 'INSERT INTO cartItems (item_id, quantity) VALUES ($1, $2)',
    values: [9998, 2],
  };
  client.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result.rows[0]);
    }
  });
});

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
