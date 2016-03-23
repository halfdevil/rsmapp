/**
 * Created by jsharma on 20/03/16.
 */

var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var user = require('../models/users.js');
var category = require('../models/categories.js');
var service = require('../models/services.js');
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

router.get('/categories', function(request, response) {
    return category.find(function(err, categories) {
        if (!err) {
            return response.send(categories);
        } else {
            return response.status(500).send(err);
        }
    });
});

router.get('/categories/:id', function(request, response) {
    var id = request.params.id;

    category.findOne({
        _id : id
    }, function(err, category) {
        if (err) {
            return response.send('Unable to find service');
        } else {
            return response.send(category);
        }
    });
});

router.post('/categories/add', function(request, response) {
    var newCategory = new category();

    newCategory.name = request.body.name;
    newCategory.description = request.body.description;

    newCategory.save(function(err) {
        if (!err) {
            response.send("Category added successfully");
        } else {
            response.send(err);
        }
    });
});

router.post('/categories/update/:id', function(request, response) {
    var id = request.params.id;

    category.update({
        _id : id
    }, {
        $set : {
            name : request.body.name,
            description : request.body.description
        }
    }).exec();

    response.send('Category has been update');
});

router.get('/categories/delete/:id', function(request, response) {
    var id = request.params.id;

    category.remove({
        _id : id
    }, function(err) {
        if (err) {
            return response.send("Unable to delete category");
        } else {
            return response.send("Category deleted successfully");
        }
    });
});

router.get('/categories/services/:category', function(request, response) {
    var category = request.params.category;

    return service.find({category : category}, function(err, services) {
        if (!err) {
            return response.send(services);
        } else {
            return response.status(500).send(err);
        }
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

router.post('/services/add/:category', function(request, response) {
    var catId = request.params.category;
    var items = request.body.items;

    category.findOne({
        _id : catId
    }, function(err, cat) {
        if (!err) {
            var newService = new service();

            newService.name = request.body.name;
            newService.type = request.body.type;
            newService.category = catId;

            items.forEach(function (item) {
                newService.items.push({
                    particular: item.particular,
                    rate: item.rate
                });
            });

            newService.save(function (err) {
                if (!err) {
                    response.send('Service added successfully');
                } else {
                    response.send(err);
                }
            });
        } else {
            return response.send('Invalid category passed');
        }
    });
});

router.post('/services/update/:id', function(request, response) {
    var id =  request.params.id;
    var items = request.body.items;
    var newService = new service();

    newService.name = request.body.name;
    newService.type = request.body.type;

    items.forEach(function(item) {
        newService.items.push({
            particular : item.particular,
            rate : item.rate
        });
    });

    var serviceData = newService.toObject();
    delete serviceData._id;

    service.update({_id : id}, serviceData, {upsert : true},
        function(err) {
            if (err) {
                response.send('Unable to update service');
            } else {
                response.send('Service has been updated');
            }
        }
    );
});

router.get('/services/delete/:id', function(request, response) {
    var id = request.params.id;

    service.remove({
        _id : id,
    }, function(err) {
        if (err) {
            return response.send('Unable to delete service');
        } else {
            return response.send('Service has been deleted');
        }
    });
});

module.exports = router;
