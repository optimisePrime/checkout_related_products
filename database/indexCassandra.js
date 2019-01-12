/* global console */

const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  // keyspace: 'practice',
});

// item_id int,
// 	name text,
// 	price int,
// 	stock int,
// 	onList boolean,
// 	rating int,
// 	numOfRatings int,
// 	relatedItems text,
// 	imgUrl text,
// 	PRIMARY KEY (item_id)
module.exports = client;
module.exports = client.connect();

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
      'CREATE TABLE amazon.items(item_id int, name text, price decimal, stock int, onList boolean, rating int, numOfRatings int, relatedItems text, imgUrl text, PRIMARY KEY (item_id));',
    );
  })
  .then(() => {
    return client.execute(
      "INSERT INTO amazon.items(item_id, name ,price ,stock ,onList ,rating , numOfRatings, relatedItems , imgUrl) values (2, 'angela', 20, 1, true, 5, 200, '[1, 2, 3]', 'http');",
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
