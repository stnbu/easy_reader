var clickedEl = null;
var isSelecting = false;

//Handler function
var ononmouseover;
var onmouseout;
var onmouseup;
var onmouseupBackup;

//lắng nghe khi background.js gọi : khi click vào contextmenu
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "beginselectElement") {
        if (isSelecting == false) {
            handleListener();
        }
        else {
            unHandleListener();
        }
    }
    sendResponse({isSelecting: isSelecting});
});

//các hàm xử lý sự kiện chuột
ononmouseover = function (event) {
    clickedEl = event.target;
    classie.addClass(clickedEl, "highlight_fullscreen");
    return true;
}
onmouseout = function (event) {
    clickedEl = event.target;
    classie.removeClass(clickedEl, "highlight_fullscreen");
    return true;
}
onmouseup = function (event) {
    console.log(event);
    if (event.button == 0) {
        unHandleListener();
        chrome.runtime.sendMessage({action:"enterFullscreen",isSelecting: isSelecting}, function(response) {});
        clickedEl.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        clickedEl = null;
    }
    return false;
}

//Handle các listener
function handleListener() {
    isSelecting = true;
    document.addEventListener("mouseover", ononmouseover, false);
    document.addEventListener("mouseout", onmouseout, false);
    //Backup lại sự
    onmouseupBackup = document.body.onmouseup;
    document.body.onmouseup = onmouseup;
}

//phục hồi
function unHandleListener() {
    isSelecting = false;
    if (clickedEl) {
        classie.removeClass(clickedEl, "highlight_fullscreen");
    }
    document.removeEventListener("mouseover", ononmouseover);
    document.removeEventListener("mouseout", onmouseout);
    document.body.onmouseup = onmouseupBackup;
}