$(document).ready(function() {
    
    var USER_ID = $.deparam.querystring().id;

    // Get user information
    $.ajax({
        'url': '/api/user/' + USER_ID,
        'success': function(data) {
            $('#user-fullName').text(data.title + ' ' + data.fullName);
            renderTemplate($('#user-basic-template'), data, $('#user-basic'));
        }
    })
    
    // Get publications
    $.ajax({
        'url': '/api/user/' + USER_ID + '/publications',
        'success': function(data) {
            renderTemplate($('#user-publications-template'), data, $('#user-publications'));
        }
    });
    
});
