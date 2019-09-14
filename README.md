# Recommendations Service

> Displays nearby listings

## Related Projects

  - https://github.com/drop-grav/reservation-module
  - https://github.com/drop-grav/reviews-module
  - https://github.com/drop-grav/gallery-service

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage

> Setup config.js in ./database/

## Requirements

- Node 10.16

## Development

- npm run seed
- npm run build:dev
- npm run start:dev

### Installing Dependencies

From within the root directory:

```sh
npm install
```

## RESTful CRUD API

### Create
- POST /api/listings
- Input: JSON object that matches shape of listings schema
- Status Code: 201

### Read
- GET /api/listings/:id/nearbyPlaces
- Param: id
- Response: Array of JSON listings objects that share the same zone as the specified listing

### Update
- PUT /api/listings/:id
- Param: id
- Inputs: id of listing to be replaced, new JSON listings object

### Delete
- DELETE /api/listings/:id
- Param: id
- Input: id of listing to be deleted

## Schema

### SQL

#### listings
  - id SERIAL PRIMARY KEY,
  - saved_lists_id SMALLINT REFERENCES saved_lists(id),
  - zones_id SMALLINT REFERENCES zones(id),
  - url VARCHAR(100),
  - title VARCHAR(75),
  - city VARCHAR(25),
  - state VARCHAR(15),
  - country VARCHAR(15),
  - plus_verified BOOL,
  - property_type VARCHAR(40),
  - price SMALLINT,
  - average_review FLOAT,
  - total_reviews SMALLINT,
  - about TEXT,
  - the_space TEXT,
  - neighborhood TEXT,

#### saved_lists
  - id SERIAL PRIMARY KEY,
  - name VARCHAR(25),

#### zones
  - id SERIAL PRIMARY KEY,
  - number SMALLINT,

### NoSQL:


#### listings
  -  id int PRIMARY KEY, 
  -  saved_list text,
  -  zone int,
  -  url text,
  -  title text,
  -  city text,
  -  state text,
  -  country text,
  -  plus_verified Boolean,
  -  property_type text,
  -  price int,
  -  average_review decimal,
  -  total_reviews int,
  -  about text,
  -  the_space text,
  -  neighborhood text