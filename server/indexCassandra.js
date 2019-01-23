// require('newrelic');
const express = require('express');

const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const redis = require('redis');
const db = require('../database/indexCassandra.js');

const REDIS_PORT = process.env.REDIS_PORT;
const client = redis.createClient(REDIS_PORT);

client.on('connect', () => {
  console.log(`connected to redis`);
});
client.on('error', err => {
  console.log(`Error: ${err}`);
});

app.use(cors());

//loader io token
app.get('/loaderio-b24f535227a687fcb663e3078231b154.txt', (req, res) => {
  res.send('loaderio-b24f535227a687fcb663e3078231b154');
});

app.use('/:id', express.static(path.join(__dirname, '/../client/dist')));
app.use(bodyParser.json());

const totalEntries = 5000000;

//READ - get item details
// Redis
/*
app.get('/items/:id', (req, res) => {
  client.get(req.params.id, (err, result) => {
    if (err) {
      res.send(err);
      return;
    }
    if (result !== null) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      console.log('before');
      res.end(result);
      console.log('after');
      // res.send([JSON.parse(result)]);
    } else {
      db.getItem(req.params.id)
        .then(result => {
          result = '[' + JSON.stringify(result) + ']';
          res.writeHead(200, { 'Content-Type': 'application/json' });

          res.end(result);
          client.set(req.params.id, result);
        })
        .catch(err => {
          res.send(err);
        });
    }
  });
});
*/

// no redis

app.get('/items/:id', (req, res) => {
  // console.log(req.params.id);
  db.getItem(req.params.id)
    .then(result => {
      res.send([result]);
    })
    .catch(err => {
      res.send(err);
    });
});

//original READ from cart
//
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

//TODO READ to get item details of product in the cart
//use item_id
app.get('/cart', (req, res) => {
  db.getItem(req.params.id)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      res.send(err);
    });
});

//READ - get related products by category_id
//Redis
/*
app.get('/items/:id/related', (req, res) => {
  client
    .getAsync(req.params.id + '-related')
    .then(relatedIds => {
      if (relatedIds !== null) {
        const rowPromises = JSON.parse(relatedIds).map(id => {
          return client.getAsync(id).then(item => {
            if (item === null) {
              // fetch from db (obj), add to Redis (array)
              return db.getItem(id).then(item => {
                client.setAsync(id, JSON.stringify([item]));
                return item;
              });
            } else {
              // if in Redis, use redis version but parse and extract from index 0
              return JSON.parse(item)[0];
            }
          });
        });
        Promise.all(rowPromises).then(items => {
          res.send(items);
        });
        // res.send(JSON.parse(result));
      } else {
        db.getRelated(req.params.id)
          .then(result => {
            res.send(result);
          })
          .then(() => db.getRelatedIds(req.params.id))
          .then(ids => {
            client.set(req.params.id + '-related', JSON.stringify(ids));
          })
          .catch(err => {
            res.send(err);
          });
      }
    })
    .catch(err => res.send(err));
});
*/
//READ - get related products by category id
// no redis

app.get('/items/:id/related', (req, res) => {
  db.getRelated(req.params.id)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      res.send(err);
    });
});

// item_id, quantity, name ,price ,stock ,onList ,rating , numOfRatings, imgUrl)
//CREATE - add to cart
// Redis
app.post('/cart/:id', (req, res) => {
  client.get(req.params.id, (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result !== null) {
      res.send(JSON.parse(result));
    } else {
      db.getItem(req.params.id).then(result => {
        // console.log(result.onList, ' server RESULT');
        db.addCartItem(
          req.params.id,
          req.body.quantity,
          result.name,
          result.price,
          result.stock,
          result.onList,
          result.rating,
          result.numOfRatings,
          result.imgUrl,
        )
          .then(result => {
            // console.log(result, 'SERVER result BOD');
            res.send(result);
            return result;
          })
          .then(result => {
            client.set(req.params.id, JSON.stringified(result));
          })
          .catch(err => {
            // console.log(err, 'SERVER REQ BOD');
            res.send(err);
          });
      });
    }
  });
});

//UPDATE - TODO no client feature yet
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

//DELETE - remove from cart - TODO no client feature yet
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
