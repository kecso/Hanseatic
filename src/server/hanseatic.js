/**
 * @author kecso / https://github.com/kecso
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    FS = require('fs'),
    bodyParser = require('body-parser'),
    Q = require('q');

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
        //console.log('user:', getUserId(req));
        res.render('base', {
            title: 'Hanseatic'
        });
    });

    router.get('/gme', function (req, res) {
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

    router.get('/lists', function (req, res) {
        var lists = {pieces: [], boards: []};
        lists.boards = FS.readdirSync(__dirname + '/../../public/boards');
        lists.pieces = FS.readdirSync(__dirname + '/../../public/pieces');
        res.status(200).json(lists);
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
                    req.session.save(function () {
                        res.clearCookie('webgme');
                        res.cookie('webgme', req.session.udmId);
                        res.sendStatus(200);
                    });
                }
            }
        );
    });

    router.post('/register', function (req, res) {
        console.log('coming over', req.body);
        Q.ninvoke(middlewareOpts.gmeAuth, 'addUser', req.body.username, req.body.email, req.body.password, true, {})
            .then(function () {
                return Q.ninvoke(middlewareOpts.gmeAuth, 'addUserToOrganization', req.body.username, 'startingGames');
            })
            .then(function () {
                return Q.ninvoke(middlewareOpts.gmeAuth, 'addUserToOrganization', req.body.username, 'ongoingGames');
            })
            .then(function () {
                return Q.ninvoke(middlewareOpts.gmeAuth, 'addUserToOrganization', req.body.username, 'archiveGames');
            })
            .then(function () {
                res.sendStatus(200);
            })
            .catch(function (err) {
                res.sendStatus(401);
            })
    });

    // all other endpoints require authentication
    //router.use('*', ensureAuthenticated);
    router.use('*', ensureAuthenticated, function (req, res) {
        //console.log('user:', getUserId(req));
        res.render('base', {
            title: 'Hanseatic'
        });
    });

    logger.debug('ready');
}

module.exports = {
    initialize: initialize,
    router: router
};