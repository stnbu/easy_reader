var clickedEl = null;
var isSelecting = false;

var onclickBackup;

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "beginselectElement") {
        if (isSelecting == false) {
            turnOnSelecting();
        }
        else {
            turnOffSelecting();
        }
    }
    sendResponse({isSelecting: isSelecting});
});

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
var onmouseclick = function (event) {
    console.log(event);
    if (event.button == 0) {
        turnOffSelecting();
        chrome.runtime.sendMessage({action:"enterFullscreen",isSelecting: isSelecting}, function(response) {});
        clickedEl.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        clickedEl = null;
    }
    return false;
}

function turnOnSelecting() {
    isSelecting = true;
    document.addEventListener("mouseover", ononmouseover, false);
    document.addEventListener("mouseout", onmouseout, false);
    onmouseupBackup = document.onmouseup;
    onclickBackup = document.body.onclick;
    document.body.onclick = onmouseclick
}

function turnOffSelecting() {
    isSelecting = false;
    if (clickedEl) {
        classie.removeClass(clickedEl, "highlight_fullscreen");
    }
    document.removeEventListener("mouseover", ononmouseover);
    document.removeEventListener("mouseout", onmouseout);
    document.body.onclick = onclickBackup;
}
