// const app = require('./indexMysql.js');
// const app = require('./indexCassandra.js');
require('newrelic');
const app = require('./indexPostgres.js');

const port = 3002;

app.listen(port, err => {
  if (err) {
    console.error(err);
  } else {
    console.log(`${port} we hear you!`);
  }
});
