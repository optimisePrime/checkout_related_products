import http from 'k6/http';

export const options = {
  vus: 300,
  duration: '60s',
  rps: 2000,
};

export default function() {
  const id = Math.floor(Math.random() * 1000000) + 1;

  http.delete(
    `http://ec2-3-16-24-103.us-east-2.compute.amazonaws.com/cart/${id}/`,
  );
}
