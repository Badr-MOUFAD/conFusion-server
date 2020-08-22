const express = require("express");
const bodyParser = require("body-parser");
const authenticate = require("../authentication");

const promoRouter = express.Router();

const Promotions = require("../models/promotions");

promoRouter.use(bodyParser.json());

promoRouter.route("/")
    .get((req, res, next) => {
        Promotions.find({})
        .then((promos) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(promos);
        })
        .catch((err) => {
            next(err);
        })
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Promotions.create(req.body)
        .then((promo) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(promo);
        })
        .catch((err) => {
            next(err);
        })
    })
    .put(authenticate.verifyUser, (req, res, next) =>{
        res.statusCode = 403;
        res.end("PUT method is not supported");
    })
    .delete(authenticate.verifyUser, (req, res, next) =>{
        Promotions.remove({})
        .then(() => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "plain/text");
            res.end("All promotions were deleted");
        })
        .catch((err) => {
            next(err);
        })
    });

promoRouter.route("/:promoId")
    .get((req, res, next) => {
        Promotions.findById(req.params.promoId)
        .then((promo) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(promo)
        })
        .catch((err) => {
            next(err);
        })
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Promotions.findByIdAndUpdate(req.params.promoId, { $set: req.body }, { new: true })
        .then((updatedPromo) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(updatedPromo)
        })
        .catch((err) => {
            next(err);
        })
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`The POST operation is not allowed within ${req.params.promoId}`);
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Promotions.findByIdAndRemove(req.params.promoId)
        .then((promo) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "plain/text");
            res.end("Promotion was removed successfully");
        })
        .catch((err) => {
            next(err);
        })
    });

module.exports = promoRouter;