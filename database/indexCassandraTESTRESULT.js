/* global console */

const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  keyspace: 'sunchamps_dev',
});

// item_id int,
// 	name text,
// 	price int,
// 	stock int,
// 	onList boolean,
// 	rating int,
// 	numOfRatings int,
// 	category_id text,
// 	imgUrl text,
// 	PRIMARY KEY (item_id)
module.exports = client;
// module.exports = client.connect();

client
  .connect()

  .then(() => {
    return client.execute(
      `SELECT category_id FROM items where item_id = ${req.params.id}`,
    );
  })
  // .then(() => {
  //   return client.execute('select * from items WHERE category_id = ');
  // })
  // .then(() => {
  //   return client.execute('SELECT stock FROM amazon.items WHERE item_id=1');
  // })

  //allow filtering and flip >
  .then(result => {
    const catId = result.rows[0].category_id;
    if (req.params.id > 5000000) {
      return client.execute(
        `SELECT * FROM items WHERE category_id = ${catId} and ${item_id} < ${
          req.params.id
        } LIMIT 3 ALLOW FILTERING`,
      );
    } else {
      return client.execute(
        `SELECT * FROM items WHERE category_id = ${catId} and ${item_id} > ${
          req.params.id
        } LIMIT 3 ALLOW FILTERING`,
      );
    }
    client.shutdown();
  })
  .catch(err => {
    console.log(err);
  });

/*DELETE
DELETE FROM amazon.cartItems WHERE item_id = 1;



//UPDATE
UPDATE amazon.cartItems SET quantity = '='2, WHERE item_id = 1;



// const query = 'SELECT name, email FROM users WHERE key = ?';
// const params = ['someone'];

// client.execute(query, params).then(result => {
//   console.log('user with email %s', result.rows[0].email);
// });
*/
