require('newrelic');
const express = require('express');
const cors = require('cors');
const model = require('../database/index');

const port = 3004;
const app = express();

app.use(require('morgan')('dev'));

app.use(express.json());

app.use(cors());
app.use('/listing/:id', express.static('public'));

app.get('/api/listings/:id/nearby-listings', (req, res) => {
  model.getZone(req.params.id)
    .then((result) => {
      model.getNearbyListings(result.rows[0].zone)
        .then((listings) => {
          res.send(listings.rows);
        });
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

app.get('/api/test', (req, res) => {
  model.getZone(47803)
    .then((result) => {
      res.send(result);
    });
});

app.post('/api/listings', (req, res) => {
  model.addListing()
    .then(() => {
      res.sendStatus(201);
    });
});

app.delete('/api/listings', (req, res) => {
  model.deleteListing()
    .then(() => {
      res.send('Successfully deleted');
    });
});

app.get('/api/saved-lists/', (req, res) => {
  model.getSavedLists()
    .then((savedLists) => {
      res.send(savedLists.rows);
    });
});

app.post('/api/saved-lists/', (req, res) => {
  model.addSavedList(req.body.saved_list_name)
    .then(() => {
      res.sendStatus(201);
    });
});

app.get('/api/saved-lists/:name', (req, res) => {
  model.getListingsInSavedList(req.params.name)
    .then((listings) => {
      res.send(listings.rows);
    });
});

app.get('/api/listings/:id/saved-lists', (req, res) => {
  model.getSavedListsInListing(req.params.id)
    .then((savedLists) => {
      res.send(savedLists.rows);
    });
});

app.post('/api/saved-lists/:name', (req, res) => {
  model.addToSavedList1(req.params.name, req.body.cassId)
    .then(() => {
      model.addToSavedList2(req.body.cassId, req.params.name)
        .then(() => {
          res.sendStatus(201);
        });
    });
});

// app.post('/api/nearbyPlaces', (req, res) => {
//   model.Place.create([req.body]);
//   res.status(201).send();
// });

// app.put('/api/nearbyPlaces', (req, res) => {
//   //FIXME
//   model.Place.update({
//     url: 'https://drop-grav-recommendations.s3-us-west-1.amazonaws.com/64.jpg',
//   }, { url: 'test.test' });
//   res.send();
// });

// app.delete('/api/nearbyPlaces', (req, res) => {
//   model.Place.deleteOne(req.body, () => {
//     res.send();
//   });
// });

// app.get('/api/savedlist', (req, res) => {
//   model.getSavedLists()
//     .then((result) => {
//       res.send(result.rows);
//     });
// });

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening to port ${[port]}`);
});
