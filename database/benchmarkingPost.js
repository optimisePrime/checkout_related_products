const now = require('performance-now');
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

const numQueries = 5;
const start = now();

pool.connect(() => {
  client
    .query(
      'SELECT item_id, name, price, rating, numOfRatings, imgUrl FROM items WHERE item_id > 1999990 and category_id = 1 limit 3',
    )
    .then(
      client.query(
        'SELECT item_id, name, price, rating, numOfRatings, imgUrl FROM items WHERE item_id > 1999991 and category_id = 2 limit 3',
      ),
    )
    .then(
      client.query(
        'SELECT item_id, name, price, rating, numOfRatings, imgUrl FROM items WHERE item_id > 1999994 and category_id = 3 limit 3',
      ),
    )
    .then(
      client.query(
        'SELECT item_id, name, price, rating, numOfRatings, imgUrl FROM items WHERE item_id > 1999992 and category_id = 4 limit 3',
      ),
    )
    .then(
      client.query(
        'SELECT item_id, name, price, rating, numOfRatings, imgUrl FROM items WHERE item_id > 1999993 and category_id = 5 limit 3',
      ),
    );
});

const end = now();

const avgTime = (end - start).toFixed(3) / numQueries;

console.log(avgTime, 'average time per query');
console.log(start.toFixed(3));

console.log((start - end).toFixed(3));
