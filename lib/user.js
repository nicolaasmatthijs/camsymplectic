var util = require('./util');

/**
 * Get a user's profile information
 * 
 * @param  {String}     userId              Symplectic identifier for the user
 * @param  {Function}   callback            Standard callback function
 * @param  {Object}     callback.err        Error object containing the error code and message
 * @param  {User}       callback.response   Symplectic user object
 */
var getUser = module.exports.getUser = function(userId, callback) {
    // Get the group members from symplectic
    util.symplecticRequest('/users/' + userId, null, function(err, user) {
        if (err) {
            return callback(err);
        }

        // Convert the user to a User object
        var userObj = processUser(user);
        callback(null, userObj);
    });
};

/**
 * Takes a Symplectic user after it has been converted into JSON and turns
 * it into a more lightweight User objects
 * 
 * @param  {SymplecticUser}     user        Symplectic user that needs to converted
 * @return {User}                           Simplified user object
 */
var processUser = module.exports.processUser = function(user) {
    var metadata = user.feed.entry[0]['api:object'][0];
    return {
        'id': metadata['$'].id,
        'displayName': user.feed.title[0],
        'affiliation': metadata['$']['authenticating-authority'],
        'isCurrentStaff': metadata['api:is-current-staff'][0],
        'isAcademic': metadata['api:is-academic'][0],
        'title': metadata['api:title'][0],
        'initials': metadata['api:initials'][0],
        'lastName': metadata['api:last-name'][0],
        'firstName': metadata['api:first-name'][0],
        'emailAddress': metadata['api:email-address'][0],
        'knownAs': metadata['api:known-as'][0],
        'primaryGroup': metadata['api:primary-group-descriptor'][0],
        'birthDate': metadata['api:organisation-defined-data'][1]['_'],
        'staffCategory': metadata['api:organisation-defined-data'][2]['_'],
        'post': metadata['api:organisation-defined-data'][3]['_'],
        'fullName': metadata['api:organisation-defined-data'][21]['_']
    };
};