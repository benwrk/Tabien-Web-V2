var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var User = mongoose.model('User');

router.use(function (req, res, next) {
    console.log('[api.js] Verifying authentication for connection from: ' + req.ip);
    res.setHeader('cache-control', 'max-age=0');
    if (req.method === "GET") {
        // console.log('[api.js] GET connection passthrough: ' + req.ip);
        return next();
    }

    if (!req.isAuthenticated()) {
        // console.log('[api.js] \'' + req.ip + '\' is not logged in, redirecting...');
        return res.redirect('/#/login');
    }

    // console.log('[api.js] \'' + req.ip + '\' is authenticated, proceeding...');
    return next();
});

router.route('/posts').get(function (req, res) {
    Post.find(function (err, data) {
        if (err) {
            console.log('[api.js] GET /posts - Error getting posts!');
            return res.status(500).send(err);
        }
        // console.log('[api.js] Response: all posts');
        return res.send(data);
    });
}).post(function (req, res) {
    var newPost = new Post();
    newPost.text = req.body.text;
    newPost.created_by = req.body.created_by;
    newPost.save(function (err, post) {
        if (err) {
            console.log('[api.js] POST /posts - Error saving post!');
            return res.status(500).send(err);
        }
        return res.json(post);
    });
});

router.route('/posts/:id').get(function (req, res) {
    Post.findById(req.params.id, function(err, data) {
        if (err) {
            return res.status(500).send(err);
        }
        return res.json(data);
    });
}).put(function (req, res) {
    Post.findById(req.params.id, function(err, post) {
       if (err) {
           return res.status(500).send(err);
       }
       post.created_by = req.body.created_by;
       post.text = req.body.text;
       
       post.save(function (err, post) {
           if (err) {
               return res.status(500).send(err);
           }
           return res.json(post);
       });
    });
}).delete(function (req, res) {
    Post.remove({
        _id: req.params.id
    }, function(err) {
        if (err) {
            return res.status(500).send(err);
        }
        return res.json("Deleted");
    });
});

module.exports = router;
