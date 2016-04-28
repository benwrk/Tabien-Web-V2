var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
    if (req.method === "GET") {
        return next();
    }

    if (!req.isAuthenticated()) {
        return res.redirect('/#login');
    }
    
    return next();
});

router.route('/posts').get(function (req, res) {
    res.send({
        message: 'TODO: return all posts'
    });
}).post(function (req, res) {
    res.send({
        message: 'TODO: create a new post'
    });
});

router.route('/posts/:id').get(function (req, res) {
    res.send({
        message: 'TODO: return a particular post id: ' + req.params.id
    });
}).put(function (req, res) {
    res.send({
        message: 'TODO: modify post id: ' + req.params.id
    });
}).delete(function (req, res) {
    res.send({
        message: 'TODO: delete a post id: ' + req.params.id
    });
});

module.exports = router;
