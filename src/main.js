// hi this is betterkick...
// Vars
var currentPath = window.location.href;

// #################################

// MOVING ELEMENTS
function moveElement(element, targetDiv, pasteDiv) {
    console.log(`%cPlayerTube moveElement function: ${targetDiv.contains(element)}`, styles2)
    if (pasteDiv.contains(element)) {
        return;
    } else if (targetDiv.contains(element)) {
        pasteDiv.parentNode.insertBefore(targetDiv.removeChild(element), pasteDiv.parentNode.firstElementChild);
        return;
    } else {
        return;
    }
};

// Heartbeats
/// Make sure script reruns on page update.
/// And make check progress bar value in case to change it.
setInterval(() => {
    // Check window href
    if (window.location.href == currentPath) {
        return;
    } else {
        startBase();
        addSearch();

        currentPath = window.location.href;
    }
}, 1000);

// Initial start
var loadedCSS = false;
startBase();
addSearch();

// Base starting function
function startBase() {
    if (loadedCSS == false) {
        var link = runtime.getURL(`css/base.css`);
        document.body.insertAdjacentHTML('afterbegin', `<link id="betterkick-css" class="betterkick-base" rel="stylesheet" type="text/css" href="${link}">`);
        loadedCSS = true;
    }
}

// For searching in categories
function addSearch() {
    if (window.location.pathname.includes('categories') && userConfig.toggleTagSearch !== false) {
        var timer = setInterval(() => {
            // Check what type of category we're in
            var cateStart;
            if (document.getElementsByClassName('mb-5 flex items-center space-x-4')[0]) {
                cateStart = document.getElementsByClassName('mb-5 flex items-center space-x-4')[0];
            } else if (document.getElementsByClassName('mt-5 flex items-center space-x-4')[0]) {
                cateStart = document.getElementsByClassName('mt-5 flex items-center space-x-4')[0];
            }

            // If found which type, we go!
            if (cateStart) {
                // Add the search bar
                cateStart.insertAdjacentHTML('afterend',
                
                `
                <div id="betterkick-search" class="relative h-full w-full grow pt-5">
                    <spam>Search by tag: </spam> <input type="text" id="betterkick-search-cate">
                    <br>
                    <spam>(Change sort before searching!)</spam>
                </div>

                <div id="betterkick-search-result" class="relative h-full w-full grow pt-5" style="display: none;">
                    <b>Result amount: <spam class="result-count"><spam></b>
                    ${document.querySelector('#livestreams .mb-4').innerHTML}
                </div>
                `
                )

                // Add event listener
                var searchBar = document.getElementById("betterkick-search-cate");
                searchBar.addEventListener("keyup", (e) => {
                    switch (e.key.toLowerCase()) {
                        case 'enter':
                            searchStreams(searchBar.value);
                        break;
                    
                        case 'backspace':
                            returnStreams();
                        break;
                    }
                });

                // Stop checking for that element
                clearInterval(timer);
            }
        }, 1000);
    }
}
// Search using tags function
function searchStreams(input) {
    var num = 0;
    var result;
    for (var elmnt of document.querySelectorAll('#betterkick-search-result .category-tag-component')) {
        var okay = false;
        for (var tags of elmnt.parentNode.childNodes) {
            if (tags.innerHTML) {
                if (tags.innerHTML.toLowerCase() == input) {
                    okay = true;
                }
            }
        }
        if (okay == false) {
            elmnt.parentNode.parentNode.parentNode.parentNode.remove();
        }

        num++
    }

    // Return stream count.
    var returnedStreams;
    document.querySelector('#betterkick-search-result').childNodes.forEach(tempE => {
        if (tempE.classList) {
            returnedStreams = tempE.childNodes[0].childNodes.length;
        }
    });
    document.querySelector('.result-count').innerHTML = returnedStreams;

    // Display results
    document.querySelector(`#livestreams`).style.display = 'none';
    document.querySelector(`#betterkick-search-result`).style.display = 'block';
}
// Reset search & display original search
function returnStreams() {
    document.getElementById('betterkick-search-result').childNodes.forEach(tempE => {
        if (tempE.classList) {
            tempE = document.querySelector('#livestreams .mb-4').innerHTML;
        }
    });
    document.querySelector('.result-count').innerHTML = '';

    document.querySelector(`#livestreams`).style.display = 'block';
    document.querySelector(`#betterkick-search-result`).style.display = 'none';
}