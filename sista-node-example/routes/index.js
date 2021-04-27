var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const docs = await global.db.findAll();
    res.render('index', { title: 'Sensors log list', docs });
  } catch (err) {
    next(err);
  }
})

router.get('/add', (req, res, next) => {
  const location = {"lat": "", "lng": ""};
  res.render('add', { title: 'Add new sensor record', doc: {"sensor_id": "", "type": "", "value": "", "location": location, "unix_timestamp": ""}, action: '/add'});
});

router.post('/add', async (req, res, next) => {
  // Acquire values from HTTP command
  const sensor_id = parseInt(req.body.sensor_id);
  const type = req.body.type;
  const value = parseFloat(req.body.value);
  const latitude = parseFloat(req.body.latitude);
  const longitude = parseFloat(req.body.longitude);
  const timestamp = Date.now();
  
  // Insert data into the database
  try {
    const result = await global.db.insert({ "sensor_id": sensor_id, "type": type, "value": value, "location": {"lat": latitude, "lng": longitude}, "unix_timestamp": timestamp});
    console.log(result);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

router.get('/edit/:id', async (req, res, next) => {
  const id = req.params.id;

  try {
    const doc = await global.db.findOne(id);
    res.render('add', { title: 'Edit record', doc, action: '/edit/' + doc._id });
  } catch (err) {
    next(err);
  }
})

router.post('/edit/:id', async (req, res, next) => {
  // Acquire values from HTTP command
  const id = req.params.id;
  const sensor_id = parseInt(req.body.sensor_id);
  const type = req.body.type;
  const value = parseFloat(req.body.value);
  const latitude = parseFloat(req.body.latitude);
  const longitude = parseFloat(req.body.longitude);
  const timestamp = Date.now();
  
  const upd_data = { "sensor_id": sensor_id, "type": type, "value": value, "location": {"lat": latitude, "lng": longitude}, "unix_timestamp": timestamp};

  try {
    const result = await global.db.update(id, upd_data);
    console.log(result);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
})

router.get('/del/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await global.db.deleteOne(id);
    console.log(result);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
})

router.get('/export', async (req, res, next) => {
  console.log("EXPORT");
  const fs = require('fs');

  const docs = await global.db.findAll();
  const data = JSON.stringify(docs);
  res.setHeader('Content-disposition', 'attachment; filename= sensors-log.json');
  res.setHeader('Content-type', 'application/json');
  res.write(data, function (err) {
  res.end();
  });
});

module.exports = router;