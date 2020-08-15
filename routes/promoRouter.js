const express = require("express");
const bodyParser = require("body-parser");

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route("/")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next();
    })
    .get((req, res, next) => {
        res.end("Promotions will be sent to you");
    })
    .post((req, res, next) => {
        res.end(`promotion with name: ${req.body.name} and description: ${req.body.description} \nwill be added`);
    })
    .put((req, res, next) =>{
        res.statusCode = 403;
        res.end("PUT method is not supported");
    })
    .delete((req, res, next) =>{
        res.end("All promotions will be deleted");
    });

promoRouter.route("/:promoId")
    .get((req, res, next) => {
        res.end(`Promotion with id: ${req.params.promoId} will be sent to you`);
    })
    .put((req, res, next) => {
        res.end(`Promotion with id: ${req.params.promoId} will be updated to name: ${req.body.name} and description: ${req.body.description}`);
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end(`The POST operation is not allowed within ${req.params.promoId}`);
    })
    .delete((req, res, next) => {
        res.end(`Promotion with id: ${req.params.promoId} will be deleted`)
    });

module.exports = promoRouter;