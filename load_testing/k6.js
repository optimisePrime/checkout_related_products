import http from 'k6/http';
// import { sleep } from 'k6';

export let options = {
  vus: 300,
  duration: '60s',
  rps: 2000,
};

//GET
//use

// export default function() {
//   let item_id;
//   let products = Math.floor(Math.random() * 10) + 1;
//   let notPopular = Math.floor(Math.random() * 9999000) + 1000;

//   if (products > 8) {
//     item_id = notPopular;
//   } else {
//     item_id = Math.floor(Math.random() * 1000) + 1;
//   }
//   http.get(`http://localhost:3002/items/${item_id}`);
//   // sleep(1);
// }

//GET
// /items/:id/related
export default function() {
  let item_id;
  let products = Math.floor(Math.random() * 10) + 1;
  let notPopular = Math.floor(Math.random() * 9999000) + 1000;

  if (products > 8) {
    item_id = notPopular;
  } else {
    item_id = Math.floor(Math.random() * 1000) + 1;
  }
  http.get(`http://localhost:3002/items/${item_id}/related`);
  // sleep(1);
}

//POST
// export default function() {
//   http.post('http://localhost:3002/cart/9999');
//   // sleep(1);
// }

//PATCH Cassandra only TODO
// export default function() {
//   http.patch('items/999/list');
