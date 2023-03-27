/**
 * React form server example for DB Broker initial draft form.
 *
 * This is an express application that provide sa contact form.
 * The main goals for this app is to provide simplicity and use this
 * as a proof of concept (no form validation or security).
 */

require('node-jsx').install({extension: '.jsx'});
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var React = require('react');
var ContactFormFactory = React.createFactory(require('./src/contact-form.jsx'));

// exposes public assets (the index and js files)
app.use(express.static('public'));

// Sets the path that stores views and
app.set('views', './views');
// Define the template engine (Jade).
app.set('view engine', 'jade');

// Refturn the contact form
app.get('/', function (req, res) {
  var ContactForm = React.renderToString(ContactFormFactory());
  res.render('index', { Content: ContactForm });
});

// Adds support for JSON-encoded bodies used in POST requests.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Processes the form submission.
app.post('/send', function (req, res) {

  // My email
  var chad= "<DO NOT HARDCODE>";
  // Get emailjs module (dependency)
  var Email = require('emailjs/email');
  // Grab the input data from the form
  var input = req.body;
  // server connection data (specific for outlook address)
  var server = Email.server.connect({
    // actual email spun up
    user: '<DO NOT HARDCODE>',
    // password
    password: '<DO NOT HARDCODE THIS>',
    // server
    host: 'smtp-mail.outlook.com',
    // transport layer security (required for outlook)
    // port : 465,
    port : 587,
    // ssl: true
    tls: {ciphers: "SSLv3"}
  });

  console.log(server);
  console.log(req.body);
  // What we are sending to user
  server.send({
    from: '<EMAIL HERE>',
    to: '<EMAIL HERE>',
    subject: 'Need Request ',
    text: "This is an automated message. A request has been submitted to the needs database from " + input.name
  }, function(error) {
    if (error) {
      console.log(error)
    } else {
      console.log("email sent")
    }
  });

  // Log the form data to the screen


  // Use below for trouble shooting- but comment out as will cause error.
  // res.send({status: 'Works!!!!'});
});

// Starts the web application.
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function () {
  console.log('App is running at port', app.get('port'));
});
