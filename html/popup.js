// Shortcuts
var browser = browser;
if (navigator.userAgent.includes("Chrome")) { 
    browser = chrome 
};
var storage = browser.storage.sync;
var extension = browser.extension;
var runtime = browser.runtime;

// Default config
var def_bk_config = {
    "showReleaseNotes": true,
    "toggleTagSearch": true
};

// Init document
document.head.insertAdjacentHTML(
    'afterend',

    `
    <div id="content"></div>
    `
)

// Get config
storage.get(['BKConfig'], async function(result) {
    if (result.BKConfig == undefined) {
        storage.set({BKConfig: def_bk_config}, async function(newResult) {
            var newConfig = await storage.get(['BKConfig']);
            var userConfig = newConfig.BKConfig;
            start(userConfig);
        });
    } else {
        var userConfig = result.BKConfig;
        start(userConfig);
    }
});

/// Version
var version = runtime.getManifest().version;

async function start(userConfig) {

    /// Update User DB
    async function changeUserDB(option, newValue, lightElement) {
        if (newValue == "") newValue = null;
        if (lightElement) {
            if (lightElement.children[0].classList.contains('true')) {
                lightElement.children[0].classList.remove('true');
                lightElement.children[0].classList.add('false');
                userConfig[option] = false;
                await storage.set({BKConfig: userConfig});
            } else if (lightElement.children[0].classList.contains('false')) {
                lightElement.children[0].classList.remove('false');
                lightElement.children[0].classList.add('true');
                userConfig[option] = true;
                await storage.set({BKConfig: userConfig});
            } else {
                lightElement.children[0].classList.add('true');
                userConfig[option] = true;
                await storage.set({BKConfig: userConfig});
            }
        } else {
            userConfig[option] = newValue;
            await storage.set({BKConfig: userConfig});
        }
        console.log(`BetterKick USER DATA CHANGED:`, await storage.get(['BKConfig']));
    }

    /// Reset settings cuz I've been having to manually do it so many times YOU DON'T KNOW BRO IT GETS TO ME MAN!!!!!!!!!
    function resetConfig() {
        storage.set({BKConfig: def_bk_config});
        console.log(`BetterKick USER DATA RESET:`, storage.get(['BKConfig']));
        alert(`Your BetterKick config has been reset, please refresh the page!!!`);
    }

    /// Make options in menu
    function makeMenuOption(type, option, desc, values, disableOpinions) {
        switch (type) {
            case 'selection':
                var disabledOutput = ``;
                if (disableOpinions) {
                    disabledOutput = `aria-disabled='${disableOpinions}'`
                }
                return `
                <div class="menu-option">
                    <div class="menu-name">${desc}</div>
                    <select class="menu-select menu-action" name="${option}" ${disabledOutput}>
                        ${values}
                    </select>
                </div>
                `
            case 'toggle':
                var disabledOutput = ``;
                if (disableOpinions) {
                    disabledOutput = `aria-disabled='${disableOpinions}'`
                }
                return `
                <div class="menu-option">
                    <div class="menu-name">${desc}</div>
                    <button class="menu-toggle menu-action" name="${option}" ${disabledOutput}>
                        <div class="light ${userConfig[option]}"></div>
                    </button>
                </div>
                `
            case 'input':
                var disabledOutput = ``;
                if (disableOpinions) {
                    disabledOutput = `aria-disabled='${disableOpinions}'`
                }
                if (values == 'color') {
                    return `
                    <div class="menu-option">
                        <div class="menu-name">${desc}</div>
                        <div style="position: relative; left: 12px;">
                            <input type="text" data-coloris class="menu-color-picker menu-action" name="${option}" value="${userConfig[option] ?? '#ffffff'}" ${disabledOutput}>
                            <button class='menu-input-reset menu-action'>
                                <img src="https://raw.githubusercontent.com/ktg5/betterkick-Player/main/img/reset.png" style="height: 1em;">
                            </button>
                        </div>
                    </div>
                    `
                } else if (values == 'text') {
                    return `
                    <div class="menu-option">
                        <div class="menu-name">${desc}</div>
                        <div>
                            <input type="text" class="menu-input menu-action" name="${option}" value="${userConfig[option] ??  ''}" ${disabledOutput}>
                            <button class='menu-input-reset menu-action' style="width: 2em;">
                                <img src="https://raw.githubusercontent.com/ktg5/betterkick-Player/main/img/reset.png" style="height: 1em;">
                            </button>
                        </div>
                    </div>
                    `
                } else if (values == 'pxs') {
                    return `
                    <div class="menu-option">
                        <div class="menu-name" style="max-width: 12em;">${desc}</div>
                        <div style="position: relative; left: 12px;">
                            <input type="text" style="width: 4em;" class="menu-input menu-action" name="${option}" value="${userConfig[option] ??  ''}" ${disabledOutput}>px
                            <button class='menu-input-reset menu-action' style="width: 2em;">
                                <img src="https://raw.githubusercontent.com/ktg5/betterkick-Player/main/img/reset.png" style="height: 1em;">
                            </button>
                        </div>
                    </div>
                    `
                } else if (values == 'url') {
                    return `
                    <div class="menu-option">
                        <div class="menu-name">${desc} (Must be an <kbd>https</kbd> link!)</div>
                        <div>
                            <input type="text" class="menu-input menu-action" name="${option}" value="${userConfig[option] ??  ''}" ${disabledOutput}>
                            <button class='menu-input-reset menu-action' style="width: 2em;">
                                <img src="https://raw.githubusercontent.com/ktg5/betterkick-Player/main/img/reset.png" style="height: 1em;">
                            </button>
                        </div>
                    </div>
                    `
                }
        }
    }

    /// Get year options for menu
    var years = [2015, 2012, 2010];
    var yearOptions = '';
    years.forEach(element => {
        if (element == userConfig['year']) {
            yearOptions += `<option value="${element}" selected>${element}</option> `
        } else {
            yearOptions += `<option value="${element}">${element}</option> `
        }
    });

    /// Get user config to display
    function getUserConfigText() {
        var output = '{';
        var count = 0;
        for (let element in userConfig) {
            count++;
        };
        var counted = 0;
        for (let element in userConfig) {
            counted++
            if (counted == count) {
                if (typeof userConfig[element] !== 'string') {
                    output += `\n "${element}": ${userConfig[element]}`
                } else if (userConfig[element]) {
                    output += `\n "${element}": "${userConfig[element]}"`
                }
            } else {
                if (typeof userConfig[element] !== 'string') {
                    output += `\n "${element}": ${userConfig[element]},`
                } else if (userConfig[element]) {
                    output += `\n "${element}": "${userConfig[element]}",`
                }
            }
        }
        output += '\n}'
        console.log(`getUserConfigText`, `${output}`)
        return output;
    };

    /// Set user config from input element at the bottom of the settings menu
    function overWriteUserConfig(input) {
        // Starting vars
        var completedCount = 0;
        var unknownCount = 0;

        var jsonInput;
        try {
            jsonInput = JSON.parse(input);
        } catch (error) {
            alert(`A error happened when trying to set the config! Did you put any extra characters?`)
        }
        
        // Check 
        for (let element in jsonInput) {
            if (def_bk_config[element] === undefined) {
                unknownCount++;
            } else {
                userConfig[element] = jsonInput[element];
                completedCount++;
            }
        }
        storage.set({BKConfig: userConfig});

        // Finish
        alert(`User config completed. ${completedCount} settings were written, ${unknownCount} settings were not written`);
        console.log(`overWriteUserConfig input:`, jsonInput);
        console.log(`overWriteUserConfig current config:`, userConfig);
    }

    // Start menu
    var collectedUserConfig = getUserConfigText();
    // Base content
    document.getElementById(`content`).insertAdjacentHTML(
        `beforebegin`,

        `
        <!-- Menu -->
        <div id="betterkick-menu">
            <a><div class="warning">
                <h3>Reload page for changes to take effect!</h3>
            </div></a>

            <img src="../img/BetterKick/logo.png" style="width: 200px;">
            <div class="version"> v${version}</div>

            <br>

            <div class="links">
                <a href="update.html" target="_blank">Release Notes</a>
                <a href="https://ktg5.online" target="_blank">ktg5.online</a>
            </div>

            <br>

            <h3>General Settings</h3>

            ${makeMenuOption('toggle', 'showReleaseNotes', 'Toggle Release Notes when reloading or updating BetterKick')}

            ${makeMenuOption('toggle', 'toggleTagSearch', 'Toggle the tag search that displays on category pages')}

            <br>

            <h3>Import, Copy, or Reset Settings</h3>

            <textarea
            id="menu-config-selection"
            style="width: 21.2em; height: 8em; resize: vertical;"
            >${collectedUserConfig}
            </textarea>
        </div>
        `
    )

    // Move everything to the body element
    setTimeout(() => {
        document.body.appendChild(document.getElementById('betterkick-menu'));
    }, 10);

    // Ending stuffs
    document.getElementById(`menu-config-selection`).insertAdjacentHTML(
        `afterend`,
        
        `
        <button class="menu-apply-overwrite-button">
            Apply Settings
        </button>

        <br>
        <br>

        <button class="menu-nuke-all">
            THE BIG NUKE BUTTON. (aka reset all settings) NO TURNING BACK WHEN THIS IS PRESSED.
        </button>

        <div class="blank"></div>
    `)

    // Event listener to make the BUTTONS ACTUALLY WORK LIKE WHY
    var buttons = document.getElementsByClassName('menu-action');
    console.log(`buttons:`, buttons)
    for (let element of buttons) {
        console.log(element);

        // For disabling opinions that conflict with others
        function disableAria(element) {
            if (element.ariaDisabled !== null) {
                var disableThese = element.ariaDisabled.split(',');
                disableThese.forEach(target => {
                    var targetElement = document.getElementsByName(`${target}`)[0];
                    if (targetElement) {
                        if (element.childNodes[1].classList.contains('true')) {
                            targetElement.style.display = 'none';
                        } else if (element.childNodes[1].classList.contains('false')) {
                            targetElement.style.display = '';
                        }
                    }
                });
            };
        }

        switch (element.classList[0]) {
            case 'menu-select':
                element.addEventListener('click', async () => {
                    changeUserDB(element.name, element.value);
                    disableAria(element);
                });
            break;

            case 'menu-toggle':
                element.addEventListener('click', async () => {
                    changeUserDB(element.name, '', element);
                    if (element.childNodes[1].classList.contains("undefined")) element.childNodes[1].classList.remove('undefined')
                    disableAria(element);
                });
            break;

            case 'menu-input':
                element.addEventListener('change', async () => {
                    changeUserDB(element.name, element.value);
                    disableAria(element);
                });
            break;

            case 'menu-color-picker':
                element.addEventListener('change', async () => {
                    changeUserDB(element.name, element.value);
                    disableAria(element);
                });
            break;

            case 'menu-input-reset':
                element.addEventListener('click', async () => {
                    if (element.parentElement.children[0].classList.contains('clr-field')) {
                        var clr_field = element.parentElement.children[0];
                        changeUserDB(clr_field.children[1].name, null);
                        clr_field.children[1].value = '#ffffff';
                        clr_field.style.color = '#ffffff';
                        alert(`The "${clr_field.children[1].name}" setting has been reset.`);
                    } else {
                        changeUserDB(element.parentElement.children[0].name, null);
                        element.parentElement.children[0].value = '';
                        alert(`The "${element.parentElement.children[0].name}" setting has been reset.`);
                    }
                    disableAria(element);
                });
            break;

            default:
                alert(`One of the buttons for the settings can't find itself, please report this! "${element.classList}"`)
            break;
        }
    }
    // Event listeners for reset & overwrite config.
    document.getElementsByClassName('menu-apply-overwrite-button')[0]
    .addEventListener('click', async () => {
        overWriteUserConfig(document.getElementById(`menu-config-selection`).value)
    });

    document.getElementsByClassName('menu-nuke-all')[0]
    .addEventListener('click', async () => {
        resetConfig()
    });

}