/* global console */

const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  keyspace: 'sunchamps_dev',
});
client.connect();

//READ
const getItem = itemId => {
  return client
    .execute(`SELECT * FROM items WHERE item_id = ${itemId}`)
    .then(result => {
      return result.rows[0];
    });
};

//CREATE
const addItem = (
  itemId,
  name,
  price,
  stock,
  onList,
  rating,
  numOfRatings,
  category_id,
  imgUrl,
) => {
  return client
    .execute(
      `INSERT INTO amazon.items(item_id, name ,price ,stock ,onList ,rating , numOfRatings, category_id , imgUrl) values (${item_id}, ${name}, ${price}, ${stock}, ${onList}, ${rating}, ${numOfRatings}, ${category_id}, ${imgUrl});`,
    )
    .then(result => {
      return result.rows[0];
    });
};

// DELETE

const deleteItem = itemId => {
  return client.execute(
    `DELETE FROM cartItems WHERE item_id=${itemId}`.then(result => {
      return result.rows[0];
    }),
  );
};

//UPDATE
const updateCart = itemId => {
  return client
    .execute(`UPDATE items SET onList = false WHERE item_id = ${item_id}`)
    .then(result => {
      return result.rows[0];
    });
};

module.exports = {
  getItem,
  addItem,
  deleteItem,
  updateCart,
};

/*
client
  .connect()
  .then(() => {
    return client.execute('DROP KEYSPACE if exists amazon;');
  })
  .then(() => {
    return client.execute(
      "CREATE KEYSPACE amazon WITH REPLICATION = {'class' : 'SimpleStrategy', 'replication_factor': 1};",
    );
  })
  .then(() => {
    return client.execute(
      'CREATE TABLE amazon.items(item_id int, name text, price decimal, stock int, onList boolean, rating int, numOfRatings int, category_id text, imgUrl text, PRIMARY KEY (item_id));',
    );
  })
  .then(() => {
    return client.execute(
      "INSERT INTO amazon.items(item_id, name ,price ,stock ,onList ,rating , numOfRatings, category_id , imgUrl) values (2, 'angela', 20, 1, true, 5, 200, '[1, 2, 3]', 'http');",
    );
  })
  .then(() => {
    return client.execute('select * from amazon.items');
  })
  .then(() => {
    return client.execute('SELECT stock FROM amazon.items WHERE item_id=1');
  })
  .then(result => {
    console.log(result.rows[0]);
    client.shutdown();
  })
  .catch(err => {
    console.log(err);
  });





//UPDATE
UPDATE amazon.cartItems SET quantity = '='2, WHERE item_id = 1;



// const query = 'SELECT name, email FROM users WHERE key = ?';
// const params = ['someone'];

// client.execute(query, params).then(result => {
//   console.log('user with email %s', result.rows[0].email);
// });
*/
