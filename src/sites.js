'use strict';

chrome.storage.sync.get('mysites', function (data) {
    if (data.mysites && data.mysites.length > 0) {

        for (var i = 0; i < data.mysites.length; i++) {
            let sitename = data.mysites[i];
            $('#mysites').append('<li><span class="btn-delete">X</span><a href="#" title="' + 
            sitename + 
            '" target="_blank"><img src="http://' +
            sitename + 
            '/favicon.ico" class="favicon" alt="' + 
            sitename + 
            '" /><span class="site-name">' + 
            sitename + 
            '</span></a></li>');
        }
    }
});


