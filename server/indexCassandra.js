const express = require('express');

const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const client = require('../database/indexCassandra.js');

app.use(cors());
app.use('/:id', express.static(path.join(__dirname, '/../client/dist')));
app.use(bodyParser.json());

//READ CRUD
app.get('/items/:id', (req, res) => {
  client.execute(
    `SELECT * FROM items WHERE item_id = ${req.params.id}`,
    (err, results) => {
      if (err) {
        return res.send(err);
      }
      res.send(results);
    },
  );
});
// add a route to get just the review rating

//READ
// app.get('/cart', (req, res) => {
//   client.execute(
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
app.get('/cart', (req, res) => {
  client.execute(
    `SELECT item_id, name, price, rating, numOfRatings, imgUrl FROM items WHERE item_id = ${
      req.params.id
    }`,
    (err, results) => {
      if (err) {
        return res.send(err);
      }
      client.execute(
        'INSERST INTO cartItems (item_id, name, price, stock, onList, rating, numOfRatings, relatedItems, imgUrl) VALUES ()',
      );
      res.send(results);
    },
  );
});

//READ - relatedItems
app.get('/items/:id/related', (req, res) => {
  client.execute(
    `SELECT relatedItems FROM items where item_id = ${req.params.id}`,
    (err, results) => {
      if (err) {
        return res.send(err);
      }
      let related = JSON.parse(results[0].relatedItems);

      client.execute(
        `SELECT item_id, name, price, rating, numOfRatings, imgUrl FROM items WHERE item_id = ${
          related[0]
        } OR item_id = ${related[1]} OR item_id = ${related[2]}`,
        (err, results) => {
          if (err) {
            return res.send(err);
          }
          res.send(results);
        },
      );
    },
  );
});

//CREATE
app.post('/cart/:id', (req, res) => {
  client.execute(
    `INSERT INTO cartItems (item_id, quantity) values (${req.params.id}, ${
      req.body.quantity
    })`,
    err => {
      if (err) {
        return res.send(err);
      }
      res.send();
    },
  );
});

//UPDATE
app.patch('/items/:id/list', (req, res) => {
  client.execute(
    `UPDATE items SET onList = true WHERE item_id = ${req.params.id}`,
    err => {
      if (err) {
        return res.send(err);
      } else {
        res.send('updated');
      }
    },
  );
});

module.exports = app;
