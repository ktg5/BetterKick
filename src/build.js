const fs = require('fs-extra');
const fsPromises = require('fs/promises');
const path = require('path');
const Zip = require('adm-zip');


// Before starting, make sure that the other
// folders don't exist.
var chromeDir = '../BetterKick-Chrome';
var firefoxDir = '../BetterKick-Firefox';
if (fs.existsSync(chromeDir)) {
    console.log(`Deleting past Chrome folder`);
    fs.rmSync(chromeDir, { recursive: true });
    console.log(`Deleted past Chrome folder`);
}
if (fs.existsSync(firefoxDir)) {
    console.log(`Deleting past Firefox folder`);
    fs.rmSync(firefoxDir, { recursive: true });
    console.log(`Deleted past Firefox folder`);
}

// Function to copy all the dirs but not REALLY all of them.
async function copyDir(sourceDir, newDir) {
    // Get dirs in the project folder.
    var dirs = await fsPromises.readdir(sourceDir, { withFileTypes: true });
    await fsPromises.mkdir(newDir);
    
    // now we finna do something with all of these dirs
    for (let entry of dirs) {
        // Folders & files that we AIN'T ALLOWIN'!
        if (
            entry.name === '.git' ||
            entry.name === '.github' ||
            entry.name === 'psds' ||
            entry.name === 'node_modules' ||
            entry.name === 'build.js' ||
            entry.name === 'package-lock.json'
        ) continue;

        // If the files passed the vibe check, we go.
        const sourcePath = path.join(sourceDir, entry.name);
        const newPath = path.join(newDir, entry.name);
        if (entry.isDirectory()) {
            await copyDir(sourcePath, newPath);
        } else {
            await fsPromises.copyFile(sourcePath, newPath);
        }
    }
}

// Here's we build.
// So first, let's copy this folder for Chrome.
copyDir('./', chromeDir).then(async () => {
    console.log(`(Re)made the Chrome folder`);

    // If the zip already exists...
    if (fs.existsSync('../BetterKick-Chrome.zip')) {
        console.log("Deleting old Chrome zip");
        fs.unlinkSync('../BetterKick-Chrome.zip');
        console.log("Deleted old Chrome zip");
    }

    console.log("Zipping Chrome version...");
    // Try to zip up the extension
    try {
        const zip = new Zip();
        const outputDir = "../BetterKick-Chrome.zip";
        zip.addLocalFolder("../BetterKick-Chrome");
        zip.writeZip(outputDir);
    } catch (e) {
        console.log(`WHAT THE FRICK! ${e}`);
    }
    console.log(`Zipped Chrome version into ../BetterKick-Chrome.zip`);
    console.log(`-------------`);
});

// Then we copy the same folder for Firefox.
copyDir('./', firefoxDir).then(async () => {
    console.log(`(Re)made the Firefox folder`);
    // Then we modify the Firefox extension a bit cuz no
    // browser developer can come up with extension
    // manifest standards like WHY.
    var firefoxManifest = JSON.parse(fs.readFileSync('../BetterKick-Firefox/manifest.json', 'utf8'));
    firefoxManifest.manifest_version = 2;
    firefoxManifest.background = {
        "scripts": [
        "background.js"
        ],
        "persistent": false,
        "type": "module"
    }; // Add this so Firefox extension can work
    firefoxManifest.browser_specific_settings = {
        "gecko": {  
            "id": "{925b0516-774d-469d-bb0e-2b94f199b29a}"
        }
    };
    firefoxManifest.browser_action = {
        "default_popup": "html/popup.html",
        "default_icon": "img/BetterKick/icon.png"
    }; // Popups
    firefoxManifest.web_accessible_resources = [
        "css/*"
    ],
    delete firefoxManifest.action; // Manifest v2 moment
    delete firefoxManifest.background.service_worker; // This is for Chrome, Firefox will freak out if this isn't delete lol.
    // Write the manifest file for Firefox
    fs.writeFileSync('../BetterKick-Firefox/manifest.json', JSON.stringify(firefoxManifest, null, 2));

    // If the zip already exists...
    if (fs.existsSync('../BetterKick-Firefox.zip')) {
        console.log("Deleting old Firefox zip");
        fs.unlinkSync('../BetterKick-Firefox.zip');
        console.log("Deleted old Firefox zip");
    }

    console.log("Zipping Firefox version...");
    // Try to zip up the extension
    try {
        const zip = new Zip();
        const outputDir = '../BetterKick-Firefox.zip';
        zip.addLocalFolder("../BetterKick-Firefox");
        zip.writeZip(outputDir);
    } catch (e) {
        console.log(`WHAT THE FRICK! ${e}`);
    }
    console.log(`Zipped Firefox version into ../BetterKick-Firefox.zip`);
    // Delete folder cuz idk GitHub don't likey
    console.log("Deleting Firefox folder...");
    fs.rmSync('../BetterKick-Firefox', { recursive: true });
    console.log(`-------------`);
});