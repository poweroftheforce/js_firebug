var _scrollTop = 0;
var _elementInCheck = null;

css = document.body.appendChild(document.createElement("link"));
css.id = "cssReaderCss";
css.rel = "stylesheet";
css.href = "http://10.69.17.13/CDEObjects/CSS%20Reader/css_reader.css";
//css.href = "http://192.168.1.7/CDEObjects/CSS%20Reader/css_reader.css";
css.type = "text/css";

styleSheetReader.prototype.createPreviewPopup = function(e) {
	var posx = 0;
	var posy = 0;
	if (!e) var e = window.event;
	if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	}
	else if (e.clientX || e.clientY) {
		posx = e.clientX + document.body.scrollLeft	+ document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	var popupContainer = document.body.appendChild(document.createElement('div'));
	popupContainer.id = 'popupContainer';
	popupContainer.style.zIndex = getHighestZIndex() + 1;
	switch (this._previewType) {
		case 'color':
			popupContainer.className = 'colorPopup';
			popupContainer.style.background = this.value;
			break;
		case 'image':
			popupContainer.className = 'imagePopup';
			var oImage = document.createElement('img');
			oImage.src = this._image;
			var _mW = oImage.width;
			var _mH = oImage.height;
			oImage.width = '100';
			popupContainer.appendChild(oImage);
			if (document.all) popupContainer.innerHTML += '<br />';
			popupContainer.innerHTML += _mW + ' x ' + _mH;
			break;
	}
	popupContainer.style.left = posx + 'px';
	popupContainer.style.top = (posy + 20) + 'px';
}

function destroyPreviewPopup() {document.body.removeChild(document.getElementById('popupContainer'));}

function getHighestZIndex() {
	var allElements = document.getElementsByTagName("*");
	var mZindices = new Array();
	mZindices[0] = 0;
	for (var i=0; i<allElements.length; i++) {
		if (allElements[i].nodeType == 1) {
			if (document.all) {
				if (allElements[i].currentStyle) {
					mZIndex = allElements[i].currentStyle["zIndex"];
					if (!isNaN(mZIndex)) mZindices.push(mZIndex);
				} else if (window.getComputedStyle) {
					mZIndex = document.defaultView.getComputedStyle(allElements[i], null).getPropertyValue("zIndex");
					if (!isNaN(mZIndex)) mZindices.push(mZIndex);
				}
			} else {
				if (allElements[i].currentStyle) {
					mZIndex = allElements[i].currentStyle["z-index"];
					if (!isNaN(mZIndex)) mZindices.push(mZIndex);
				} else if (window.getComputedStyle) {
					mZIndex = document.defaultView.getComputedStyle(allElements[i], null).getPropertyValue("z-index");
					if (!isNaN(mZIndex)) mZindices.push(mZIndex);
				}
			}
		}
	}
	mZindices = mZindices.sort(sortZindex);
	return parseInt(mZindices[mZindices.length - 1]);
}

function sortZindex(a, b) {return a - b;}

function styleSheetReader() {
	this.fontFamilies = [
		'Arial, Helvetica, sans-serif',
		'"Courier New", Courier, monospace',
		'Geneva, Arial, Helvetica, sans-serif',
		'Georgia, "Times New Roman", Times, serif',
		'"Times New Roman", Times, serif',
		'Verdana, Arial, Helvetica, sans-serif'
	];
	this._styleSheets = document.styleSheets;
	this._ruleSet = new Array();
	this._outputWindow = new SSROutputWindow();
	this._outputWindow.showDebugWindow();
	for (var i=0; i<this._styleSheets.length; i++) {
		try {
			this._rules = this._styleSheets[i].cssRules ? this._styleSheets[i].cssRules : this._styleSheets[i].rules;
			this._ruleSet[i] = new Object();
			this._ruleSet[i]._rule = new Array();
			this._ruleSet[i]._href = this._styleSheets[i].href
			for (var j=0; j<this._rules.length; j++) {
				this._ruleSet[i]._rule.push(this._rules[j]);
			}
		} catch(e) {
		}
	}
	var noStylePhrase = document.createElement("span");
	noStylePhrase.id = 'noStylePhrase';
	noStylePhrase.innerHTML = 'No Styles';
	this._outputWindow.appendMessage(noStylePhrase);
	document.body.onmousedown = this.inspectElement;
}

styleSheetReader.prototype.getStyles = function(pElement) {
	var _mStyles = new Array();
	if (this._ruleSet) {
		for (var h=0; h<this._ruleSet.length; h++) {
			if (this._ruleSet[h] == undefined) continue;
			if (this._ruleSet[h]._href.indexOf('css_reader.css') != -1) continue;
			if (this._ruleSet[h]._rule) {
				for (var i=0; i<this._ruleSet[h]._rule.length; i++) {
					if (!this._ruleSet[h]._rule[i].selectorText) continue;
					if (this._ruleSet[h]._rule[i].selectorText.toLowerCase() == 'unknown') continue;
					this._selectorText = this._ruleSet[h]._rule[i].selectorText;
					var _splitSelectorText = this._selectorText.split(',');
					for (var j=0; j<_splitSelectorText.length; j++) {
						var _currentElement = pElement;
						var _lastElement = _elementBeforeDC = null;
						var _matchCounter = 0;
						var _neededBranch = _mNodeName = '';
						var _directChildSymbolFound = false;
						var _eachBranch = _splitSelectorText[j].replace(/^\s+/g, '').replace(/\s+$/g, '').split(' ');
						_eachBranch.reverse();
						// go through each branch backwards
						// div p a
						// becomes
						// a p div
						//for (k=0; k<_eachBranch.length; k++) {
						while (_matchCounter < _eachBranch.length) {
							if (!_currentElement) break;
							if (_currentElement.nodeType != 1) break;
							if (_currentElement.nodeName == 'BODY') break;
							var _isID = _isClassName = _isNodeName = _isAdjacent = _isDirectChild = _matchFound = false;
							// get the needed branch of the selectorText a, p, div, #id etc...
							_neededBranch = _eachBranch[_matchCounter];
							if (_eachBranch[_matchCounter].indexOf(':') != -1) _neededBranch = _eachBranch[_matchCounter].split(':')[0];
							// check for ID
							if (_neededBranch.indexOf('#') != -1) {
								_isID = true;
								if (_currentElement.id) {
									if (_neededBranch.substring(_neededBranch.indexOf('#') + 1, _neededBranch.length) == _currentElement.id) {
										if (_directChildSymbolFound) {
											if (_elementBeforeDC.parentNode == _currentElement) {_matchFound = true; _matchCounter++;}
										} else {
											_matchFound = true;
											_matchCounter++;
										}
									}
								}
							}
							// check for ClassName
							if (_neededBranch.indexOf('.') != -1) {
								_isClassName = true;
								for (x=0; x<_currentElement.attributes.length; x++) {
									if (_currentElement.attributes.item(x).nodeName == 'class') {
										if (_currentElement.attributes.item(x).nodeValue.indexOf(_neededBranch.substring(1, _neededBranch.length)) != -1) {
											if (_directChildSymbolFound) {
												if (_elementBeforeDC.parentNode == _currentElement) {_matchFound = true; _matchCounter++;}
											} else {
												_matchFound = true;
												_matchCounter++;
											}
										}
									}
								}
							}
							if (_neededBranch == '+') {_currentElement = _lastElement.previousSibling.previousSibling; _matchCounter++; continue;}
							if (_neededBranch == '>') {_directChildSymbolFound = true; _elementBeforeDC = _lastElement; _currentElement = _lastElement; _matchCounter++; continue;}
							if (!_isID && !_isClassName && !_isAdjacent && !_isDirectChild) {_isNodeName = true; _mNodeName = _neededBranch.toLowerCase();}
							if (_isNodeName) {if (_mNodeName == _currentElement.nodeName.toLowerCase()) {_matchFound = true; _matchCounter++;}}
							// if a match is found then
							// see if we have checked each branch
							// if so then write to cssText
							// if not then goto the next branch while moving through the DOM
							if (_matchFound) {
								if (_matchCounter == _eachBranch.length) {
									if (document.all) {
										var _temp2 = this._ruleSet[h]._rule[i].style.cssText.split(';');
										var _cssText = '';
										for (var y=0; y<_temp2.length; y++) {
											var _cssTextDefinition = _temp2[y].split(':')[0].toLowerCase();
											var _cssTextProperty = _temp2[y].split(':')[1];
											_cssText += _cssTextDefinition + ':' + _cssTextProperty + ';';
										}
										_mStyles.push(this.createRule(_splitSelectorText[j], _cssText, this._ruleSet[h]._href));
									} else {
										_mStyles.push(this.createRule(_splitSelectorText[j], this._ruleSet[h]._rule[i].style.cssText, this._ruleSet[h]._href));
									}
								}
							} else {
								// if no match was found and we're on the first branch,
								// let's break out of the loop
								if (_matchCounter == 0) {break;}
							}
							_lastElement = _currentElement;
							_currentElement = _currentElement.parentNode;
						}
						
					}
				}
			}
		}
	}
	for (var i=0; i<pElement.attributes.length; i++) if (pElement.attributes.item(i).nodeName == 'style') if (pElement.attributes.item(i).nodeValue) _mStyles.push(pElement.attributes.item(i).nodeValue);
	return _mStyles;
}

styleSheetReader.prototype.inspectElement = function(event) {
	if (event == null) event = window.event;
	var target = event.target != null ? event.target : event.srcElement;
	var _button = 0;
	if (document.all) _button = 1
	if (event.button == _button) {
		var _node = target;
		if (_node.nodeType != 1) return;
		while (_node) {
			if (_node.id == 'outputWindowContainer') return;
			_node = _node.parentNode;
		}
		_mStyleReader.matchStyles(target);
	}
}

styleSheetReader.prototype.showCssFiles = function() {
	this._outputWindow.clearSSOutputWindow();
	var oSSOutputContainer = document.createElement('div');
	oSSOutputContainer.id = 'oSSOutputContainer';
	if (this._ruleSet) {
		for (var h=0; h<this._ruleSet.length; h++) {
			if (this._ruleSet[h] == undefined) continue;
			if (this._ruleSet[h]._href.indexOf('css_reader.css') != -1) continue;
			if (this._ruleSet[h]._rule) {
				var _cssFileName = '';
				if (this._ruleSet[h]._href.lastIndexOf('/') != -1) _cssFileName = this._ruleSet[h]._href.substring(this._ruleSet[h]._href.lastIndexOf('/') + 1, this._ruleSet[h]._href.length);
				else _cssFileName = this._ruleSet[h]._href;
				oSSOutputContainer.innerHTML += '<a class="cssHrefConatiner" href="' + this._ruleSet[h]._href + '" target="_blank">' + _cssFileName + '</a><br />';
				for (var j=0; j<this._ruleSet[h]._rule.length; j++) {
					if (!this._ruleSet[h]._rule[j].selectorText) continue;
					if (this._ruleSet[h]._rule[j].selectorText.toLowerCase() == 'unknown') continue;
					var _selectorText = this._ruleSet[h]._rule[j].selectorText;
					var _cssText = this._ruleSet[h]._rule[j].style.cssText;
					oSSOutputContainer.innerHTML += _selectorText + ' {<br />';
					var temp = _cssText.split(';');
					if (document.all) {
						for (var k=0; k<temp.length; k++) {
							if (temp[k] != '') oSSOutputContainer.innerHTML += '<span style="color: #00F; padding-left: 20px;">' + temp[k] + ';</span><br />';
						}
					} else {
						for (var k=0; k<temp.length - 1; k++) oSSOutputContainer.innerHTML += '<span style="color: #00F; padding-left: 20px;">' + temp[k] + ';</span><br />';
					}
					oSSOutputContainer.innerHTML += '}<br /><br />';
				}
			}
		}
	}
	this._outputWindow.ssOutputAppendMessage(oSSOutputContainer);
}

styleSheetReader.prototype.getLineNumber = function(pSelectorText) {
	for (var i=0; i<this._styleSheets.length; i++) {
		try {
			var _rules = this._styleSheets[i].cssRules ? this._styleSheets[i].cssRules : this._styleSheets[i].rules;
			for (var j=0; j<_rules.length; j++) {
				var _rule = _rules[j];
				if (_rule) {
					for (var k=0; k<this._rule.length; k++) {
						if (!this._rule[k].selectorText) continue;
						if (this._rule[k].selectorText.toLowerCase() == 'unknown') continue;
						if (_rules[k].selectorText == pSelectorText) return k + 1;
					}
				}
			}
		} catch(e) {
		}
	}
	return '';
}

var dCounter = 0;
styleSheetReader.prototype.createRule = function(pSelectorText, pCssText, pSSHref) {
	var _allCssText = pCssText.replace(/^\s+/g, '').replace(/\s+$/g, '').split(';');
	var _divID = 'cssRuleContainer' + dCounter;
	var cssRuleContainer = document.createElement('div');
	cssRuleContainer.id = _divID;
	dCounter++;
	var _cssFileName = '';
	if (pSSHref.lastIndexOf('/') != -1) _cssFileName = pSSHref.substring(pSSHref.lastIndexOf('/') + 1, pSSHref.length);
	else _cssFileName = pSSHref;
	//var _lineNumber = this.getLineNumber(pSelectorText);
	var cssHrefConatiner = document.createElement('a');
	cssHrefConatiner.className = 'cssHrefConatiner';
	cssHrefConatiner.href = pSSHref;
	cssHrefConatiner.target = '_blank';
	cssHrefConatiner.innerHTML = _cssFileName + '<br />'; //' (line ' + _lineNumber + ')<br />';
	cssRuleContainer.appendChild(cssHrefConatiner);
	
	var cssSelectorTextContainer = document.createElement('span');
	cssSelectorTextContainer.id = 'cssSelectorTextContainer';
	cssSelectorTextContainer.innerHTML = pSelectorText + ' {<br />';
	cssRuleContainer.appendChild(cssSelectorTextContainer);
	for (var i=0; i<_allCssText.length; i++) {
		if (_allCssText[i] != '') {
			var _strikethrough = '';
			var _isApplied = this.isApplied(_allCssText[i]);
			if (_allCssText[i].indexOf('rgb(') != -1) {
				_allCssText[i] = _allCssText[i].replace('rgb(', '').replace(')', '');
				var _temp = _allCssText[i].split(':')[1].split(',');
				var r = parseInt(_temp[0]).toString(16).toUpperCase();
				var g = parseInt(_temp[1]).toString(16).toUpperCase();
				var b = parseInt(_temp[2]).toString(16).toUpperCase();
				if (r.length == 1) r = 0 + r;
				if (g.length == 1) g = 0 + g;
				if (b.length == 1) b = 0 + b;
				var _new = '#' + r + g + b;
				_allCssText[i] = _allCssText[i].split(':')[0] + ': ' + _new;
			}
			if (!_isApplied) {
				_strikethrough = 'line-through';
				if (_allCssText[i].indexOf('rgb(') != -1) {
					_allCssText[i] = _allCssText[i].replace('rgb(', '').replace(')', '');
					var _temp = _allCssText[i].split(':')[1].split(',');
					var r = parseInt(_temp[0]).toString(16).toUpperCase();
					var g = parseInt(_temp[1]).toString(16).toUpperCase();
					var b = parseInt(_temp[2]).toString(16).toUpperCase();
					if (r.length == 1) r = 0 + r;
					if (g.length == 1) g = 0 + g;
					if (b.length == 1) b = 0 + b;
					var _new = '#' + r + g + b;
					_allCssText[i] = _allCssText[i].split(':')[0] + ': ' + _new;
				}
			} else {
				if (_allCssText[i].indexOf('url(') != -1) {
					if (document.all) {
						if (this._elementToCheck.currentStyle) var _bStyle = ' '  + this._elementToCheck.currentStyle['backgroundImage'];
						else if (window.getComputedStyle) var _bStyle = ' '  + document.defaultView.getComputedStyle(this._elementToCheck, null).getPropertyValue('backgroundImage');
					} else {
						if (this._elementToCheck.currentStyle) var _bStyle = ' ' + this._elementToCheck.currentStyle['background-image'];
						else if (window.getComputedStyle) var _bStyle = ' ' + document.defaultView.getComputedStyle(this._elementToCheck, null).getPropertyValue('background-image');
					}
					var _image = _bStyle.substring(5, _bStyle.length - 1);
					_elementInCheck = this._elementToCheck;
					if (document.all) _image = _image.replace(/"/g, '');
				}
			}
			var _cssTextProperty = _allCssText[i].split(':')[0];
			var _cssTextValue = _allCssText[i].split(':')[1];
			var _mID = pSelectorText.replace(/[#.+]/g, '') + _cssTextProperty.replace(/^\s+/g, '');
			
			var oCssTextSpan = cssRuleContainer.appendChild(document.createElement('span'));
			oCssTextSpan.id = _mID;
			oCssTextSpan._this = this;
			oCssTextSpan.style.paddingLeft = '24px';
			oCssTextSpan.style.color = '#FF9';
			//oCssTextSpan.style.textDecoration = _strikethrough;
			
			var oProperty = document.createElement('input');
			oProperty.type = 'text';
			oProperty.className = 'oProperty';
			var _mPWidth = 6 * _cssTextProperty.length;
			if (_mPWidth > 100) oProperty.style.width = '100px';
			else oProperty.style.width = _mPWidth + 'px';
			oProperty.value = _cssTextProperty.replace(/^\s+/g, '');
			oProperty.style.textDecoration = _strikethrough;
			oProperty._this = this;
			oProperty.onfocus = function() {this.style.border = '1px solid #FFF';}
			oProperty.onblur = this.checkProperty;
			oProperty.onkeyup = this.changeRuleProperty;
			oProperty._parentID = _mID;
			oProperty._parentContainerID = _divID;
			oProperty._currentElement = this._currentElement;
			oProperty._selectorText = pSelectorText;
			oProperty._oldValue = _cssTextProperty.replace(/^\s+/g, '');
			oCssTextSpan.appendChild(oProperty);
			oCssTextSpan.appendChild(document.createTextNode(' : '));
			
			
			
			var oValue = document.createElement('input');
			oValue.type = 'text';
			oValue.className = 'oValue';
			var _mVWidth = 6 *  _cssTextValue.length;
			if (_mVWidth > 200) oValue.style.width = '200px';
			else oValue.style.width = _mVWidth + 'px';
			oValue.value = _cssTextValue.substring(1, _cssTextValue.length);
			oValue._this = this;
			oValue.style.textDecoration = _strikethrough;
			if (_cssTextValue.indexOf('#') != -1) {
				oValue._previewType = 'color';
				oValue.onmouseover = this.createPreviewPopup;
				oValue.onmouseout = function() {destroyPreviewPopup();}
				oValue.style.curosr = 'pointer';
			}
			if (_cssTextValue.indexOf('url(') != -1) {
				oValue._previewType = 'image';
				oValue.onmouseover = this.createPreviewPopup;
				oValue._image = _image;
				oValue.onmouseout = function() {destroyPreviewPopup();}
				oValue.style.curosr = 'pointer';
			}
			oValue.onfocus = function() {this.style.border = '1px solid #FFF';}
			oValue.onblur = function() {this.style.border = 'none';}
			oValue._currentElement = this._currentElement;
			oValue._selectorText = pSelectorText;
			oValue._propertyToChange = _cssTextProperty;
			oValue.onkeyup = this.changeRuleValue;
			oValue._parentID = _mID;
			oValue._parentContainerID = _divID;
			oValue._sibling = oProperty;
			oCssTextSpan.appendChild(oValue);
			
			oProperty._sibling = oValue;
			oProperty._value = oValue.value;
			
			oCssTextSpan.appendChild(document.createElement('br'));
		}
	}
	this._outputWindow.appendMessage(document.createElement('br'));
	this._outputWindow.appendMessage(cssRuleContainer);
	var oEndBracketSpan = document.createElement('span')
	oEndBracketSpan.className = 'oEndBracketSpan';
	oEndBracketSpan.innerHTML = '}<br />';
	this._outputWindow.appendMessage(oEndBracketSpan);
}

var ffCounter = 0;
var _newPropCounter = 0;
styleSheetReader.prototype.changeRuleValue = function(e) {
	var KeyID = document.all?window.event.keyCode:e.keyCode;
	var prop = this._sibling.value.replace(/\s/g, '');
	var hasPX = false;
	if (prop.indexOf('-') != -1) {var pos = prop.indexOf('-'); prop = prop.substring(0, pos) + prop.substring(pos + 1, pos + 2).toUpperCase() + prop.substring(pos + 2, prop.length);}
	switch (KeyID) {
		case 38:
			if (this.value.indexOf('px') != -1) {hasPX = true; var mNum =  parseInt(this.value.substring(0, this.value.indexOf('px'))); var mPX = this.value.substring(this.value.indexOf('px'), this.value.length);}
			if (this.value.indexOf('pt') != -1) {hasPX = true; var mNum =  parseInt(this.value.substring(0, this.value.indexOf('pt'))); var mPX = this.value.substring(this.value.indexOf('pt'), this.value.length);}
			if (this.value.indexOf('em') != -1) {hasPX = true; var mNum =  parseInt(this.value.substring(0, this.value.indexOf('em'))); var mPX = this.value.substring(this.value.indexOf('em'), this.value.length);}
			if (hasPX) {mNum++; this.value = mNum.toString() + mPX; eval('this._currentElement.style.' + prop + ' = \'' + this.value + '\';');}
			if (prop == 'fontFamily') {if (ffCounter < 0) ffCounter = this._this.fontFamilies.length - 1; this.value = this._this.fontFamilies[ffCounter]; eval('this._currentElement.style.' + prop + ' = \'' + this.value + '\';'); ffCounter--;}
			break;
		case 40:
			if (this.value.indexOf('px') != -1) {hasPX = true; var mNum =  parseInt(this.value.substring(0, this.value.indexOf('px'))); var mPX = this.value.substring(this.value.indexOf('px'), this.value.length);}
			if (this.value.indexOf('pt') != -1) {hasPX = true; var mNum =  parseInt(this.value.substring(0, this.value.indexOf('pt'))); var mPX = this.value.substring(this.value.indexOf('pt'), this.value.length);}
			if (this.value.indexOf('em') != -1) {hasPX = true; var mNum =  parseInt(this.value.substring(0, this.value.indexOf('em'))); var mPX = this.value.substring(this.value.indexOf('em'), this.value.length);}
			if (hasPX) {mNum--; this.value = mNum.toString() + mPX; eval('this._currentElement.style.' + prop + ' = \'' + this.value + '\';');}
			if (prop == 'fontFamily') {if (ffCounter >= this._this.fontFamilies.length) ffCounter = 0; this.value = this._this.fontFamilies[ffCounter]; eval('this._currentElement.style.' + prop + ' = \'' + this.value + '\';'); ffCounter++;}
			break;
		case 13:
			if (this._currentElement) {
				if (this.value != '') eval('this._currentElement.style.' + prop + ' = \'' + this.value + '\';');
				this.style.border = 'none';
			}
			if (this.style.border.indexOf('none') != -1) {
				var _mContainer = document.getElementById(this._parentContainerID);
				//alert(_mContainer.lastChild.id + ":" + this._parentID);
				if (_mContainer.lastChild.id == this._parentID) {
					
					var _mID = 'rule' + _newPropCounter;
					var oCssTextSpan = _mContainer.appendChild(document.createElement('span'));
					oCssTextSpan.id = _mID;
					oCssTextSpan._this = this;
					oCssTextSpan.style.paddingLeft = '24px';
					oCssTextSpan.style.color = '#FF9';
					var oProperty = document.createElement('input');
					oProperty.type = 'text';
					oProperty.className = 'oProperty';
					oProperty.style.width = '75px';
					oProperty.value = '';
					oProperty._this = this._this;
					oProperty.style.border = '1px solid #FFF';
					oProperty.onfocus = function() {this.style.border = '1px solid #FFF';}
					oProperty.onblur = this._this.checkProperty;
					oProperty.onkeyup = this._this.changeRuleProperty;
					oProperty._parentID = _mID;
					oProperty._parentContainerID = _mContainer.id;
					oProperty._currentElement = this._currentElement;
					oProperty._selectorText = this._selectorText;
					oProperty._oldValue = '';
					oCssTextSpan.appendChild(oProperty);
					oCssTextSpan.appendChild(document.createTextNode(' : '));
					oProperty.focus();
					oProperty._value = 'undefined';
					
					var oValue = document.createElement('input');
					oValue.type = 'text';
					oValue.className = 'oValue';
					oValue.style.width = '75px';
					oValue.value = 'undefined';
					oValue._this = this._this;
					oValue.onfocus = function() {this.style.border = '1px solid #FFF';}
					oValue.onblur = function() {this.style.border = 'none';}
					oValue._currentElement = this._currentElement;
					oValue._selectorText = this._selectorText;
					oValue._propertyToChange = '';
					oValue.onkeyup = this._this.changeRuleValue;
					oValue._parentID = _mID;
					oValue._parentContainerID = _mContainer.id;
					oValue._sibling = oProperty;
					oCssTextSpan.appendChild(oValue);
					oProperty._sibling = oValue;
					
					oCssTextSpan.appendChild(document.createElement('br'));
					_newPropCounter++;
				}
			}
			break;
	}
	if (this._this._ruleSet) {
		for (var h=0; h<this._this._ruleSet.length; h++) {
			if (this._this._ruleSet[h] == undefined) continue;
			if (this._this._ruleSet[h]._href.indexOf('css_reader.css') != -1) continue;
			if (this._this._ruleSet[h]._rule) {
				for (var i=0; i<this._this._ruleSet[h]._rule.length; i++) {
					if (!this._this._ruleSet[h]._rule[i].selectorText) continue;
					if (this._this._ruleSet[h]._rule[i].selectorText.toLowerCase() == 'unknown') continue;
					var _selectorText = this._this._ruleSet[h]._rule[i].selectorText;
					if (_selectorText == this._selectorText) {
						eval('this._this._ruleSet[h]._rule[i].style.' + prop + ' = \'' + this.value + '\';');
					}
				}
			}
		}
	}
}

styleSheetReader.prototype.checkProperty = function() {
	this.style.border = 'none';
	if (this.value == '') {
		if (this._this._ruleSet) {
			for (var h=0; h<this._this._ruleSet.length; h++) {
				if (this._this._ruleSet[h] == undefined) continue;
				if (this._this._ruleSet[h]._href.indexOf('css_reader.css') != -1) continue;
				
				if (this._this._ruleSet[h]._rule) {
		
					for (var j=0; j<this._this._ruleSet[h]._rule.length; j++) {
						if (!this._this._ruleSet[h]._rule[j].selectorText) continue;
						if (this._this._ruleSet[h]._rule[j].selectorText.toLowerCase() == 'unknown') continue;
						var _selectorText = this._this._ruleSet[h]._rule[j].selectorText;
						if (_selectorText == this._selectorText) {
							
							var _newStr = '';
							var _rule = this._this._ruleSet[h]._rule[j].style.cssText.split(';');
							for (var k=0; k<_rule.length; k++) {
								if (_rule[k].split(':')[0].replace(/\s/g, '').toLowerCase() != this._oldValue) {
									if (_rule[k].split(':')[0] != '') {
										_newStr += _rule[k].split(':')[0] + ':' + _rule[k].split(':')[1] + ';';
									}
								}
							}
							this._this._ruleSet[h]._rule[j].style.cssText = _newStr;
							document.getElementById(this._parentContainerID).removeChild(document.getElementById(this._parentID));
						}
					}
				}
			}
		}
	}
}

styleSheetReader.prototype.changeRuleProperty = function(e) {
	var KeyID = document.all?window.event.keyCode:e.keyCode;
	switch (KeyID) {
		case 38:
			break;
		case 40:
			break;
		case 13:
			break;
	}
}

styleSheetReader.prototype.isApplied = function(pCssText) {
	var _styleToCheck = _valueToCheck = '';
	_styleToCheck = pCssText.replace(/^\s+/g, '').replace(/\s+$/g, '').split(':')[0];
	_valueToCheck = pCssText.replace(/^\s+/g, '').replace(/\s+$/g, '').split(':')[1];
	if (document.all) {
		if (_styleToCheck.indexOf('-') != -1) {
			var pos = _styleToCheck.indexOf('-');
			_styleToCheck = _styleToCheck.replace('-', '');
			_styleToCheck = _styleToCheck.substring(0, pos).toLowerCase() + _styleToCheck.substring(pos, pos + 1).toUpperCase() + _styleToCheck.substring(pos + 1, _styleToCheck.length).toLowerCase();
		}
	}
	if (_styleToCheck == 'padding' || _styleToCheck == 'margin') {
		var _temp = _valueToCheck.split(' ');
		var _tempC = '';
		for (var i=0; i<4; i++) {
			var _tempSstyleToCheck = '';
			switch (i) {
				case 0: {if (document.all) _tempSstyleToCheck = _styleToCheck + 'Top'; else _tempSstyleToCheck = _styleToCheck + '-top'; break;}
				case 1: {if (document.all) _tempSstyleToCheck = _styleToCheck + 'Right'; else _tempSstyleToCheck = _styleToCheck + '-right'; break;}
				case 2: {if (document.all) _tempSstyleToCheck = _styleToCheck + 'Bottom'; else _tempSstyleToCheck = _styleToCheck + '-bottom'; break;}
				case 3: {if (document.all) _tempSstyleToCheck = _styleToCheck + 'Left'; else _tempSstyleToCheck = _styleToCheck + '-left'; break;}
			}
			if (document.all) {
				if (this._elementToCheck.currentStyle) var _bStyle = ' '  + this._elementToCheck.currentStyle[_tempSstyleToCheck];
				else if (window.getComputedStyle) var _bStyle = ' '  + document.defaultView.getComputedStyle(this._elementToCheck, null).getPropertyValue(_tempSstyleToCheck);
			} else {
				if (this._elementToCheck.currentStyle) var _bStyle = ' ' + this._elementToCheck.currentStyle[_tempSstyleToCheck];
				else if (window.getComputedStyle) var _bStyle = ' ' + document.defaultView.getComputedStyle(this._elementToCheck, null).getPropertyValue(_tempSstyleToCheck);
			}
			_tempC += _bStyle + ' ';
		}
		if (_tempC.replace(/\s/g, '').indexOf(_valueToCheck.replace(/\s/g, '')) != -1) {return true;}
		
	}
	if (_styleToCheck == 'background') {
		var _temp = _valueToCheck.split(' ');
		var _tempC = '';
		for (var i=0; i<6; i++) {
			var _tempSstyleToCheck = '';
			switch (i) {
				case 0: {if (document.all) _tempSstyleToCheck = _styleToCheck + 'Color'; else _tempSstyleToCheck = _styleToCheck + '-color'; break;}
				case 1: {if (document.all) _tempSstyleToCheck = _styleToCheck + 'Image'; else _tempSstyleToCheck = _styleToCheck + '-image'; break;}
				case 2: {if (document.all) _tempSstyleToCheck = _styleToCheck + 'Attachment'; else _tempSstyleToCheck = _styleToCheck + '-attachment'; break;}
				case 3: {if (document.all) _tempSstyleToCheck = _styleToCheck + 'PositionX'; else _tempSstyleToCheck = _styleToCheck + '-position-x'; break;}
				case 4: {if (document.all) _tempSstyleToCheck = _styleToCheck + 'PositionY'; else _tempSstyleToCheck = _styleToCheck + '-position-y'; break;}
				case 5: {if (document.all) _tempSstyleToCheck = _styleToCheck + 'Repeat'; else _tempSstyleToCheck = _styleToCheck + '-repeat'; break;}
			}
			if (document.all) {
				if (this._elementToCheck.currentStyle) var _bStyle = ' '  + this._elementToCheck.currentStyle[_tempSstyleToCheck];
				else if (window.getComputedStyle) var _bStyle = ' '  + document.defaultView.getComputedStyle(this._elementToCheck, null).getPropertyValue(_tempSstyleToCheck);
			} else {
				if (this._elementToCheck.currentStyle) var _bStyle = ' ' + this._elementToCheck.currentStyle[_tempSstyleToCheck];
				else if (window.getComputedStyle) var _bStyle = ' ' + document.defaultView.getComputedStyle(this._elementToCheck, null).getPropertyValue(_tempSstyleToCheck);
			}
			_tempC += _bStyle + ' ';
		}
		var _allBackgrounds = _valueToCheck.split(' ');
		for (var i=1; i<_allBackgrounds.length; i++) {
			if (_allBackgrounds[i].indexOf('url') != -1) {
				var _theURL = _allBackgrounds[i].substring(4, _allBackgrounds[i].length - 1);
				if (_tempC.indexOf(_theURL)) return true;
			}
		}
		if (_tempC.replace(/\s/g, '').indexOf(_valueToCheck.replace(/\s/g, '')) != -1) {return true;}
	}
	if (document.all) {
		if (this._elementToCheck.currentStyle) var _bStyle = ' '  + this._elementToCheck.currentStyle[_styleToCheck];
		else if (window.getComputedStyle) var _bStyle = ' '  + document.defaultView.getComputedStyle(this._elementToCheck, null).getPropertyValue(_styleToCheck);
	} else {
		if (this._elementToCheck.currentStyle) var _bStyle = ' ' + this._elementToCheck.currentStyle[_styleToCheck];
		else if (window.getComputedStyle) var _bStyle = ' ' + document.defaultView.getComputedStyle(this._elementToCheck, null).getPropertyValue(_styleToCheck);
	}
	if (_bStyle == _valueToCheck) return true;
	else return false;
}

styleSheetReader.prototype.destroyHighlight = function() {if (document.getElementById('highlightDiv')) {var m = document.getElementById('highlightDiv'); var p = m.parentNode; p.removeChild(m);}}
styleSheetReader.prototype.highlightElement = function(pElement) {
	var oDiv = document.body.appendChild(document.createElement('div'));
	oDiv.id = 'highlightDiv';
	oDiv.style.opacity = 50 / 100;
	oDiv.style.filter = 'alpha(opacity=' + 50 + ')';
	oDiv.style.zIndex = getHighestZIndex() - 1;
	oDiv.style.width = pElement.offsetWidth + 'px';
	oDiv.style.height = pElement.offsetHeight + 'px';
	this.positionObjectToElement(pElement, oDiv, 0, 0);
}

styleSheetReader.prototype.findPos = function(pObject) {
	var _currentLeft = _currentTop = 0;
	if (pObject.offsetParent) {
		_currentLeft = pObject.offsetLeft;
		_currentTop = pObject.offsetTop;
		while (pObject = pObject.offsetParent) {
			_currentLeft += pObject.offsetLeft;
			_currentTop += pObject.offsetTop;
		}
	}
	return [_currentLeft, _currentTop];
}

styleSheetReader.prototype.positionObjectToElement = function(pObject, pThis, pOffsetX, pOffsetY) {var _coordinates = this.findPos(pObject); pThis.style.left = _coordinates[0] + pOffsetX + 'px'; pThis.style.top = _coordinates[1] + pOffsetY + 'px';}
styleSheetReader.prototype.matchStyles = function(pElement) {
	if (pElement == null || pElement == 'undefined') return;
	this._outputWindow.switchOutput('editor');
	this._outputWindow.clearOutputWindow();
	dCounter = 0;
	this._currentElement = pElement;
	this._elementToCheck = pElement;
	var _tempID = '';
	if (pElement.id) {_tempID = '#' + pElement.id;}
	for (var i=0; i<pElement.attributes.length; i++) if (pElement.attributes.item(i).nodeName == 'class') if (pElement.attributes.item(i).nodeValue != '') if (_tempID == '') _tempID = '.' + pElement.attributes.item(i).nodeValue;
	this._outputWindow.changeTitle('<span style="color: #009; font-weight: bold;">Styles for: ' + pElement.nodeName + _tempID + '</span>');
	var oSpan = document.createElement('span');
	oSpan.className = 'retrievedStyleForPhrase';
	oSpan.innerHTML = 'Retrieved Styles For: ';
	this._outputWindow.appendMessage(oSpan);
	var oA = document.createElement('a');
	oA.className = 'retrievedStyleForPhrase';
	oA.href = 'javascript: void(0);';
	oA.pElement = pElement;
	oA._this = this;
	oA.onmouseover = function() {this._this.highlightElement(this.pElement);}
	oA.onmouseout = function() {this._this.destroyHighlight();}
	oA.innerHTML = this._currentElement.nodeName.toLowerCase() + _tempID;
	this._outputWindow.appendMessage(oA);
	this._outputWindow.appendMessage(document.createElement('br'));
	while (this._currentElement) {
		if (pElement.nodeType == 1) {
			if (this._currentElement.nodeName == 'BODY') return;
			if (this._currentElement != pElement) {
				var _cID = false;
				if (this._currentElement.id) {
					var oIDClassSpan = document.createElement('span');
					oIDClassSpan.className = 'oIDClassSpan';
					oIDClassSpan.innerHTML = '#' + this._currentElement.id;
					_cID = true;
				}
				for (var i=0; i<this._currentElement.attributes.length; i++) if (this._currentElement.attributes.item(i).nodeName == 'class') if (this._currentElement.attributes.item(i).nodeValue != '') if (!_cID) if (oIDClassSpan) oIDClassSpan.innerHTML = '.' + this._currentElement.attributes.item(i).nodeValue;
				this._outputWindow.appendMessage(document.createElement('br'));
				var oInheritedFromSpan = document.createElement('span');
				oInheritedFromSpan.className = 'oInheritedFromSpan';
				oInheritedFromSpan.innerHTML = 'Inherited from ';
				var oInheritedFromA = oInheritedFromSpan.appendChild(document.createElement('a'));
				oInheritedFromA.className = 'oInheritedFromA';
				oInheritedFromA.href = 'javascript: void(0);';
				oInheritedFromA._this = this;
				oInheritedFromA._currentElement = this._currentElement;
				oInheritedFromA.onclick = function() {this._this.destroyHighlight(); this._this.matchStyles(this._currentElement)}
				oInheritedFromA.onmouseover = function() {this._this.highlightElement(this._currentElement);}
				oInheritedFromA.onmouseout = function() {this._this.destroyHighlight();}
				oInheritedFromA.innerHTML = this._currentElement.nodeName.toLowerCase();
				if (_cID) oInheritedFromA.appendChild(oIDClassSpan);
				this._outputWindow.appendMessage(oInheritedFromSpan);
			}
			this.getStyles(this._currentElement);
		}
		this._currentElement = this._currentElement.parentNode;
	}
}

// OUTPUT WINDOW //
function SSROutputWindow() {
	var outputWindowMainContainer = document.body.appendChild(document.createElement("div"));
	outputWindowMainContainer.id = "outputWindowContainer";
	outputWindowMainContainer.style.display = "none";
	this._outputWindow = outputWindowMainContainer;
	
	var outputWindowTitlebarContainer = outputWindowMainContainer.appendChild(document.createElement("div"));
	outputWindowTitlebarContainer.id = "outputWindowTitlebarContainer";
	outputWindowTitlebarContainer.onmousedown = SSROutputWindow.prototype.tdOnMouseDown;
	this._outputWindowTitlebar = outputWindowTitlebarContainer;
	outputWindowTitlebarContainer._outputWindow = this;
	
	var oDebuggerTitlebarTitleSpan = outputWindowTitlebarContainer.appendChild(document.createElement("span"));
	oDebuggerTitlebarTitleSpan.id = "oDebuggerTitlebarTitleSpan";
	oDebuggerTitlebarTitleSpan.innerHTML = "DoM Inspector v 1.0";
	this.outputWindowTitle = oDebuggerTitlebarTitleSpan;
	
	var btnClose = outputWindowTitlebarContainer.appendChild(document.createElement("span"));
	btnClose.id = 'btnClose';
	btnClose.className = 'btnCloseNormal';
	btnClose.innerHTML = "close";
	btnClose.onmouseover = function() {this.className = 'btnCloseHighlight';}
	btnClose.onmouseout = function() {this.className = 'btnCloseNormal';}
	btnClose._mainWindow = this._outputWindow;
	btnClose.onclick = function() {this._mainWindow.style.display = "none";}

	var outputWindowMenuDiv = outputWindowMainContainer.appendChild(document.createElement("div"));
	outputWindowMenuDiv.id = 'outputWindowMenuDiv';
	this._outputWindowMenuDiv = outputWindowMenuDiv;

	var btnShowEditor = outputWindowMenuDiv.appendChild(document.createElement("span"));
	btnShowEditor.id = 'btnShowEditor';
	btnShowEditor.className = 'btnShowEditorNormal';
	btnShowEditor.innerHTML = 'show editor';
	btnShowEditor._this = this;
	btnShowEditor.onmouseover = function() {this.className = 'btnShowEditorHighlight';}
	btnShowEditor.onmouseout = function() {this.className = 'btnShowEditorNormal';}
	btnShowEditor.onclick = function() {this._this.switchOutput('editor');}
	this._btnShowEditor = btnShowEditor;
	
	var btnShowStyleSheets = outputWindowMenuDiv.appendChild(document.createElement("span"));
	btnShowStyleSheets.id = 'btnShowStyleSheets';
	btnShowStyleSheets.className = 'btnShowStyleSheetsNormal'
	btnShowStyleSheets.innerHTML = 'show style sheets';
	btnShowStyleSheets._this = this;
	btnShowStyleSheets.onmouseover = function() {this.className = 'btnShowStyleSheetsHighlight';}
	btnShowStyleSheets.onmouseout = function() {this.className = 'btnShowStyleSheetsNormal';}
	btnShowStyleSheets.onclick = function() {_mStyleReader.showCssFiles(); this._this.switchOutput('ssoutput');}
	this._btnShowStyleSheets = btnShowStyleSheets;
	
	var outputWindowEditorContainer = outputWindowMainContainer.appendChild(document.createElement("div"));
	outputWindowEditorContainer.id = "outputWindowEditorContainer";
	outputWindowEditorContainer.style.display = 'block';
	outputWindowEditorContainer.onscroll = function() {_scrollTop = this.scrollTop;}
	this._outputWindowEditor = outputWindowEditorContainer;

	var outputWindowSSOutputContainer = outputWindowMainContainer.appendChild(document.createElement("div"));
	outputWindowSSOutputContainer.id = "outputWindowSSOutputContainer";
	outputWindowSSOutputContainer.style.display = 'none';
	outputWindowSSOutputContainer.onscroll = function() {_scrollTop = this.scrollTop;}
	this._outputWindowSSOutput = outputWindowSSOutputContainer;
}

SSROutputWindow.prototype.changeTitle = function(pPhrase) {this.outputWindowTitle.innerHTML = 'DoM Inspector v 1.0 - ' + pPhrase;}
SSROutputWindow.prototype.writeToDebugWindow = function(pString) {this._outputWindowEditor.innerHTML += pString + "<br />"; this._outputWindowEditor.scrollTop = this._outputWindowEditor.scrollHeight;}
SSROutputWindow.prototype.appendMessage = function(pContainer) {if (!pContainer) return; this._outputWindowEditor.appendChild(pContainer);}
SSROutputWindow.prototype.ssOutputAppendMessage = function(pContainer) {if (!pContainer) return; this._outputWindowSSOutput.appendChild(pContainer);}
SSROutputWindow.prototype.clearOutputWindow = function() {this._outputWindowEditor.innerHTML = '';}
SSROutputWindow.prototype.clearSSOutputWindow = function() {this._outputWindowSSOutput.innerHTML = '';}
SSROutputWindow.prototype.showDebugWindow = function() {this.centerOutput(this._outputWindow); this._outputWindow.style.display = "block";}
SSROutputWindow.prototype.switchOutput = function(pWhich) {
	this._outputWindowEditor.style.display = 'none';
	this._outputWindowSSOutput.style.display = 'none';
	switch (pWhich) {
		case 'editor': {this._outputWindowEditor.style.display = 'block'; break;}
		case 'ssoutput': {this._outputWindowSSOutput.style.display = 'block'; break;}
	}
}

SSROutputWindow.prototype.tdOnMouseDown = function() {this._outputWindow.onMouseDown();}
SSROutputWindow.prototype.onMouseDown = function() {this.bDown = true; document.body._outputWindow = this; this.saveMouseMove = document.body.onmousemove; this.saveMouseUp = document.body.onmouseup; document.body.onmousemove = SSROutputWindow.prototype.bodyOnMouseMove; document.body.onmouseup = SSROutputWindow.prototype.bodyOnMouseUp;}
SSROutputWindow.prototype.bodyOnMouseMove = function(evt) {var e = window.event ? window.event : evt; this._outputWindow.onMouseMove(e);}
SSROutputWindow.prototype.onMouseMove = function(evt) {if ((document.all) && !(evt.button & 1)) {this.onMouseUp(); return;} if (this.bDown) {this.dx = parseInt(this._outputWindow.style.left, 10) - evt.clientX; this.dy = parseInt(this._outputWindow.style.top, 10) - evt.clientY; this.bDown = false;} else {this._outputWindow.style.left = Math.max((this.dx + evt.clientX),0) + "px"; this._outputWindow.style.top = Math.max((this.dy + evt.clientY),0) + "px";}}
SSROutputWindow.prototype.bodyOnMouseUp = function() {this._outputWindow.onMouseUp();}
SSROutputWindow.prototype.onMouseUp = function() {document.body.onmouseup = this.saveMouseUp; document.body.onmousemove = this.saveMouseMove; document.body._outputWindow = null;}
SSROutputWindow.prototype.centerOutput = function(element) {
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

var _mStyleReader = new styleSheetReader();
