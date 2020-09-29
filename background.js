/* 
    Run numbering when 
        1. a new tab is created
        2. a tab is removed
        3. a tab is moved
        4. a tab is updated <- mainly for when a tab is loaded fully
        5. a tab is attached to the current window
        6. a tab is detached from the current window
        7. a tab is replaced
*/

const tabNumberRegEx = /{[1-9]}/;

function getTabIsNumbered(title) {
    return tabNumberRegEx.test(title);
}

function numberAllTabs() {
    chrome.tabs.query({}, function(tabs) {
        numberTabs(tabs);
    });
}

function numberTabs(tabs) {
    let index = 0;
    let lastTabIndex = tabs.length - 1;

    for (index = 0; index < tabs.length; index++) {
        let tabNumber = index + 1;
        let currentTabName = tabs[index].title;
        let script = "";

        if (getTabIsNumbered(currentTabName)) {
            currentTabName = currentTabName.substr(3);
        }

        if (index < 8) {
            let tabName = "{" + tabNumber + "} " + currentTabName;
            script = "document.title = '" + tabName + "'";
        } else if (index == lastTabIndex) {
            let tabName = "{9} " + currentTabName;
            script = "document.title = '" + tabName + "'";
        } else {
            // When a tab is between 8 and last, make sure to delete the numbering if it exists
            script = "document.title = '" + currentTabName + "'";
        }
        chrome.tabs.executeScript(tabs[index].id, {code: script});
    }
}



chrome.tabs.onCreated.addListener(function() {
    numberAllTabs();
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    numberAllTabs();
});

chrome.tabs.onMoved.addListener(function() {
    numberAllTabs();
});

chrome.tabs.onRemoved.addListener(function() {
    numberAllTabs();
});

chrome.tabs.onReplaced.addListener(function() {
    numberAllTabs();
});

chrome.tabs.onDetached.addListener(function() {
    numberAllTabs();
});

chrome.tabs.onAttached.addListener(function() {
    numberAllTabs();
});
