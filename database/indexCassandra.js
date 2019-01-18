/* global console */

const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  keyspace: 'sunchamps_dev',
});
client.connect();

const tableName = {
  0: 'electronics',
  1: 'beauty',
  2: 'books',
  3: 'music',
  4: 'arts',
};

const rowsPerTable = 2000000;
const findTable = itemId => tableName[Math.floor(itemId / rowsPerTable)];

const dbToClientRow = row => {
  ['onList', 'imgUrl', 'numOfRatings'].forEach(key => {
    row[key] = row[key.toLowerCase()];
    delete row[key.toLowerCase()];
  });
  return row;
};

//READ
const getItem = itemId => {
  console.log(`${findTable(itemId)}`);
  return client
    .execute(`SELECT * FROM ${findTable(itemId)} WHERE item_id = ${itemId}`)
    .then(result => {
      return dbToClientRow(result.rows[0]);
    });
};

const getCartItem = itemId => {
  return client
    .execute(`SELECT * FROM cartItems WHERE item_id = ${itemId}`)
    .then(result => {
      return dbToClientRow(result.rows[0]);
    });
};

//TODO
// find related products -
// checking category id
// query items table for other products with the same category id
// (itemId: string): Promise<Rows>
////http://localhost:3002/item/9979753/related
const getRelated = itemId => {
  let item1;
  let item2;
  let item3;
  if (JSON.parse(itemId) % 100 > 97) {
    item1 = itemId - 1;
    item2 = item1 - 1;
    item3 = item2 - 1;
  } else {
    item1 = itemId + 1;
    item2 = item1 + 1;
    item3 = item2 + 1;
  }

  return client
    .execute(
      `SELECT * FROM ${findTable(
        itemId,
      )} WHERE item_id IN (${item1}, ${item2}, ${item3} )`,
    )
    .then(result => {
      console.log(result, 'RSULT DB');
      result.rows.map(dbToClientRow);
    })
    .catch(err => {
      console.log(err);
    });
};

//CREATE - add to category table
const addItem = (
  itemId,
  name,
  price,
  stock,
  onList,
  rating,
  numOfRatings,
  imgUrl,
) => {
  return client
    .execute(
      `INSERT INTO ${findTable(
        itemId,
      )}(item_id, name ,price ,stock ,onList ,rating , numofratings, imgurl) values (${itemId}, ${name}, ${price}, ${stock}, ${onList}, ${rating}, ${numOfRatings}, ${imgUrl});`,
    )
    .then(result => {
      return result.rows[0];
    });
};

//TO DO need to copy from category table THEN add to cart, right now req.body is just quantity

const addCartItem = (
  itemId,
  quantity,
  name,
  price,
  stock,
  onlist,
  rating,
  numofratings,
  imgurl,
) => {
  return client
    .execute(
      `INSERT INTO cartItems (item_id, quantity, name ,price ,stock ,onlist ,rating , numofratings, imgurl) VALUES (${itemId}, ${quantity}, ${name}, ${price}, ${stock}, ${onlist}, ${rating}, ${numofratings}, ${imgurl})`,
    )
    .then(result => {
      // return result.rows[0];
      const row = result.rows[0];
      ['onList', 'imgUrl', 'numOfRatings'].forEach(key => {
        row[key] = row[key.toLowerCase()];
        delete row[key.toLowerCase()];
      });

      return row;
    });
};

// DELETE
const deleteItem = itemId => {
  return client
    .execute(`DELETE FROM ${findTable(itemId)} WHERE item_id=${itemId}`)
    .then(result => {
      return result.rows[0];
    });
};

const deleteCartItem = itemId => {
  return client.execute(
    `DELETE FROM cartItems WHERE item_id=${itemId}`.then(result => {
      return result.rows[0];
    }),
  );
};

//UPDATE
const updateItem = itemId => {
  return client
    .execute(
      `UPDATE ${findTable(
        itemId,
      )} SET onList = false WHERE item_id = ${itemId}`,
    )
    .then(result => {
      return result.rows[0];
    });
};

const updateCartItem = (itemId, quantity) => {
  return client
    .execute(
      `UPDATE cartItems SET quantity = ${quantity} WHERE item_id = ${itemId}`,
    )
    .then(result => {
      return result.rows[0];
    });
};

module.exports = {
  getItem,
  getCartItem,
  getRelated,
  addItem,
  addCartItem,
  deleteItem,
  deleteCartItem,
  updateItem,
  updateCartItem,
  findTable,
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
      "INSERT INTO items(item_id, name ,price ,stock ,onList ,rating , numOfRatings, imgUrl) values (2, 'angela', 20, 1, true, 5, 200, 'http');",
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
