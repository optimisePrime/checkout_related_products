# Project Name

## CRUD APIs

- PUT /api/product => creates a product
- GET /api/products => returns all products
- GET /api/product/1 => returns a single product
- POST /api/product/1 => updates a product
- DELETE /api/product/1 => deletes a product

## Related Projects

- https://github.com/optimisePrime/reviews-servicegit
- https://github.com/optimisePrime/summary-nick
- https://github.com/optimisePrime/NavBar

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage

1. To seed the database:
   <!-- - fill create config.js file inside the database directory with the following format:
     ```
     module.exports = {
        host: 'localhost',
        database: 'sunchamps_dev',
        user: *USER*
        password: *PASSWORD*,
      };
     ```
   - login to mysql and run schema.sql to create database
   - npm run seed (node database/seed.js), -->
2. To start the server: npm start (nodemon server/server.js),
3. To compile with webpack: npm run react-dev (webpack -d --watch),

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install -g nodemon
npm install
```
