var express = require('express');
var router = express.Router();
var HttpStatus = require('http-status-codes');

// Message broker library.  We use RabbitMQ on the backend.
var amqp = require('amqplib');

// Validation library for incoming parameters.  Always check!
const { check, validationResult } = require('express-validator/check');

// Wrapper to set up the connection/channel/queues, send data,
// and attach a callback to be executed when the data returns.
// The connection is closed after the callback executes.
function setupConnection(callback, scriptParameters) {
  // TODO: make address look for env var
  amqp.connect('amqp://localhost').then(connection => {
    connection.createChannel().then(channel => {
      // Durable: False matches the Python default.  Means that the
      // queue won't survive a RabbitMQ server restart.
      channel.assertQueue('parameters', { durable: false });
      channel.assertQueue('results', { durable: false });
      channel.sendToQueue('parameters', new Buffer(JSON.stringify(scriptParameters)));
      channel.consume('results', msg => {
        callback(msg)
        connection.close()
      }, { noAck: true })
    })
  })
}

router.get('/temp', [
  // Validation middleware
  check('days_window').exists().isInt(),
  check('max_temperature').exists().isInt()
], function(req, res, next) {
  // If the input is garbled, just give up
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.mapped() }).end();
  }

  var scriptParameters = [req.query.days_window, req.query.max_temperature]
  callback = msg => {
    payload = JSON.parse(msg.content.toString())
    res.json(payload)
  }
  setupConnection(callback, scriptParameters)

});

module.exports = router;
