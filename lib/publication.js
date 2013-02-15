var _ = require('underscore');

var util = require('./util');

/**
 * Get a user's publications
 * 
 * @param  {String}         userId              Symplectic identifier for the user
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        Error object containing the error code and message
 * @param  {Publication[]}  callback.response   List of Symplectic publications
 */
var getUserPublications = module.exports.getUserPublications = function(userId, callback) {
    // Get the list of publication for the user from symplectic
    util.symplecticRequest('/users/' + userId + '/publications', null, function(err, publications) {
        if (err) {
            return callback(err);
        }

        // Convert the user to a Publication list
        processPublications(publications, callback);
    });
};

/**
 * Get a group's publications
 * 
 * @param  {String}         groupId             Symplectic identifier for the group
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        Error object containing the error code and message
 * @param  {Publication[]}  callback.response   List of Symplectic publications
 */
var getGroupPublications = module.exports.getGroupPublications = function(groupId, callback) {
    // Get the list of publication for the user from symplectic
    util.symplecticRequest('/publications', {'groups': groupId}, function(err, publications) {
        if (err) {
            return callback(err);
        }

        // Convert the user to a Publication list
        processPublications(publications, callback);
    });
};

/**
 * Takes a list of Symplectic publications after they have been converted into JSON and turns
 * it into a more lightweight list of Publication objects
 * 
 * @param  {SymplecticPublication}     publications             List of Symplectic publications that need to be converted
 * @param  {Function}                  callback                 Standard callback function
 * @param  {Object}                    callback.err             Error object containing error code and message
 * @param  {Publication[]}             callback.publications    List of simplified publication objects
 */
var processPublications = module.exports.processPublications = function(publications, callback) {
    var done = 0;

    if (!publications.feed.entry) {
        return callback(null, []);
    }

    _.each(publications.feed.entry, function(publication, index) {
        // Get the publication id and request it from Symplectic
        var publicationId = false;
        // This is what we get back from /publications?groupd=
        if (publication['api:object']) {
            publicationId = publication['api:object'][0]['$'].id;
        // This is what we get back from /users/userid/publications
        } else if (publication['api:relationship']) {
            publicationId = publication['api:relationship'][0]['api:related'][0]['api:object'][0]['$'].id;
        }
            
        if (publicationId) {
            util.symplecticRequest('/publications/' + publicationId, null, function(err, publicationData) {
    
                var metadata = publicationData.feed.entry[0]['api:object'][0];
                // Construct a publication object
                var publicationObj = {};
                publicationObj.id = metadata['$'].id;
                publicationObj.type = metadata['$'].type;
                publicationObj.title = publicationData.feed.title[0];
    
                // Get source
                publicationObj.source = metadata['api:records'][0]['api:record'][0]['$']['source-display-name'];
    
                var fields = metadata['api:records'][0]['api:record'][0]['api:native'][0]['api:field'];
                _.each(fields, function(field) {
    
                    // Get authors
                    if (field['$'].name === 'authors') {
                        publicationObj.authors = [];
                        _.each(field['api:people'][0]['api:person'], function(author) {
                            publicationObj.authors.push(author['api:initials'] + ' ' + author['api:last-name']);
                        });
                    }
    
                    // Get abstract
                    if (field['$'].name === 'abstract') {
                        publicationObj.abstract = field['api:text'][0];
                    }
    
                    // Get Journal name
                    if (field['$'].name === 'journal') {
                        publicationObj.journal = field['api:text'][0];
                    }
    
                    // Publication year
                    if (field['$'].name === 'publication-date') {
                        publicationObj.year = field['api:date'][0]['api:year'][0];
                    }
                    
                    // Get link
                    if (field['$'].name === 'author-url') {
                        publicationObj.url = field['api:text'][0];
                    }
    
                    // Get keywords
                    if (field['$'].name === 'keywords') {
                        publicationObj.keywords = [];
                        _.each(field['api:keywords'][0]['api:keyword'], function(keyword) {
                            if (keyword['_']) {
                                publicationObj.keywords.push(keyword['_']);
                            }
                        });
                    }
    
                    // Get location
                    if (field['$'].name === 'location') {
                        publicationObj.location = field['api:text'][0];
                    }
                    
                    // Get language
                    if (field['$'].name === 'language') {
                        publicationObj.language = field['api:text'][0];
                    }
                });
                
                publications.feed.entry[index] = publicationObj;
                
                done++;
                if (done === publications.feed.entry.length) {
                    callback(null, publications.feed.entry);
                }
            });
        } else {
            callback({'code': 500, 'msg': 'An error occured trying to get the publication id'});
        }
    });
};
