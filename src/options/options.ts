import "./options.scss";
import { StorageHelper } from "../helpers/storage-helper";
import { CommonHelper } from "../helpers/common-helper";

chrome.storage.sync.get('mysites', function (data) {
    if (data.mysites && data.mysites.length > 0) {

        for (var i = 0; i < data.mysites.length; i++) {
            let urlModel = data.mysites[i];
            $('#mysites').append(
                CommonHelper.createSiteElement(urlModel, true)
            );
        }
    }
});

chrome.storage.sync.get('highlighting-enabled', data => {
    $('#enable-highlighting').prop('checked', data['highlighting-enabled']);
})

$('#enable-highlighting').change(() => {
    chrome.storage.sync.set({ 'highlighting-enabled': $('#enable-highlighting').prop('checked') });
})

$('#txtSite').keypress(function (event) {
    if (event.which == 13) addSite();
})

$('#btnAddSite').click(addSite);

function addSite() {
    var sitename = $('#txtSite').val();
    if (typeof sitename == 'string' && sitename && sitename.length > 0) {
        var urlModel = CommonHelper.createUrlObject(sitename);
        StorageHelper.addSite(sitename).then((res: any) => {
            if (res) {
                $('#mysites').append(CommonHelper.createSiteElement(urlModel, true));
                $('#txtSite').val('');
            }
        })
    }
}

$('#mysites').on('click', '.btn-delete', function () {
    var hostname = $(this).data('hostname');
    if (confirm('Remove ' + hostname + ' from this list?')) {
        StorageHelper.removeSite(hostname);
        $(this).parents('li').remove();
    }
})