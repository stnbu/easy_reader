//Add một context menu
var pageContext = chrome.contextMenus.create({
        "id": "ext_fullscreen",
        "title": chrome.i18n.getMessage('selectElement'),
        "contexts": ["all"]
    }
);

//phương thức để thanh đổi text của context menu
var updateContextMenu = function (isSelecting) {
    if (isSelecting == true) {
        chrome.contextMenus.update(pageContext, {
            "title": chrome.i18n.getMessage('cancelSelection')
        });
    }
    else if (isSelecting == false) {
        chrome.contextMenus.update(pageContext, {
            "title": chrome.i18n.getMessage('selectElement')
        });
    }

}

//Hiển thị page action trên mọi tab
chrome.tabs.onUpdated.addListener(function (id, info, tab) {
    chrome.pageAction.show(tab.id);
});

//Handle ẽự kiện khi click vào page action
chrome.pageAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript(tab.id, {code: "document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);"});
});

//Handle message từ contextScript
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "enterFullscreen") {
        console.log(request.isSelecting);
        updateContextMenu(request.isSelecting);
    }
    sendResponse({});
});

//handle sự kiện click vào context
chrome.contextMenus.onClicked.addListener(
    function (info, tab) {
        chrome.tabs.sendMessage(tab.id, {action: "beginselectElement"}, function (response) {
            updateContextMenu(response.isSelecting);
        });
    }
);

//Nếu cài extension từ thư mục, thì mỗi khi thay đổi shortcut key phải delete extension ra khỏi chrome rồi add lại.
chrome.commands.onCommand.addListener(function (command) {
    if (command == "beginselectElement") {

        chrome.tabs.query({
            active: true, // tab dang duoc hien thi cho nguoi dung
            windowId: chrome.windows.WINDOW_ID_CURRENT // windows hien tai
        }, function (tabs) {
            // and use that tab to fill in out title and url
            var tab = tabs[0];
            chrome.tabs.sendMessage(tab.id, "beginselectElement", function (response) {
                updateContextMenu(response.isSelecting);
            });
        });

    }
});