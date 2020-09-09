const express = require("express");
const authenticate = require("../authentication");
const Favorites = require("../models/favorite");

const favoriteRouter = express.Router();

favoriteRouter.route("/")
.get(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ userId: req.user._id })
        .populate("userId favoriteDishes")
        .then((favorites) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "appliaction/json");
            res.json(favorites);
        })
        .catch((err) => {
            next(err);
        })
})
.post(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ userId: req.user._id })
        .then((userFavorites) => {
            if(!userFavorites) {
                return Favorites.create({ userId: req.user._id, favoriteDishes: req.body });
            }

            for(newFavorite of req.body) {
                for(favorite of userFavorites.favoriteDishes) {
                    if(favorite.toString() === newFavorite._id) {
                        break;
                    }
                }

                userFavorites.favoriteDishes.push(newFavorite._id);
            }

            return userFavorites.save();
        })
        .then((userFavorites) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(userFavorites);
        })
        .catch((err) => {
            next(err);
        })
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndRemove({ userId: req.user._id})
        .then(() => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ satus: true, message: "Your list of favorites was deleted successfully"});
        })
        .catch((err) => {
            next(err);
        })
})

favoriteRouter.route("/:dishId")
.post(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ userId: req.user._id })
        .then((userFavorites) => {
            if(!userFavorites) {
                return Favorites.create({ userId: req.user._id, favoriteDishes: [req.params.dishId]});
            }

            for(favorite of userFavorites.favoriteDishes) {
                if(favorite.toString() === req.params.dishId) {
                    userFavorites.favoriteDishes.push(req.params.dishId);
                    
                    return userFavorites.save();
                }
            }

            throw new Error(`Dish with id: ${req.params.dishId} is already in your list of favorites`);
        })
        .then((userFavorites) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(userFavorites);
        })
        .catch((err) => {
            next(err);
        })
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ userId: req.user._id})
        .then((userFavorites) => {
            if(!userFavorites) {
                throw new Error("Your list of favorite dishes is empty");
            }

            userFavorites.favoriteDishes = userFavorites.favoriteDishes.filter((favorite) => favorite.toString() !== req.params.dishId);

            return userFavorites.save();
        })
        .then((userFavorites) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(userFavorites);
        })
        .catch((err) => {
            next(err);
        })
})


module.exports = favoriteRouter;