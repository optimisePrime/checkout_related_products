const express = require('express');

const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('../database/indexCassandra.js');

const port = 3009;

app.listen(port, err => {
  if (err) {
    console.error(err);
  } else {
    console.log(`${port} we hear you!`);
  }
});

app.use(cors());
app.use('/:id', express.static(path.join(__dirname, '/../client/dist')));
app.use(bodyParser.json());

//READ CRUD
app.get('/items/:id', (req, res) => {
  db.getItem(req.params.id)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      res.send(err);
    });
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

//TODO to get item details in the cart
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
        'INSERST INTO cartItems (item_id, name, price, stock, onList, rating, numOfRatings, category_id, imgUrl) VALUES ()',
      );
      res.send(results);
    },
  );
});

//READ - get related products by category id
app.get('/items/:id/related', (req, res) => {
  client.execute(
    `SELECT category_id FROM items where item_id = ${req.params.id}`,
    (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        console.log(result, 'RESULT CAS');
        const catId = result.rows[0].category_id;
        if (req.params.id > 5000000) {
          client.execute(
            `SELECT * FROM items WHERE category_id = ${catId} and item_id < ${
              req.params.id
            } LIMIT 3 ALLOW FILTERING`,
          );
        } else {
          client.execute(
            `SELECT * FROM items WHERE category_id = ${catId} and item_id > ${
              req.params.id
            } LIMIT 3 ALLOW FILTERING`,
            (err, results) => {
              if (err) {
                return res.send(err);
              }
              res.send(results);
            },
          );
        }
      }
    },
  );
});

//CREATE - add to cart
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

//DELETE - remove from cart
app.delete('/cart/:id', (req, res) => {
  client.execute(
    `DELETE FROM cartItems WHERE item_id=${req.params.id}`,
    err => {
      if (err) {
        return res.send(err);
      } else {
        res.send('deleted');
      }
    },
  );
});

module.exports = app;
