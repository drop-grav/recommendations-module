const { Client } = require('pg');
const faker = require('faker');
const config = require('./pgconfig');
const fs = require('fs');

const zoneCount = 10000;
const listingCount = 10000;
// const writeStream = fs.createWriteStream('./output.csv');

let id = 1;
const fakeList = [];
for (let i = 0; i < 10; i += 1) {
  fakeList.push(faker.lorem.word());
}

const savedListQuery = fakeList.map((list) => `('${list}')`).join(',');

const generateListings = () => {
  const listings = [];
  for (let i = 1; i <= listingCount; i += 1) {
    let plusVerified = true;
    if (Math.random() > 0.5) {
      plusVerified = false;
    }
    
    const listing = [
      id,
      Math.ceil(Math.random() * 10), 
      "\"" + fakeList[Math.floor(Math.random() * 10)] + "\"",
      Math.ceil(Math.random() * zoneCount),
      `https://drop-grav-recommendations.s3-us-west-1.amazonaws.com/${Math.ceil(Math.random() * 900)}.jpg`,
      "\"" + faker.lorem.sentence() + "\"",
      "\"" + faker.address.city() + "\"",
      "\"" + faker.address.state() + "\"",
      "\"" + faker.address.country() + "\"",
      plusVerified,
      "\"" + faker.lorem.words() + "\"",
      Math.floor(Math.random() * 200 + 100),
      Math.random() + 4,
      Math.floor(Math.random() * 100 + 100),
      "\"" + faker.lorem.sentence() + "\"",
      "\"" + faker.lorem.sentence() + "\"",
      "\"" + faker.lorem.sentence() + "\"",
    ];
    id++;
    listings.push(`${listing.join(',') + '\n'}`);
  }
  writeStream.write(listings.join(''));
};

// writeStream.once('open', () => {
//   writeStream.write('cassId, id_saved_lists, saved_list_name, id_zones, url, title, city, state, country, plus_verified, property_type, price, average_review, total_reviews, about, the_space, neighborhood \n');
//   for (let i = 0; i < 1000; i++) {
//     console.log(i);
//     generateListings();
//   }
// });

const importQuery = `\copy listings(cassId, id_saved_lists, saved_list_name, id_zones, url, title, city, state, country, plus_verified, property_type, price, average_review, total_reviews, about, the_space, neighborhood) FROM '/Users/howard/Documents/sdc/recommendations-module/output.csv' DELIMITER ',' CSV HEADER;`;



const generateZones = () => {
  const zones = [];
  for (let i = 1; i <= zoneCount; i += 1) {
    zones.push(`(${i})`);
  }

  return zones;
};

const listingsSchema = [
  'id SERIAL PRIMARY KEY',
  'cassId INT',
  'id_saved_lists SMALLINT REFERENCES saved_lists(id)',
  'saved_list_name VARCHAR(25)',
  'id_zones SMALLINT REFERENCES zones(id)',
  'url VARCHAR(100)',
  'title VARCHAR(150)',
  'city VARCHAR(60)',
  'state VARCHAR(15)',
  'country VARCHAR(60)',
  'plus_verified BOOL',
  'property_type VARCHAR(60)',
  'price SMALLINT',
  'average_review FLOAT(1)',
  'total_reviews SMALLINT',
  'about TEXT',
  'the_space TEXT',
  'neighborhood TEXT',
];


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
        client.query(`INSERT INTO saved_lists (name) VALUES ${savedListQuery}`);
      })
      .then(() => {
        client.query('CREATE TABLE zones (id SERIAL PRIMARY KEY, number SMALLINT)');
      })
      .then(() => {
        client.query(`INSERT INTO zones (number) VALUES ${generateZones()}`);
      })
      .then(() => {
        client.query(`CREATE TABLE listings (${listingsSchema.join(',')})`);
      });
      // .then(() => {
      //   client.query(`INSERT INTO listings (
      //     id_saved_lists, 
      //     id_zones,  
      //     url,
      //     title,
      //     city,
      //     state,
      //     country,
      //     plus_verified,
      //     property_type,
      //     price,
      //     average_review,
      //     total_reviews,
      //     about,
      //     the_space,
      //     neighborhood ) 
      //   VALUES ${generateListings()}`)
      //     .then(() => {
      //       client.end();
      //     });
    })
  .catch((err) => {
    console.error('connection error', err.stack);
  });
