
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Coordinates = new Schema({
    shiftId: {type: Schema.ObjectId},
    shiftStartTime: {type: Date},
    shiftEndTime: {type: Date},
    currentTime: {type: Date},
    guardList: [
        {
            _id: {type: Schema.ObjectId},
            polyline: {type: String},
            image: {type: String},
            coordinates: {
              latitude: {type: Number},
              longitude: {type: Number}
            },
            color: {type: String}
        }
    ]
});

module.exports = mongoose.model('Coordinates', Coordinates);
