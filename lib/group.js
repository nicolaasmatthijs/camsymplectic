var _ = require('underscore');

var util = require('./util');
var userAPI = require('./user');

/**
 * Get the members of a group
 * 
 * @param  {String}         groupId             Symplectic identifier for the group
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        Error object containing the error code and message
 * @param  {User[]}         callback.response   List of Symplectic users that are a member of the group
 */
var getGroupMembers = module.exports.getGroupMembers = function(groupId, callback) {
    // Get the group members from symplectic
    util.symplecticRequest('/users', {'groups': groupId}, function(err, members) {
        if (err) {
            return callback(err);
        }

        var done = 0;
        // Add the metadata for each user to the final list
        _.each(members.feed.entry, function(member, index) {
            // Get the user's metadata through a separate request
            var userId = member['api:object'][0]['$'].id;
            userAPI.getUser(userId, function(err, userObj) {
                members.feed.entry[index] = userObj;
                
                done++;
                if (done === members.feed.entry.length) {
                    callback(null, members.feed.entry);
                }
            });
        });
    });
};