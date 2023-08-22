import "./options.scss";
import { StorageService } from "../shared/services/storage-service";
import { CommonHelper } from "../shared/helpers/common-helper";

const storageService = new StorageService();

chrome.storage.sync.get('mysites', (data) => {
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

const addSite = async (): Promise<void> => {
    var sitename = $('#txtSite').val();
    if (typeof sitename == 'string' && sitename && sitename.length > 0) {
        const response = await storageService.addSite(sitename);
        if (response) {
            $('#mysites').append(CommonHelper.createSiteElement(response.item, true));
            $('#txtSite').val('');
        }
    }
}

$('#enable-highlighting').on('change', () => {
    chrome.storage.sync.set({ 'highlighting-enabled': $('#enable-highlighting').prop('checked') });
})

$('#txtSite').on('keypress', async (event) => {
    if (event.which == 13) await addSite();
})

$('#btnAddSite').on('click', addSite);

$('#mysites').on('click', '.btn-delete', (event) => {
    var $this = $(event.currentTarget);
    var hostname = $this.data('hostname');
    if (confirm('Remove ' + hostname + ' from this list?')) {
        storageService.removeSite(hostname);
        $this.parents('li').remove();
    }
})