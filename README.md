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
- POST /api/nearbyPlaces
- Input: {
    id: Number,
    url: String,
    title: String,
    city: String,
    state: String,
    country: String,
    plusVerified: Boolean,
    propertyType: String,
    price: Number,
    averageReview: Number,
    totalReviews: Number,
    savedList: [String],
    about: String,
    theSpace: String,
    neighborhood: String,
  }

### Read
- GET /api/nearbyPlaces/:id
- Param: id
- Response: {
    id: Number,
    url: String,
    title: String,
    city: String,
    state: String,
    country: String,
    plusVerified: Boolean,
    propertyType: String,
    price: Number,
    averageReview: Number,
    totalReviews: Number,
    savedList: [String],
    about: String,
    theSpace: String,
    neighborhood: String,
  }

### Update
- PUT /api/nearbyPlaces
- Input: {
    filter, doc
  }

### Delete
- DELETE /api/nearbyPlaces
- Input: {
    id: Number,
  }

## Schema
### SQL:

### NoSQL:

#### Place
  - id: Number,
  - listingId: Number,
  - url: String,
  - title: String,
  - city: String,
  - state: String,
  - country: String,
  - plusVerified: Boolean,
  - propertyType: String,
  - price: Number,
  - averageReview: Number,
  - totalReviews: Number,
  - savedList: [String],
  - about: String,
  - theSpace: String,
  - neighborhood: String,

#### SavedList
  - name: String,