/* global process */

var express = require('express');
var util = require('util');
var jade = require('jade');
var extend = require('extend');
var nr = require('./nationalrail.js');

var port = process.env.PORT || 3000;

var app = express();
var errorStation = nr.errorStation;

var jadeOptions = {pretty:true};
var jadeGlobals = {};
jadeGlobals.pageTitle = 'trntxt';
jadeGlobals.loadTime = function() {
    return new Date().toLocaleTimeString();
};

function compile(locals) {
    var fn = jade.compileFile('resources/template.jade', jadeOptions);
    return fn(extend({}, jadeGlobals, locals));
}

app.get('/:from/:to', function (request, response) {
    var stations = {};
    stations.fromStation = nr.findStation(request.params.from);
    stations.toStation = nr.findStation(request.params.to);
    if (stations.fromStation.stationCode === errorStation.stationCode
            || stations.toStation.stationCode === errorStation.stationCode) {
        response.send('One or more invalid parameters');
        return;
    }
    nr.getDepartures(stations, function(output) {
        response.send(compile(output));
    });
});

app.get('/:from', function (request, response) {
    var stations = {};
    stations.fromStation = nr.findStation(request.params.from);
    if (stations.fromStation.stationCode === errorStation.stationCode) {
        response.send('Invalid station name entered');
        return;
    }
    nr.getDepartures(stations, function(output) {
        response.send(compile(output));
    });
});

app.use(express.static('public'));
 
var server = app.listen(port, function () {
    console.log('listening on port %s', port);
});