'use strict';

var Coordinates = require('./coordinates');
var aggregateCoordinates = function aggregateCoordinates(query, callback){
    Coordinates.aggregate(query, function (err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
}

module.exports = {
    aggregateCoordinates
};
