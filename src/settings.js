'use strict';

var storage = new Storage();
chrome.storage.sync.get('mysites', function (data) {
    if (data.mysites && data.mysites.length > 0) {

        for (var i = 0; i < data.mysites.length; i++) {
            let urlModel = data.mysites[i];
            $('#mysites').append(
                createSiteElement(urlModel, true)
            );
        }
    }
});

$('#txtSite').keypress(function (event) {
    if (event.which == 13) addSite();
})

$('#btnAddSite').click(addSite);

function addSite() {
    var sitename = $('#txtSite').val();
    if (sitename && sitename.length > 0) {
        var urlModel = createUrlObject(sitename);
        storage.addSite(urlModel).then(function (res) {
            if (res) {
                $('#mysites').append(createSiteElement(urlModel, true));
                $('#txtSite').val('');
            }
        })
    }
}

$('#mysites').on('click', '.btn-delete', function () {
    var hostname = $(this).data('hostname');
    if (confirm('Remove ' + hostname + ' from this list?')) {
        storage.removeSite(hostname);
        $(this).parents('li').remove();
    }
})