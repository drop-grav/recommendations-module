const faker = require('faker');
const model = require('./index.js');

const fakeList = [];

model.db.once('open', () => {
  // delete all collections
  const deletePromises = [
    model.db.dropCollection('places').catch(() => {

    }),
    model.db.dropCollection('savedlists').catch(() => {

    }),
  ];

  // once all collectiosn deleted, generate data
  Promise.all(deletePromises).then(() => {
    const savedLists = [];
    for (let i = 0; i < 10; i += 1) {
      fakeList.push(faker.lorem.word());
      const saveListName = {
        name: fakeList[i],
      };
      savedLists.push(saveListName);
    }
    return model.SavedList.create(savedLists);
  }).then(() => {
    const newPlaces = [];
    for (let i = 1; i < 101; i += 1) {
      // randomly chooses true or false
      let plusVerified = true;
      if (Math.random() > 0.5) {
        plusVerified = false;
      }

      // randomly choost savedList
      const savedList = fakeList.slice(Math.floor(Math.random() * 20));

      // generates a places data
      const newPlace = {
        id: i,
        url: `https://drop-grav-recommendations.s3-us-west-1.amazonaws.com/${i}.jpg`,
        title: faker.lorem.sentence(),
        city: faker.address.city(),
        state: faker.address.state(),
        country: faker.address.country(),
        plusVerified,
        propertyType: faker.lorem.words(),
        price: Math.floor(Math.random() * 200 + 100),
        averageReview: Math.random() + 4,
        totalReviews: Math.floor(Math.random() * 100 + 100),
        savedList,
        about: faker.lorem.paragraphs(),
        theSpace: faker.lorem.paragraphs()
          + faker.lorem.paragraphs()
          + faker.lorem.paragraphs()
          + faker.lorem.paragraphs(),
        neighborhood: faker.lorem.paragraphs(),
      };
      newPlaces.push(newPlace);
    }

    return model.Place.create(newPlaces);
  }).then(() => {
    console.log('Seeding Done');
    process.exit();
  });
});
