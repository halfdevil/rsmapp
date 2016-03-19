/**
 * Created by jsharma on 20/03/16.
 */

var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var user = require('./models/users.js');
var service = require('./models/services.js');
var bcrypt = require('bcrypt-nodejs');

function sessionCheck(request, response, next) {
    if (request.session.user) {
        next();
    } else {
        return response.status(401).send('Authorization failed');
    }
}

router.post('/add-user', function(request, response) {
    var salt, hash, password;

    password = request.body.password;
    salt = bcrypt.getSaltSync(10);
    hash = bcrypt.hashSync(password, salt);

    var newUser = new user({
        username : request.body.username,
        password : hash,
        name : request.body.name,
        email : request.body.email,
        admin : false
    });

    newUser.save(function(err) {
        if (!err) {
            return response.send('User successfully created');
        } else {
            return response.send(err);
        }
    });
});

router.post('/login', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;

    user.findOne({
        username : username
    }, function(err, data) {
        if (err | data == null) {
            return response.status(401).send('User does not exisit');
        } else {
            var usr = data;

            if (username == usr.username && bcrypt.compareSync(password, usr.password)) {
                request.session.regenerate(function() {
                    request.session.user = username;
                    return response.send(username);
                });
            } else {
                response.status(401).send('Invalid password');
            }
        }
    });
});

router.post('/logout', function(request, response) {
    request.session.destroy(function() {
        return response.status(401).send('User logged out');
    });
});

router.get('/services', function(request, response) {
    return service.find(function(err, services) {
        if (!err) {
            return response.send(services);
        } else {
            return response.status(500).send(err);
        }
    })
});

router.post('/services/add', function(request, response) {
    var newService = new service({
        name : request.body.name,
        description : request.body.description,
        imageUrl : ''
    });

    newService.save(function(err) {
        if (!err) {
            response.send('Service added successfully');
        } else {
            response.send(err);
        }
    });
});

router.post('/services/update/:id', function(request, response) {
    var id =  request.params.id;

    service.update({
        _id : id
    }, {
        $set : {
            name : request.body.name,
            description : request.body.description
        }
    }).exec();

    response.send('Service has been updated');
});

router.get('/services/delete/:id', function(request, response) {
    var id = request.params.id;

    service.remove({
        _id : id,
    }, function(err) {
        return response.send('Unable to delete service');
    });

    return response.send('Service has been deleted');
});

router.get('/services/:id', function(request, response) {
    var id = request.params.id;

    service.findOne({
        _id : id
    }, function(err, service) {
        if (err) {
            return response.send('Unable to find service');
        } else {
            return response.send(service);
        }
    });
});
