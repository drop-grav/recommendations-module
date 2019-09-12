const express = require('express');
const cors = require('cors');
const model = require('../database/index');

const port = 3004;
const app = express();

app.use(require('morgan')('dev'));

app.use(express.json());

app.use(cors());
app.use('/listing/:id', express.static('public'));

app.get('/api/nearbyPlaces/:id', (req, res) => {
  // ranges from 8 - 13
  const randomAmount = Math.floor(Math.random() * 6 + 8);
  model.Place.aggregate([{ $sample: { size: randomAmount } }]).then((result) => {
    res.send(result);
  });
});

app.post('/api/nearbyPlaces', (req, res) => {
  model.Place.create([req.body]);
  res.status(201).send();
});

app.put('/api/nearbyPlaces', (req, res) => {
  //FIXME
  model.Place.update({
    url: 'https://drop-grav-recommendations.s3-us-west-1.amazonaws.com/64.jpg',
  }, { url: 'test.test' });
  res.send();
});

app.delete('/api/nearbyPlaces', (req, res) => {
  model.Place.deleteOne(req.body, () => {
    res.send();
  });
});

app.get('/api/savedlist', (req, res) => {
  model.SavedList.find().exec().then((result) => {
    res.send(result);
  });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening to port ${[port]}`);
});
