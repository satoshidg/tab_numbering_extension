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

function tabIsNumbered(title) {
    return tabNumberRegEx.test(title.substr(0, 3));
}

function numberTabs(tabs) {
    const lastTabIndex = tabs.length - 1;

    for (let index = 0; index < tabs.length; index++) {
        let tabNumber = index + 1; // Actual numbering of the tab
        let tabName = tabs[index].title;

        // Remove all existing numbering
        if (tabIsNumbered(tabName)) {
            tabName = tabName.substr(3);
        }

        if (index < 8) {
            tabName = `{${tabNumber}} ${tabName}`;
        } else if (index == lastTabIndex) {
            tabName = `{9} ${tabName}`;
        }

        let script = `document.title = "${tabName}"`;

        chrome.tabs.executeScript(tabs[index].id, {code: script});
    }
}

function numberAllTabs() {
    chrome.tabs.query({}, function(tabs) {
        numberTabs(tabs);
    });
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
