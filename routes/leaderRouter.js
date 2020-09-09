const express = require("express");
const bodyParser = require("body-parser");
const authenticate = require("../authentication");

const leaderRouter = express.Router();

const Leaders = require("../models/leaders");

leaderRouter.use(bodyParser.json());

leaderRouter.route("/")
    .get((req, res, next) => {
        Leaders.find({})
        .then((leaders) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(leaders);
        })
        .catch((err) => {
            next(err);
        })
    })
    .post(authenticate.verifyUser, authenticate.vertifyAdmin, (req, res, next) => {
        Leaders.create(req.body)
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(leader);
        })
        .catch((err) => {
            next(err);
        })
    })
    .put(authenticate.verifyUser, authenticate.vertifyAdmin, (req, res, next) =>{
        res.statusCode = 403;
        res.end("PUT method is not supported");
    })
    .delete(authenticate.verifyUser, authenticate.vertifyAdmin, (req, res, next) =>{
        Leaders.remove({})
        .then(() => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "plain/text");
            res.end("All leaders were deleted");
        })
        .catch((err) => {
            next(err);
        })
    });

leaderRouter.route("/:leaderId")
    .get((req, res, next) => {
        Leaders.findById(req.params.leaderId)
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(leader)
        })
        .catch((err) => {
            next(err);
        })
    })
    .put(authenticate.verifyUser, authenticate.vertifyAdmin, (req, res, next) => {
        Leaders.findByIdAndUpdate(req.params.leaderId, { $set: req.body }, { new: true })
        .then((updatedleader) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(updatedleader)
        })
        .catch((err) => {
            next(err);
        })
    })
    .post(authenticate.verifyUser, authenticate.vertifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end(`The POST operation is not allowed`);
    })
    .delete(authenticate.verifyUser, authenticate.vertifyAdmin, (req, res, next) => {
        Leaders.findByIdAndRemove(req.params.leaderId)
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "plain/text");
            res.end("Leader was removed successfully");
        })
        .catch((err) => {
            next(err);
        })
    });

module.exports = leaderRouter;