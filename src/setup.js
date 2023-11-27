// cool-ass ascii art i guess lmao
var styles1 = [
    'background: linear-gradient(#D33106, #571402)'
    , 'color: white'
    , 'display: block'
    , 'font-size: 18px'
    , 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)'
    , 'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
    , 'line-height: 25px'
    , 'font-weight: bold'
].join(';');
var styles2 = [
    'background: linear-gradient(#0629d3, #022c57)'
    , 'border: 5px solid rgb(255 255 255 / 10%)'
    , 'color: white'
    , 'display: block'
    , 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)'
    , 'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
].join(';');
var styles3 = [
    'background: linear-gradient(#06d316, #075702)'
    , 'border: 5px solid rgb(255 255 255 / 10%)'
    , 'color: white'
    , 'display: block'
    , 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)'
    , 'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
].join(';');

// Shortcuts
if (navigator.userAgent.includes("Chrome")) browser = chrome;
var storage = browser.storage.sync;
var extension = browser.extension;
var runtime = browser.runtime;

// Default config
var def_bk_config = {
    "showReleaseNotes": true,
    "toggleTagSearch": true
};

start();
function start() {
	storage.get(['BKConfig'], async function(result) {
		if (result == undefined || Object.keys(result).length == 0) {
			await storage.set({BKConfig: def_bk_config});
			userConfig = await storage.get(['BKConfig']);
            console.log(`%cBETTERKICK USER DATA (reset to default):`, styles3, userConfig);
            window.location.reload();
		} else {
			userConfig = result.BKConfig;
            console.log(`%cBETTERKICK USER DATA:`, styles3, userConfig);
		}
	});
}