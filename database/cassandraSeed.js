const cassandra = require('cassandra-driver');
const faker = require('faker');

const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1' });
const fs = require('fs');

const listingCount = 10;
const zoneCount = 10;
// let arr = [];
// let arr1 = [1, 'random'];
// let arr2 = [2, 'random'];
// arr.push(arr1.join(','));
// arr.push(arr2.join(','));


const generateListings = () => {
  const listings = [];
  for (let i = 1; i <= 10; i += 1) {
    let plusVerified = true;
    if (Math.random() > 0.5) {
      plusVerified = false;
    }
    
    let arr = [
      i,
      'random',
      Math.ceil(Math.random() * zoneCount),
      `https://drop-grav-recommendations.s3-us-west-1.amazonaws.com/${Math.ceil(Math.random() * 900)}.jpg`,
      faker.lorem.sentence(),
      faker.address.city(),
      faker.address.state(),
      faker.address.country(),
      plusVerified,
      faker.lorem.words(),
      Math.floor(Math.random() * 200 + 100),
      Math.random() + 4,
      Math.floor(Math.random() * 100 + 100),
      "\"" + faker.lorem.paragraphs() + "\"",
      "\"" + faker.lorem.paragraphs()
        + faker.lorem.paragraphs()
        + faker.lorem.paragraphs()
        + faker.lorem.paragraphs() + "\"",
      "\"" + faker.lorem.paragraphs() + "\"",
    ];

    listings.push(arr.join(','));
  }
  let csv = `id, saved_list, zone, url, title, city, state, country, plusVerified, propertyType, price, averageReview, totalReviews, about, theSpace, neighborhood
  ${listings.join('\n')}`;
  fs.writeFile('./test.csv', csv, (err, res) => {
    if (err) {
      return console.error(err);
    }
  
    return console.log('successfuly wrote file');
  });
};

generateListings();


client.connect((err) => {
  if (err) {
    return console.error(err);
  }
  const query = `CREATE KEYSPACE airbnb WITH REPLICATION = {
    'class' : 'SimpleStrategy',
    'replication_factor' : 1
  };`;
  
  const query2 = `CREATE TABLE airbnb.listings ( 
    id int PRIMARY KEY, 
    saved_list text,
    zone int,
    url text,
    title text,
    city text,
    state text,
    country text,
    plusVerified Boolean,
    propertyType text,
    price int,
    averageReview decimal,
    totalReviews int,
    about text,
    theSpace text,
    neighborhood text
    )`;
  
  const query3 = `COPY airbnb.listings (id, saved_list, zone, url, title, city, state, country, plusVerified, propertyType, price, averageReview, totalReviews, about, theSpace, neighborhood) FROM '../../../../howard/Documents/sdc/recommendations-module/test.csv' WITH HEADER = TRUE;`;
  

  // const query3 = 'INSERT INTO test.test ( id, name ) VALUES (uuid(), \'Howard\');';
  // const query4 = 'INSERT INTO test.test ( id, name ) VALUES (uuid(), \'Bob\');';


  client.execute('DROP KEYSPACE IF EXISTS airbnb')
    .then(() => {
      client.execute(query)
        .then(() => {
          client.execute('USE airbnb');
        })
        .then(() => {
          client.execute(query2);
        });
    //       .then(() => {
    //         client.execute(query4);
    //       });
    //     });
    });
});


