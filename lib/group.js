var _ = require('underscore');

var util = require('./util');

/**
 * Get the members of a group
 * 
 * @param  {String}         groupId             Symplectic identifier for the group
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        Error object containing the error code and message
 * @param  {Member[]}       callback.response   List of Symplectic users that are a member of the group
 */
var getGroupMembers = module.exports.getGroupMembers = function(groupId, callback) {
    // Get the group members from symplectic
    util.symplecticRequest('/users', {'groups': groupId}, function(err, members) {
        if (err) {
            return callback(err);
        }

        var users = [];
        // Add the metadata for each user to the final list
        _.each(members.feed.entry, function(member) {
            var metadata = member['api:object'][0]['$'];
            users.push({
                'id': metadata.id,
                'displayName': member.title[0],
                'affiliation': metadata['authenticating-authority']
            });
        });
        callback(null, users);
    });
};