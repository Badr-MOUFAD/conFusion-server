const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "User"
    },
    favoriteDishes: [{
        type: ObjectId,
        ref: "Dish"
    }]
});

const Favorites = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorites;