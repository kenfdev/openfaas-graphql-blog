"use strict"

// Require Logic
var lib = require('./lib');

module.exports = (context, callback) => {
    const event = JSON.parse(context);

    lib.runGraphQL(event, (err, response) => {
        callback(err, response);
    })

}