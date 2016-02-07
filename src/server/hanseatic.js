/**
 * @author kecso / https://github.com/kecso
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser');

function getUserId(req) {
    return req.session.udmId;
}

function initialize(middlewareOpts) {
    var logger = middlewareOpts.logger.fork('HanseaticRouter'),
    //gmeConfig = middlewareOpts.gmeConfig,
        ensureAuthenticated = middlewareOpts.ensureAuthenticated,
        viewsInitialized = false;

    logger.debug('initializing ...');

    router.use(bodyParser.json({}));
    router.use(bodyParser.urlencoded({extended: true}));
    //ensure the jade is initialized properly
    router.use('*', function (req, res, next) {
        if (!viewsInitialized) {
            viewsInitialized = true;
            req.app.set('view engine', 'jade');
            req.app.set('views', './src/server/views');
        }
        next();
    });
    // ensure authenticated can be used only after this rule
    router.use('*', function (req, res, next) {
        // TODO: set all headers, check rate limit, etc.
        res.setHeader('X-WebGME-Media-Type', 'webgme.v1');
        next();
    });

    router.get('', function (req, res) {
        console.log('user:', getUserId(req));
        res.render('base', {
            title: 'Hanseatic'
        });
    });

    router.get('/gme',function(req,res){
        console.log('here we goo');
        var options = {
            root: __dirname + '/../../node_modules/webgme/dist/',
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };

        var fileName = 'webgme.classes.build.js';
        res.sendFile(fileName, options, function (err) {
            if (err) {
                console.log(err);
                res.status(err.status).end();
            }
            else {
                console.log('Sent:', fileName);
            }
        });
    });
    router.post('/login', function (req, res) {
        middlewareOpts.gmeAuth.authenticateUserById(
            req.body.username,
            req.body.password,
            'hanseatic',
            'rest/external/hanseatic/login',
            req,
            res,
            function (err) {
                if (err) {
                    res.sendStatus(401);
                } else {
                    req.session.save(function(){
                        res.clearCookie('webgme');
                        res.cookie('webgme', req.session.udmId);
                        //res.cookie('anotherwebgme', req.session.udmId);
                        console.log('authenticated',req.session.udmId);
                        res.sendStatus(200);
                    });
                }
            }
        );
    });

    // all other endpoints require authentication
    //router.use('*', ensureAuthenticated);
    router.use('*', function(req,res){
        console.log('whaat',req);
    });

    logger.debug('ready');
}

module.exports = {
    initialize: initialize,
    router: router
};