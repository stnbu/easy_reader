var clickedEl = null;
var isSelecting = false;

var onmouseupBackup;
var onclickBackup;

//lắng nghe khi background.js gọi : khi click vào contextmenu
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "beginselectElement") {
        if (isSelecting == false) {
            turnOnSelecting();
        }
        else {
            turonOffSelecting();
        }
    }
    sendResponse({isSelecting: isSelecting});
});

//các hàm xử lý sự kiện chuột
var ononmouseover = function (event) {
    clickedEl = event.target;
    classie.addClass(clickedEl, "highlight_fullscreen");
    return true;
}
var onmouseout = function (event) {
    clickedEl = event.target;
    classie.removeClass(clickedEl, "highlight_fullscreen");
    return true;
}
var onmouseup = function (event) {
    console.log(event);
    if (event.button == 0) {
        turonOffSelecting();
        chrome.runtime.sendMessage({action:"enterFullscreen",isSelecting: isSelecting}, function(response) {});
        clickedEl.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        clickedEl = null;
    }
    return false;
}

//Handle các listener
function turnOnSelecting() {
    isSelecting = true;
    document.addEventListener("mouseover", ononmouseover, false);
    document.addEventListener("mouseout", onmouseout, false);
    //Backup lại sự
    onmouseupBackup = document.onmouseup;
    onclickBackup = document.body.onclick;
    document.body.onmouseup = onmouseup;
    document.body.onclick = function(){return false};
}

//phục hồi
function turonOffSelecting() {
    isSelecting = false;
    if (clickedEl) {
        classie.removeClass(clickedEl, "highlight_fullscreen");
    }
    document.removeEventListener("mouseover", ononmouseover);
    document.removeEventListener("mouseout", onmouseout);
    document.body.onmouseup = onmouseupBackup;
    document.body.onclick = onclickBackup;
}