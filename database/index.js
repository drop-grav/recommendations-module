const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['18.189.170.205', '18.224.51.80', '18.216.17.207'], localDataCenter: 'us-east-2' });
// const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1' });
client.connect((err) => {
  if (err) {
    return console.error(err);
  }

  console.log('connected to Cassandra');
});

const getZoneQuery = 'SELECT zone FROM airbnb.listings_by_id WHERE cassId = ?';
const getNearbyListingsQuery = 'SELECT * FROM airbnb.listings_by_zone WHERE zone = ? LIMIT 20';

module.exports.getZone = (id) => {
  return client.execute(getZoneQuery, [id], { prepare: true });
};

module.exports.getNearbyListings = (zone) => {
  return client.execute(getNearbyListingsQuery, [zone], { prepare: true });
};

module.exports.addListing = () => {
  return client.execute('INSERT INTO airbnb.listings_by_zone (cassid, zone) VALUES (10000001, 10001);');
}

module.exports.deleteListing = () => {
  return client.execute('DELETE FROM airbnb.listings_by_zone WHERE zone = 10001;');
}

module.exports.getSavedLists = () => {
  return client.execute(`SELECT * FROM airbnb.saved_lists`);
};

module.exports.addSavedList = (name) => {
  return client.execute(`INSERT INTO airbnb.saved_lists (saved_list_name) VALUES ('${name}')`);
}

module.exports.addToSavedList1 = (name, cassId) => {
  return client.execute(`INSERT INTO airbnb.saved_lists_by_listings (saved_list_name, cassId) VALUES ('${name}', ${cassId})`);
}

module.exports.addToSavedList2 = (cassId, name) => {
  return client.execute(`INSERT INTO airbnb.listings_by_saved_lists (cassId, saved_list_name) VALUES (${cassId}, '${name}')`);
}

module.exports.getListingsInSavedList = (name) => {
  return client.execute(`SELECT * FROM airbnb.saved_lists_by_listings WHERE saved_list_name = '${name}'`);
}

module.exports.getSavedListsInListing = (cassId) => {
  return client.execute(`SELECT * FROM airbnb.listings_by_saved_lists WHERE cassId = ${cassId}`);
}
// 

// const mongoose = require('mongoose');
// const config = require('./config');

// const login = config.user ? `${config.user}:${config.password}@` : '';

// const db = mongoose.connection;

// mongoose.connect(`mongodb://${config.host}/airbnb`, {
//   useNewUrlParser: true,
// });

// const placeSchema = new mongoose.Schema({
//   id: Number,
//   listingId: Number,
//   url: String,
//   title: String,
//   city: String,
//   state: String,
//   country: String,
//   plusVerified: Boolean,
//   propertyType: String,
//   price: Number,
//   averageReview: Number,
//   totalReviews: Number,
//   savedList: [String],
//   about: String,
//   theSpace: String,
//   neighborhood: String,
// });

// const Place = mongoose.model('Places', placeSchema);

// const savedListSchema = new mongoose.Schema({
//   name: String,
// });

// const SavedList = mongoose.model('SavedList', savedListSchema);

// module.exports = {
//   db,
//   SavedList,
//   Place,
// };
