const express = require('express'),
    app = express();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const CoordinateService = require('./coordinate_service');
const async = require('async');

//Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/dummy', function (err) {
    if (err) {
        console.log("DB Error: ", err);
        process.exit(1);
    } else {
        console.log('MongoDB Connected');
    }
});

app.get('/paginatedData', function (req, res) {
    console.log(req.query);
    let dataToSend = {};
    async.series([
        function(cb){
            if(req.query.startTime && req.query.shiftId) {
                cb();
            } else {
                cb(new Error("Send Proper Payload"));
            }
        },
        function(cb){
            var query = [
                {
                    $match: {
                        shiftId: req.query.shiftId,
                        // timestamp: {
                        //     $gte: new Date(req.query.startTime)
                        // }
                    }
                },
                {
                    $group : {
                        _id : null, 
                        count : {
                            $sum : 1
                        }
                    }
                }
            ];
            CoordinateService.aggregateCoordinates(query, (err, data)=>{
                console.log(err, data);
                dataToSend.count = data && data[0] && data[0].count || 0;
                cb();
            })
        },
        function(cb){
            var query = [
                {
                    $match: {
                        shiftId: req.query.shiftId,
                        timestamp: {
                            $gte: new Date(req.query.startTime)
                        }
                    }
                },
                {
                    $project: {
                        shiftId: 1,
                        shiftStartTime: 1,
                        shiftEndTime: 1,
                        currentTime: '$timestamp',
                        guardList: 1
                    }
                },
                {
                    $sort:{ 
                        currentTime: 1
                    }
                },
                {
                    $limit: 10
                }
            ];
            CoordinateService.aggregateCoordinates(query, (err, data)=>{
                console.log(err, data);
                dataToSend.data = data || [];
                cb();            
            })
        },
        function(cb){
            if(dataToSend.data && dataToSend.data.length){
                let nextData = dataToSend.data[dataToSend.data.length - 1];
                dataToSend.next = nextData.currentTime;
                let prevData = dataToSend.data[0];
                dataToSend.prev = prevData.currentTime;
                dataToSend.startTime = prevData.shiftStartTime;
                dataToSend.endTime = prevData.shiftEndTime;
                dataToSend.shiftId = prevData.shiftId;
            }
            cb();
        }
    ], 
    function(err, results){
        if(err){
            res.send("Unable to find startTime");
        } else {
            res.json(dataToSend);
        }
    });
});

app.listen(3000);
console.log("Link: http://localhost:3000");

