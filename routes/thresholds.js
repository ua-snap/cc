var express = require('express');
var router = express.Router();
const csv = require('csvtojson');

var parsedTemps = {};

router.get('/temp', function(req, res, next) {
  csv()
    .fromFile('./data/WRF_extract_GFDL_1970-2100_FAI.csv')
    .on('json', data => {
      parsedTemps[data.time] = {
        min: Math.round(data.min * 100) / 100,
        max: Math.round(data.max * 100) / 100
      }
    })
    .on('error', (err) => {
      throw err;
    })
    .on('done', () => {
      extractThresholds(parsedTemps, -100, -30)
      res.json({});
    });
});

function extractThresholds(temps, min, max, duration) {
  for (const date in temps) {
    if (temps[date].min >= min && temps[date].max <= max) {
      console.log(date, temps[date].min, temps[date].max)
    }
  }
}

module.exports = router;
