const express = require("express");
const bodyParser = require("body-parser");

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route("/")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next();
    })
    .get((req, res, next) => {
        res.end("Leader will be sent to you");
    })
    .post((req, res, next) => {
        res.end(`leader with name: ${req.body.name} and description: ${req.body.description} \nwill be added`);
    })
    .put((req, res, next) =>{
        res.statusCode = 403;
        res.end("PUT method is not supported");
    })
    .delete((req, res, next) =>{
        res.end("All leaders will be deleted");
    });

leaderRouter.route("/:leaderId")
    .get((req, res, next) => {
        res.end(`leader with id: ${req.params.leaderId} will be sent to you`);
    })
    .put((req, res, next) => {
        res.end(`leader with id: ${req.params.leaderId} will be updated to name: ${req.body.name} and description: ${req.body.description}`);
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end(`The POST operation is not allowed within leader with id: ${req.params.leaderId}`);
    })
    .delete((req, res, next) => {
        res.end(`leader with id: ${req.params.leaderId} will be deleted`)
    });

module.exports = leaderRouter;