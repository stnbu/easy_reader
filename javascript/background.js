var pageContext = chrome.contextMenus.create({
        "id": "ext_fullscreen",
        "title": chrome.i18n.getMessage('selectElement'),
        "contexts": ["all"]
    }
);

var updateContextMenu = function (isSelected) {
    if (isSelected == true) {
        chrome.contextMenus.update(pageContext, {
            "title": chrome.i18n.getMessage('cancelSelection')
        });
    }
    else if (isSelected == false) {
        chrome.contextMenus.update(pageContext, {
            "title": chrome.i18n.getMessage('selectElement')
        });
    }

}

chrome.tabs.onUpdated.addListener(function (id, info, tab) {
    chrome.pageAction.show(tab.id);
});

chrome.pageAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript(tab.id, {code: "document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);"});
});

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "enterFullscreen") {
        console.log(request.isSelected);
        updateContextMenu(request.isSelected);
    }
    sendResponse({});
});

chrome.contextMenus.onClicked.addListener(
    function (info, tab) {
        chrome.tabs.sendMessage(tab.id, {action: "beginselectElement"}, function (response) {
            updateContextMenu(response.isSelected);
        });
    }
);

chrome.commands.onCommand.addListener(function (command) {
    if (command == "beginselectElement") {

        chrome.tabs.query({
            active: true,
            windowId: chrome.windows.WINDOW_ID_CURRENT
        }, function (tabs) {
            var tab = tabs[0];
            chrome.tabs.sendMessage(tab.id, "beginselectElement", function (response) {
                updateContextMenu(response.isSelected);
            });
        });

    }
});
