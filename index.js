'use strict';

var app, base_url, bodyParser, client, express, morgan, port, rtg, shortid;

express = require('express');
app = express();
port = process.env.PORT || 5000;
shortid = require('shortid');
bodyParser = require('body-parser');
base_url = process.env.BASE_URL || 'http://localhost:5000';
morgan = require('morgan');

if (process.env.REDISTOGO_URL) {
    rtg  = require("url").parse(process.env.REDISTOGO_URL);
    client = require("redis").createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(":")[1]);
} else {
    client = require('redis').createClient();
}

app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

app.set('base_url', base_url);

app.use(morgan('combined'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    res.render('index');
});

app.post('/', function (req, res) {
    var url, id;

    url = req.body.url;

    id = shortid.generate();

    client.set(id, url, function () {
        res.render('output', { id: id, base_url: base_url });
    });
});

app.route('/:id').all(function (req, res) {
    var id = req.params.id.trim();

    client.get(id, function (err, reply) {
        if (!err && reply) {
            res.status(301);
            res.set('Location', reply);
            res.send();
        } else {
            res.status(404);
            res.render('error');
        }
    });
});

app.use(express.static(__dirname + '/static'));

app.listen(port);
console.log('Listening on port ' + port);