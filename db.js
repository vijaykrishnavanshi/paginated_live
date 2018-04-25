var MongoClient = require('mongodb').MongoClient,
    test = require('assert');
var polyline = require('@mapbox/polyline');

function randomString(num) { 
        var chars = 
"0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz"; 
        var randomstring = ''; 
        var string_length = num;
        for (var i=0; i<string_length; i++) { 
                var rnum = Math.floor(Math.random() * chars.length); 
                randomstring += chars.substring(rnum,rnum+1); 
        } 
        return randomstring; 
} 

function randomGeo(center) {
    var radius = 500;
    var y0 = center[0];
    var x0 = center[1];
    var rd = radius / 111300;

    var u = Math.random();
    var v = Math.random();

    var w = rd * Math.sqrt(u);
    var t = 2 * Math.PI * v;
    var x = w * Math.cos(t);
    var y = w * Math.sin(t);

    return [y + y0, x + x0];
}

MongoClient.connect('mongodb://localhost:27017/dummy', function(err, db) {
  test.equal(err, null);
  console.log(db, err);
  var col = db.collection('coordinates');
  
  var rows = []; 
  var shiftId = {
    5: '5a7d5d9388c53e14de33a2b1',
    15: '5a7d5d9388c53e14de33a2b2',
    25: '5a7d5d9388c53e14de33a2b3',
    35: '5a7d5d9388c53e14de33a2b4',
    45: '5a7d5d9388c53e14de33a2b5',
    55: '5a7d5d9388c53e14de33a2b6'
  };
  var guardId = {
    5: '5a7d5d9388c53e14de33a2c1',
    15: '5a7d5d9388c53e14de33a2c2',
    25: '5a7d5d9388c53e14de33a2c3',
    35: '5a7d5d9388c53e14de33a2c4',
    45: '5a7d5d9388c53e14de33a2c5',
    55: '5a7d5d9388c53e14de33a2c6'
  };
  for(var time = 5; time < 60 ; time+=10){
    var dataToEncode = [];
    //update this for how many docs to insert
    var shiftStartTime = new Date('2018-04-25T06:49:26.442Z');
    var shiftEndTime = new Date(shiftStartTime);
    shiftEndTime.setMinutes(shiftEndTime.getMinutes() + time);
    var color = randomString(6);
    for(var i = new Date(shiftStartTime); i < new Date(shiftEndTime); i.setSeconds(i.getSeconds()+1)){
      var coordinates = randomGeo([30.7333, 76.7794]);
      var obj = {
        shiftId: shiftId[time],
        shiftStartTime: shiftStartTime,
        shiftEndTime: shiftEndTime,
        timestamp: new Date(i),
        guardList: [
          {
            _id: guardId[time],
            polyline: polyline.encode(dataToEncode),
            image: 'http://placehold.it/150/92c952',
            coordinates: {
              latitude: coordinates[0],
              longitude: coordinates[1]
            },
            color: color
          }
        ]
      }
      dataToEncode.push(coordinates);
      rows.push(obj);
      console.log(obj);
      col.insert(obj, function(err, r){
        console.log(r.insertedCount);
      })
    }  
  }
  db.close();
});

