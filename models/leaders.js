const Mongoose = require("mongoose");

const leaderSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    abbr: {
        type: String
    },
    featured: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Leaders = Mongoose.model("Leader", leaderSchema);

module.exports = Leaders;