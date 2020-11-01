var express = require('express');
var router = express.Router();
var auth = require('../auth/auth');

router.get('/', auth.optional, function(req, res, next) {
    res.render('about', { title: 'About' });
});

module.exports = router;