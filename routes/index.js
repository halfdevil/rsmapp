/**
 * Created by jsharma on 20/03/16.
 */

var express = require('express');
var router = express.Router();

router.get('*', function(request, response) {
    response.sendfile('./public/index.html');
});

module.exports = router;