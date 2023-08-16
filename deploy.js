const fs = require('fs-extra');
const zipper = require("zip-local");
const jsonfile = require('jsonfile');
const path = require('path');
const { execSync } = require('child_process');

let releaseLocation = path.join(__dirname, "releases");
let distFolder = path.join(__dirname, "dist");
let publicFolder = path.join(__dirname, "public");
let manifestFilePath = path.join(publicFolder, "manifest.json");

function buildPackage() {
        return execSync("npm run build");
}

function getNewVersion(oldVersion) {
        let splitedVer = oldVersion.split('.');
        var ver = parseInt(splitedVer[2]);
        ver++;
        return `${splitedVer[0]}.${splitedVer[1]}.${ver}`;
}

function preparePackage() {
        // read manifest file
        var manifest = jsonfile.readFileSync(manifestFilePath);
        var version = getNewVersion(manifest.version);
        // replace version
        manifest.version = version;
        // save manifest file
        jsonfile.writeFileSync(manifestFilePath, manifest);

        // create zip
        zipper.sync.zip(distFolder).compress().save(path.join(releaseLocation, "googlerankchecker.zip"));
}

async function buildAndPrepare() {
        // Check if releaseLocation exists, create it if not
        const res = await fs.exists(releaseLocation);
        if (!res) {
                await fs.mkdir(releaseLocation);
        }
        // Try to build the package, catch any errors
        let isBuildSuccessful = false;
        try {
                buildPackage();
                isBuildSuccessful = true;
        } catch (error) {
                console.log(error.message);
                console.log("Use 'npm run build' to see the exact error.");
        }
        // If the build was successful, prepare the package
        if (isBuildSuccessful) {
                preparePackage();
        }
}

// Invoke the buildAndPrepare
(async () => {
        await buildAndPrepare();
})();