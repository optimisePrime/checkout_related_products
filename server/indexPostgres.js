const express = require('express');

const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('../database/indexPostgres.js');

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
      res.send(result);
    })
    .catch(err => {
      res.send(err);
    });
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

app.patch('/cart/:id', (req, res) => {
  db.updateCart(req.params.id, req.body.quantity)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      res.send(err);
    });
});

module.exports = app;
