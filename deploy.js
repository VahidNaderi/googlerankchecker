const fs = require('fs-extra');
const zipper = require("zip-local");
const jsonfile = require('jsonfile');
const path = require('path');

const itemId = "EXTENSION_ID";
var buildLocation = path.join(__dirname, "releases");
let appFolder = path.join(__dirname, "src");

// read manifest file
var manifest = jsonfile.readFileSync(path.join(appFolder, "manifest.json"));
function getNewVersion() {
        let splitedVer =manifest.version.split('.');
       var ver = parseInt(splitedVer[2]);
       ver++;
       return `${splitedVer[0]}.${splitedVer[1]}.${ver}`;
}
var version = getNewVersion();
// replace version
manifest.version = version;
// save manifest file
jsonfile.writeFileSync(path.join(buildLocation, "manifest.json"), manifest);

// create zip
zipper.sync.zip(appFolder).compress().save(path.join(buildLocation, "googlerankchecker.zip"));
//const fileBin = fs.readFileSync(path.join(buildLocation, "googlerankchecker.zip"));