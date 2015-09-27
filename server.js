var express = require('express');
var path = require('path');
var url = require('url');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');

var apiUrl = 'https://us6.api.mailchimp.com/3.0/';
var mailChimpKey = process.env.MAILCHIMP_API_KEY;
var listId = '9c9f14f529';

var sendGridKey = process.env.SENDGRID_API_KEY;


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
// api key https://sendgrid.com/docs/Classroom/Send/api_keys.html
var options = {
    auth: {
        api_key: sendGridKey
    }
};
var transporter = nodemailer.createTransport(sgTransport(options));


app.post('/subscribe/:email', function (req, res) {

  var email = req.params.email;
  if (!email) return res.status(400).json({error:'email is required'});

  try {

    var options = {
      'auth': {
        'user': 'apikey',
        'pass': mailChimpKey,
        'sendImmediately': true
      },
      'json': {'email_address': email, 'status': 'subscribed'}
    };

    request.post(apiUrl + 'lists/' + listId + '/members/', options,
        function callback(error, response, body) {

          if (response.statusCode == 400 && body  && body.title == 'Member Exists')
            return res.status(200).json({email: email, status: 'Existing Subscriber'});

          if (!error && response.statusCode >= 300) {
            console.log(body);
            return res.status(500).json({error: 'Mailchimp api error', details: body.detail});
          }

          return res.status(200).json({email: email, status: 'Subscribed'});

        }
    );

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({error: 'Error sending email'});
  }

});



app.post('/contact', function (req, res) {

    var data = req.body;

    console.log('CONTACT', data);

    try {

        var sender = data.name + ' <' + data.email + '>';

        transporter.sendMail({
            from: sender,
            to: 'info@devicehive.com',
            subject: 'Contact Us Form',
            text:
                 'Name: ' + data.name + '\r\n\r\n'
                 +'Company: ' + data.company + '\r\n\r\n' +
                data.message
        });

        return res.status(200).json({status: 'Sent'});


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error: 'Error sending email'});
    }
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
