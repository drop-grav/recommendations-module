const cassandra = require('cassandra-driver');
const faker = require('faker');

const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1' });
const fs = require('fs');

const listingCount = 1000;
const zoneCount = 10;

const fakeList = [];
for (let i = 0; i < 10; i += 1) {
  fakeList.push(faker.lorem.word());
}

const generateListings = () => {
  const listings = [];
  for (let i = 1; i <= listingCount; i += 1) {
    let plusVerified = true;
    if (Math.random() > 0.5) {
      plusVerified = false;
    }
    
    let arr = [
      i,
      fakeList[Math.floor(Math.random() * 10)],
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
  let csv = `id, saved_list, zone, url, title, city, state, country, plus_verified, property_type, price, average_review, total_reviews, about, the_space, neighborhood
  ${listings.join('\n')}`;
  fs.writeFile('./test.csv', csv, (err, res) => {
    if (err) {
      return console.error(err);
    }
  
    return console.log('successfuly wrote file');
  });
};

// generateListings();


client.connect((err) => {
  if (err) {
    return console.error(err);
  }
  const query = `CREATE KEYSPACE airbnb_by_id WITH REPLICATION = {
    'class' : 'SimpleStrategy',
    'replication_factor' : 1
  };`;
  
  const query2 = `CREATE TABLE airbnb_by_id.listings ( 
    cassId int, 
    id_saved_lists int,
    saved_list_name text,
    zone int,
    url text,
    title text,
    city text,
    state text,
    country text,
    plus_verified Boolean,
    property_type text,
    price int,
    average_review decimal,
    total_reviews int,
    about text,
    the_space text,
    neighborhood text,
    PRIMARY KEY (zone, cassId)
    )`;

  const query4 = `CREATE TABLE airbnb_by_id.listings (
    cassId int,
    zone int,
    PRIMARY KEY (cassId)
  )`;
  
  const query3 = `COPY airbnb_by_id.listings (cassId, id_saved_lists, saved_list_name, zone, url, title, city, state, country, plus_verified, property_type, price, average_review, total_reviews, about, the_space, neighborhood) FROM '/Users/howard/Documents/sdc/recommendations-module/output.csv' WITH HEADER = TRUE;`;
  

  // const query3 = 'INSERT INTO test.test ( id, name ) VALUES (uuid(), \'Howard\');';
  // const query4 = 'INSERT INTO test.test ( id, name ) VALUES (uuid(), \'Bob\');';


  client.execute('DROP KEYSPACE IF EXISTS airbnb_by_id')
    .then(() => {
      client.execute(query)
        .then(() => {
          client.execute('USE airbnb_by_id');
        })
        .then(() => {
          client.execute(query4);
        });
    //       .then(() => {
    //         client.execute(query4);
    //       });
    //     });
    });
});


