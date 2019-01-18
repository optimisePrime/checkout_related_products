const express = require('express');

const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool, Client } = require('pg');
const pg = require('pg');
const db = require('../database/indexPostgres.js');

// const pool = new Pool();

// const pool = new Pool({
//   user: 'achou',
//   host: '127.0.0.1',
//   database: 'sunchamps_dev',
//   // password: 'secretpassword',
//   // port: 3211,
// });
// const client = new Client();

app.use(cors());
app.use('/:id', express.static(path.join(__dirname, '/../client/dist')));
app.use(bodyParser.json());

// (itemId: string, inCart: boolean): Promise<Rows>

app.get('/items/:id', (req, res) => {
  db.selectProduct(req.params.id)
    .then(rows => {
      res.send(rows);
    })
    .catch(err => {
      res.send(err);
    });
});

// // add a route to get just the review rating
// app.get('/cart', (req, res) => {
//   pool.connect((err, client, done) => {
//     if (err) throw err;
//     client.query(
//       'SELECT items.item_id, name, price, rating, numOfRatings, imgUrl FROM items INNER JOIN cartItems ON items.item_id = cartItems.item_id',
//       (err, results) => {
//         if (err) {
//           return res.send(err);
//         }
//         res.send(results);
//       },
//     );
//   });
// });

app.get('/items/:id/related', (req, res) => {
  db.findRelated(req.params.id)
    .then(result => {
      console.log(result, 'RESULT SER');
      res.send(result);
    })
    .catch(err => {
      console.log(err, 'ERR SER');
      res.send(err);
    });
  // pool.connect((err, client, done) => {
  //   client.query(
  //     `SELECT relatedItems FROM items where item_id = ${req.params.id}`,
  //     (err, results) => {
  //       if (err) {
  //         return res.send(err);
  //       }
  //       const related = JSON.parse(results[0].relatedItems);
  //       client.query(
  //         `SELECT item_id, name, price, rating, numOfRatings, imgUrl FROM items WHERE item_id = ${
  //           related[0]
  //         } OR item_id = ${related[1]} OR item_id = ${related[2]}`,
  //         (err, results) => {
  //           if (err) {
  //             return res.send(err);
  //           }
  //           res.send(results);
  //         },
  //       );
  //     },
  //   );
  // });
});

app.post('/cart/:id', (req, res) => {
  db.addToCart(req.params.id, req.body.quantity)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      res.send(err);
    });
});

// app.patch('/items/:id/list', (req, res) => {
//   pool.connect((err, client, done) => {
//     client.query(
//       `UPDATE items SET onList = true WHERE item_id = ${req.params.id}`,
//       err => {
//         if (err) {
//           return res.send(err);
//         } else {
//           res.send('updated');
//         }
//       },
//     );
//   });
// });

module.exports = app;
