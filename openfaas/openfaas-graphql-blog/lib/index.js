const {
    graphql
} = require('graphql');
const {
    Schema
} = require('./schema');

function runGraphQL(event, cb) {

    let query = event.query;

    graphql(Schema, query).then(function (result) {
        return cb(null, result);
    }).catch(error => {
        const e = {
            errors: [{
                message: error.message,
                state: error.originalError && error.originalError.state,
                locations: error.locations,
                path: error.path,
            }]
        }
        return cb(JSON.stringify(e), null);
    });

}

module.exports = {
    runGraphQL,
}