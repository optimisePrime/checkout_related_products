// require('newrelic');
const express = require('express');

const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const redis = require('redis');
const db = require('../database/indexCassandra.js');

const useRedis = process.env.USE_REDIS === 'true';
console.log(`Using Redis: ${useRedis}`);

// change protocol and port for Redis EC2
const client = useRedis
  ? redis.createClient(
      'redis://ec2-3-16-36-188.us-east-2.compute.amazonaws.com:6379',
    )
  : null;

if (useRedis) {
  client.on('connect', () => {
    console.log('connected to redis');
  });
  client.on('error', err => {
    console.log(`Error: ${err}`);
  });
}

app.use(cors());

// loader io token
app.get('/loaderio-b24f535227a687fcb663e3078231b154.txt', (req, res) => {
  res.send('loaderio-b24f535227a687fcb663e3078231b154');
});

app.use('/:id', express.static(path.join(__dirname, '/../client/dist')));
app.use(bodyParser.json());

//READ - get item details

if (useRedis) {
  app.get('/items/:id', (req, res) => {
    client.get(req.params.id, (err, result) => {
      if (err) {
        console.log(err, `Error getting item ${req.params.id} from Redis`);
        res.status(500).end(err);
        return;
      }
      if (result !== null) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(result);
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
            console.log(err, `Error getting item ${req.params.id}`);
            res.status(500).send(err);
          });
      }
    });
  });
} else {
  app.get('/items/:id', (req, res) => {
    // console.log(req.params.id);
    db.getItem(req.params.id)
      .then(result => {
        res.send([result]);
      })
      .catch(err => {
        console.log(err, `Error getting item ${req.params.id}`);
        res.status(500).send(err);
      });
  });
}

app.get('/cart/list', (req, res) => {
  db.getCartItems()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err, 'Error getting cart items');
      res.status(500).send(err);
    });
});

// READ - get related products by category_id
if (useRedis) {
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
              console.log(err, 'Error getting items');
              res.status(500).send(err);
            });
        }
      })
      .catch(err => {
        console.log(err, 'error getting related');
        res.status(500).send(err);
      });
  });
} else {
  app.get('/items/:id/related', (req, res) => {
    db.getRelated(req.params.id)
      .then(result => {
        res.send(result);
      })
      .catch(err => {
        console.log(err, 'Error getting related items');
        res.status(500).send(err);
      });
  });
}

// CREATE - add to cart
if (useRedis) {
  app.post('/cart/:id', (req, res) => {
    client
      .getAsync(req.params.id)
      .then(result => {
        return result !== null
          ? JSON.parse(result)[0]
          : db.getItem(req.params.id);
      })
      .then(item => {
        return db.addCartItem(
          req.params.id,
          req.body.quantity,
          item.name,
          item.price,
          item.stock,
          item.onList,
          item.rating,
          item.numOfRatings,
          item.imgUrl,
        );
      })
      .then(result => {
        res.send(result);
      })
      .catch(err => {
        console.log(err, 'ERROR adding to cart');
        res.status(500).send(err);
      });
  });
} else {
  app.post('/cart/:id', (req, res) => {
    db.getItem(req.params.id).then(result => {
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
          res.send(result);
        })
        .catch(err => {
          console.log(err, 'Error adding to cart');
          res.status(500).send(err);
        });
    });
  });
}
// UPDATE - update cart, no client feature
app.patch('/cart/:id', (req, res) => {
  db.updateCartItem(req.params.id, req.body)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err, 'Error updating cart');
      res.status(500).send(err);
    });
});

// DELETE - remove from cart, no client feature
app.delete('/cart/:id', (req, res) => {
  db.deleteCartItem(req.params.id)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err, 'Error deleting from cart');
      res.status(500).send(err);
    });
});

module.exports = app;
