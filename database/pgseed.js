const { Client } = require('pg');
const faker = require('faker');
const config = require('./pgconfig');

const zoneCount = 10;
const listingCount = 10;

const generateSavedLists = () => {
  const fakeList = [];
  for (let i = 0; i < 10; i += 1) {
    fakeList.push(`('${faker.lorem.word()}')`);
  }

  return fakeList.join(',');
};

const generateZones = () => {
  const zones = [];
  for (let i = 1; i < zoneCount; i += 1) {
    zones.push(`(${i})`);
  }

  return zones;
};

const listingsSchema = [
  'id SERIAL PRIMARY KEY',
  'id_saved_lists INT REFERENCES saved_lists(id)',
  'id_zones INT REFERENCES zones(id)',
  'url TEXT',
  'title TEXT',
  'city TEXT',
  'state TEXT',
  'country TEXT',
  'plusVerified BOOL',
  'propertyType TEXT',
  'price INT',
  'averageReview INT',
  'totalReviews INT',
  'about TEXT',
  'theSpace TEXT',
  'neighborhood TEXT',
];

const generateListings = () => {
  const listings = [];
  for (let i = 1; i <= listingCount; i += 1) {
    let plusVerified = true;
    if (Math.random() > 0.5) {
      plusVerified = false;
    }

    listings.push(`(
      ${Math.ceil(Math.random() * 10)}, 
      ${Math.ceil(Math.random() * zoneCount)},
      '${`https://drop-grav-recommendations.s3-us-west-1.amazonaws.com/${Math.ceil(Math.random() * 900)}.jpg`}',
      '${faker.lorem.sentence()}',
      '${faker.address.city()}',
      '${faker.address.state()}',
      '${faker.address.country()}',
      ${plusVerified},
      '${faker.lorem.words()}',
      ${Math.floor(Math.random() * 200 + 100)},
      ${Math.random() + 4},
      ${Math.floor(Math.random() * 100 + 100)},
      '${faker.lorem.paragraphs()}',
      '${faker.lorem.paragraphs()
        + faker.lorem.paragraphs()
        + faker.lorem.paragraphs()
        + faker.lorem.paragraphs()}',
      '${faker.lorem.paragraphs()}'
      )`);
  }
  return listings.join(',');
};

let client = new Client(config);
client.connect()
  .then(() => {
    client.query('DROP DATABASE IF EXISTS airbnb');
  })
  .then(() => {
    client.query('CREATE DATABASE airbnb')
      .then(() => {
        console.log('Database created');
        client.end();
      })
      .then(() => {
        config.database = 'airbnb';
        client = new Client(config);
        client.connect();
      })
      .then(() => {
        client.query('CREATE TABLE saved_lists (id SERIAL PRIMARY KEY, name VARCHAR(25))');
      })
      .then(() => {
        client.query(`INSERT INTO saved_lists (name) VALUES ${generateSavedLists()}`);
      })
      .then(() => {
        client.query('CREATE TABLE zones (id SERIAL PRIMARY KEY, number SMALLINT)');
      })
      .then(() => {
        client.query(`INSERT INTO zones (number) VALUES ${generateZones()}`);
      })
      .then(() => {
        client.query(`CREATE TABLE listings (${listingsSchema.join(',')})`);
      })
      .then(() => {
        client.query(`INSERT INTO listings (
          id_saved_lists, 
          id_zones,  
          url,
          title,
          city,
          state,
          country,
          plusVerified,
          propertyType,
          price,
          averageReview,
          totalReviews,
          about,
          theSpace,
          neighborhood ) 
        VALUES ${generateListings()}`)
          .then(() => {
            client.end();
          });
      });
  })
  .catch((err) => {
    console.error('connection error', err.stack);
  });
