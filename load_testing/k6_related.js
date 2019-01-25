import http from 'k6/http';

export const options = {
  vus: 90,
  duration: '60s',
  rps: 2000,
};

export default function() {
  const products = Math.floor(Math.random() * 10) + 1;
  const notPopular = Math.floor(Math.random() * 9999000) + 1000;
  const id = products > 8 ? notPopular : Math.floor(Math.random() * 1000) + 1;
  http.get(
    `http://ec2-3-16-24-103.us-east-2.compute.amazonaws.com/items/${id}/related`,
  );
}
