var google = require('google-images');

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

        // Get the user's profile picture from google
        //getProfilePictureURL(userObj, function(err, profilePictureUrl) {
        //    if (err) {
        //        return callback(null, userObj);
        //    }

        //    userObj.profilePictureUrl = profilePictureUrl;
            callback(null, userObj);
        //});
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
        'primaryGroup': metadata['api:primary-group-descriptor'][0],
        'staffCategory': metadata['api:organisation-defined-data'][2]['_'],
        // Some of the posts come back with the initiation date associated to it (e.g. `(2001)`). This strips them out
        'post': metadata['api:organisation-defined-data'][3]['_'].replace(/[ ][(][0-9]*[)]/g, ''),
        'fullName': metadata['api:organisation-defined-data'][21]['_']
    };
};

/**
 * Get a user's profile picture through a Google images search. We will fetch the first
 * image of the result list as the profile picture.
 * 
 * @param  {User}       user                        Simplified user object for which we want to fetch a profile picture
 * @param  {Function}   callback                    Standard callback function
 * @param  {Object}     callback.err                Error object containing the error code and message
 * @param  {String}     callback.profilePicture     URL to the user's profile picture
 */
var getProfilePictureURL = function(user, callback) {
    google.search(user.fullName + ' ' + user.affiliation, function(err, images) {
        if (err) {
            callback(err);
        }

        callback(false, images[0].unescapedUrl);
    });
};
