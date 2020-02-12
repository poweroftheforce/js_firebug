function CDEDebugger() {
	var oDebuggerDiv = document.body.appendChild(document.createElement("div"));
	oDebuggerDiv.id = "debugWindowContainer";
	oDebuggerDiv.style.width = "400px";
	oDebuggerDiv.style.backgroundColor = "#FFF";
	oDebuggerDiv.style.border = "1px solid #000";
	oDebuggerDiv.style.display = "none";
	this._debugWindow = oDebuggerDiv;
	
	var oDebuggerTitlebarDiv = oDebuggerDiv.appendChild(document.createElement("div"));
	oDebuggerTitlebarDiv.id = "oDebuggerTitlebarDiv";
	oDebuggerTitlebarDiv.style.width = "400px";
	oDebuggerTitlebarDiv.style.height = "16px";
	oDebuggerTitlebarDiv.style.backgroundColor = "#999";
	oDebuggerTitlebarDiv.style.color = "#000";
	oDebuggerTitlebarDiv.style.fontFamily = "Arial";
	oDebuggerTitlebarDiv.style.fontSize = "11px";
	oDebuggerTitlebarDiv.style.textAlign = "left";
	oDebuggerTitlebarDiv.style.cursor = "move";
	oDebuggerTitlebarDiv.onmousedown = CDEDebugger.prototype.tdOnMouseDown;
	this._debuggerTitlebar = oDebuggerTitlebarDiv;
	oDebuggerTitlebarDiv._cdeDebuggerWindow = this;
	
	var oDebuggerTitlebarTitleSpan = oDebuggerTitlebarDiv.appendChild(document.createElement("span"));
	oDebuggerTitlebarTitleSpan.id = "oDebuggerTitlebarTitleSpan";
	oDebuggerTitlebarTitleSpan.style.fontSize = "11px";
	oDebuggerTitlebarTitleSpan.style.marginLeft = "10px";
	oDebuggerTitlebarTitleSpan.style.color = "#000";
	oDebuggerTitlebarTitleSpan.innerHTML = "CDE Debugger v 1.0";
	
	var oDebuggerBtnCloseSpan = oDebuggerTitlebarDiv.appendChild(document.createElement("span"));
	oDebuggerBtnCloseSpan.style.position = "absolute";
	oDebuggerBtnCloseSpan.style.cursor = "pointer";
	oDebuggerBtnCloseSpan.style.right = "10px";
	oDebuggerBtnCloseSpan.innerHTML = "close";
	oDebuggerBtnCloseSpan.onmouseover = function() {this.style.color = "#FFF";}
	oDebuggerBtnCloseSpan.onmouseout = function() {this.style.color = "#000";}
	oDebuggerBtnCloseSpan._mainWindow = this._debugWindow;
	oDebuggerBtnCloseSpan.onclick = function() {this._mainWindow.style.display = "none";}
	
	var oDebuggerInnerDiv = oDebuggerDiv.appendChild(document.createElement("div"));
	oDebuggerInnerDiv.id = "oDebuggerInnerDiv";
	oDebuggerInnerDiv.style.width = "395px";
	oDebuggerInnerDiv.style.height = "200px";
	oDebuggerInnerDiv.style.paddingLeft = "5px";
	oDebuggerInnerDiv.style.overflowY = "scroll";
	oDebuggerInnerDiv.style.fontFamily = "Arial";
	oDebuggerInnerDiv.style.fontSize = "10px";
	this._debugMessageWindow = oDebuggerInnerDiv;
}

CDEDebugger.prototype.writeToDebugWindow = function(pString) {
	this._debugMessageWindow.innerHTML += pString + "<br />";
	this._debugMessageWindow.scrollTop = this._debugMessageWindow.scrollHeight;
}

CDEDebugger.prototype.showDebugWindow = function() {
	centerDiv(this._debugWindow);
	this._debugWindow.style.display = "block";
}

CDEDebugger.prototype.tdOnMouseDown = function() {
	this._cdeDebuggerWindow.onMouseDown();
}

CDEDebugger.prototype.onMouseDown = function() {
	// record that an onmousedown has just occurred
	this.bDown = true;
	
	// link from body to this JSWindow object
	document.body._cdeDebuggerWindow = this;

	// save body mouse handlers
	this.saveMouseMove = document.body.onmousemove;
	this.saveMouseUp = document.body.onmouseup;

	// set new handlers.
	document.body.onmousemove = CDEDebugger.prototype.bodyOnMouseMove;
	document.body.onmouseup = CDEDebugger.prototype.bodyOnMouseUp;
}

CDEDebugger.prototype.bodyOnMouseMove = function(evt) {
	var e = window.event ? window.event : evt;
	this._cdeDebuggerWindow.onMouseMove(e);
}

CDEDebugger.prototype.onMouseMove = function(evt) {
	// if mouse not down, stop the move (for IE only)
	if ((document.all) && !(evt.button & 1)) {
		this.onMouseUp();
		return;
	}
	if (this.bDown) {
		this.dx = parseInt(this._debugWindow.style.left, 10) - evt.clientX;
		this.dy = parseInt(this._debugWindow.style.top, 10) - evt.clientY;
		this.bDown = false;
	} else {
		this._debugWindow.style.left = Math.max((this.dx + evt.clientX),0) + "px";
		this._debugWindow.style.top = Math.max((this.dy + evt.clientY),0) + "px";
	}
}

CDEDebugger.prototype.bodyOnMouseUp = function() {
	this._cdeDebuggerWindow.onMouseUp();
}

CDEDebugger.prototype.onMouseUp = function() {
	document.body.onmouseup = this.saveMouseUp;
	document.body.onmousemove = this.saveMouseMove;
	document.body._cdeDebuggerWindow = null;
}

function centerDiv(element) {
//    try {
//        element = document.getElementById(element);
//    } catch(e) {
//        return;
//    }
    var my_width  = 0;
    var my_height = 0;
    if (typeof(window.innerWidth) == "number") {
        my_width = window.innerWidth;
        my_height = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        my_width = document.documentElement.clientWidth;
        my_height = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        my_width = document.body.clientWidth;
        my_height = document.body.clientHeight;
    }
    element.style.position = "absolute";
    element.style.zIndex = 100000;
    var scrollY = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollY = document.documentElement.scrollTop;
    } else if (document.body && document.body.scrollTop) {
        scrollY = document.body.scrollTop;
    } else if (window.pageYOffset) {
        scrollY = window.pageYOffset;
    } else if (window.scrollY) {
        scrollY = window.scrollY;
    }
    var setX = (my_width - element.offsetWidth) / 2;
    var setY = (my_height - element.offsetHeight) / 2 + scrollY;
    setX = (setX < 0) ? 0 : setX;
    setY = (setY < 0) ? 0 : setY;
    element.style.left = (setX - 200) + "px";
    element.style.top = (setY - 100) + "px";
}

if (window.mCallbackFunction) eval(mCallbackFunction);
