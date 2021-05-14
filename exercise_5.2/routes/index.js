var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    res.render('index');
  } catch (err) {
    next(err);
  }
})

/* GET List Sensors page. */
router.get('/list', async (req, res, next) => {
  try {
    const docs = await global.db.findAll();
    res.render('list', { title: "Precision agriculture data logger example", subtitle: 'The sensors log list is shown below. It\'s possible to edit/delete records and add new ones.', docs });
  } catch (err) {
    next(err);
  }
})

router.get('/add', (req, res, next) => {
  const location = {"lat": "", "lng": ""};
  res.render('add', { title: 'Add new sensor record', subtitle: "", doc: {"sensor_id": "", "type": "", "value": "", "location": location, "unix_timestamp": ""}, action: '/add'});
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
    res.redirect('/list');
  } catch (err) {
    next(err);
  }
});

router.get('/edit/:id', async (req, res, next) => {
  const id = req.params.id;

  try {
    const doc = await global.db.findOne(id);
    res.render('add', { title: 'Edit record', subtitle: "", doc, action: '/edit/' + doc._id });
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
    res.redirect('/list');
  } catch (err) {
    next(err);
  }
})

router.get('/del/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await global.db.deleteOne(id);
    console.log(result);
    res.redirect('/list');
  } catch (err) {
    next(err);
  }
})

router.get('/export', async (req, res, next) => {
  console.log("EXPORT");
  const fs = require('fs');

  try {
    const docs = await global.db.findAll();
    const data = JSON.stringify(docs);
    res.setHeader('Content-disposition', 'attachment; filename= sensors-log.json');
    res.setHeader('Content-type', 'application/json');
    res.write(data, function (err) {
      res.status(200).end();
    }); 
  } catch (error) {
    res.status(500).send({ error: err })    
  }
});

router.post('/import', async (req, res, next) => {
  
  // Acquire values from HTTP command
  console.log(req.body);      // your JSON data

  try {
    req.body.sensors.forEach(e => {
      console.log(e);
      global.db.insert({ "sensor_id": e.sensor_id, "type": e.type, "value": e.value, "location": {"lat": e.location.latitude, "lng": e.location.longitude}, "unix_timestamp": e.timestamp});
    });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send({ error: err })
  }
});

module.exports = router;