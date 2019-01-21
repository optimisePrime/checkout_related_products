require('newrelic');
const Promise = require('bluebird');
Promise.promisifyAll(require('redis'));
// const app = require('./indexMysql.js');
const app = require('./indexCassandra.js');
// const app = require('./indexPostgres.js');

const port = 3002;

app.listen(port, err => {
  if (err) {
    console.error(err);
  } else {
    console.log(`${port} we hear you!`);
  }
});
