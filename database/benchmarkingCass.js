const now = require('performance-now');

const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  keyspace: 'sunchamps_dev',
});
client.connect();

const numQueries = 5;
const start = now();

client
  .execute(
    'SELECT * FROM electronics WHERE item_id IN (1999998, 1999999, 2000000 )',
  )
  .then(
    client.execute(
      'SELECT * FROM electronics WHERE item_id IN (1999995, 1999996, 1999997 )',
    ),
  )
  .then(
    client.execute(
      'SELECT * FROM electronics WHERE item_id IN (1999992, 1999993, 1999994 )',
    ),
  )
  .then(
    client.execute(
      'SELECT * FROM electronics WHERE item_id IN (1999980, 1999981, 1999982 )',
    ),
  )
  .then(
    client.execute(
      'SELECT * FROM electronics WHERE item_id IN (1999983, 1999984, 1999985 )',
    ),
  );

const end = now();

const avgTime = (end - start).toFixed(3) / numQueries;

console.log(avgTime, 'average time per query');
console.log(start.toFixed(3));

console.log((start - end).toFixed(3));
