var express = require('express');
var router = express.Router();
const csv = require('csvtojson');
var amqp = require('amqplib/callback_api');
const { check, validationResult } = require('express-validator/check');

router.get('/temp', [
  // Validation middleware
  check('days_window').exists().isInt(),
  check('max_temperature').exists().isInt()
], function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() }).end();
  }

  var scriptParameters = [req.query.days_window, req.query.max_temperature]
  // TODO: make address look for env var
  amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel((err, ch) => {
      console.log('creating channel', err)
      const parametersChannel = 'parameters';
      const resultsChannel = 'results';
      ch.assertQueue(parametersChannel, { durable: false });
      ch.assertQueue(resultsChannel, { durable: false });

      ch.sendToQueue(parametersChannel, new Buffer(JSON.stringify(scriptParameters)));
      ch.consume(resultsChannel, msg => {
        // TODO: there's a bug here, the callback can get attached more than once.
        // Which is a hard no.  Learn more of the amqp lib to find out how
        // to code this properly.  Maybe because the connnection isn't closed
        // when a new connection is made?
        console.log('attaching consume() callback')
        payload = JSON.parse(msg.content.toString())
        res.json(payload)
      }, { noAck: true });
    });
    // This probably isn't right.
    setTimeout(() => {
      console.log('closing connection')
      conn.close();
    }, 1000);
  });
});

module.exports = router;
