var express = require('express');

var config = require('./config');
var groupAPI = require('./lib/group');
var userAPI = require('./lib/user');
var publicationAPI = require('./lib/publication');


// Create the web server
var server = express();
server.listen(config.server.port);
// Set up the static file hosting
server.use('/', express.static(__dirname + '/static'));
console.log('Started REST web server at http://localhost:' + config.server.port);


// Register user REST feeds
server.get('/api/user/:userId', function(req, res) {
    userAPI.getUser(req.params.userId, function(err, user) {
        if (err) {
            return res.send(err.code, err.msg);
        }
        res.send(200, user);
    });
});

// Register group REST feeds
server.get('/api/group/:groupId/members', function(req, res) {
    groupAPI.getGroupMembers(req.params.groupId, function(err, members) {
        if (err) {
            return res.send(err.code, err.msg);
        }
        res.send(200, {'results': members});
    });
});

// Register publications REST feeds
server.get('/api/user/:userId/publications', function(req, res) {
    publicationAPI.getUserPublications(req.params.userId, function(err, publications) {
        if (err) {
            return res.send(err.code, err.msg);
        }
        res.send(200, {'results': publications});
    });
});

server.get('/api/group/:groupId/publications', function(req, res) {
    publicationAPI.getGroupPublications(req.params.groupId, function(err, publications) {
        if (err) {
            return res.send(err.code, err.msg);
        }
        res.send(200, {'results': publications});
    });
});