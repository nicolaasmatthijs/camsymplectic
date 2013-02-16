$(document).ready(function() {
    
    var GROUP_ID = '279';
    
    // Load the members of the group
    $.ajax({
        'url': '/api/group/' + GROUP_ID + '/members',
        'success': function(data) {
            renderTemplate($('#members_template'), data, $('#content'));
        }
    });
    
});
