//window.jQuery = window._jQuery = window.$ = window._$ = null;
window.jQuery = window._jQuery = null;

//var jsFBDomain = 'http://10.70.127.78/CDEObjects/js_firebug/';
var jsFBDomain = 'http://common.scrippsnetworks.com/common/js/jsfirebug/';
var jsFBCss = jsFBDomain + 'js_firebug.css';

var jquery_inc = document.createElement('script');
jquery_inc.type = 'text/javascript';
jquery_inc.id = 'jsFirebugScript';
jquery_inc.src = jsFBDomain + 'jquery-1.2.4a.js';
jquery_inc.language = 'javascript';

var cssJSFB = document.createElement("link");
cssJSFB.id = "cssReaderCss";
cssJSFB.rel = "stylesheet";
cssJSFB.href = jsFBCss;
cssJSFB.type = "text/css";

if (document.getElementsByTagName('head')[0]) {
	document.getElementsByTagName('head')[0].appendChild(jquery_inc);
	document.getElementsByTagName('head')[0].appendChild(cssJSFB);
} else {
	document.body.appendChild(jquery_inc);
	document.body.appendChild(cssJSFB);
}

jquery_inc.onload = jquery_ready;
jquery_inc.onreadystatechange = function() {
	if ( jquery_inc.readyState == 'loaded' || jquery_inc.readyState == 'complete' ) {
		jquery_ready();
	}
};

function jquery_ready() {
	jQuery.noConflict();
	jQuery.jsFirebug = function() {
		this.init();
		this.showCssFiles();
		this.getHTML();
		this.getInfo();
		//this.getScript();
	};
	
	jQuery.extend(jQuery.jsFirebug, {
		prototype: {
			init: function() {
				this.fontFamilies = [
					'Arial, Helvetica, sans-serif',
					'"Arial Sans MS New Roman MS Grande", Helvetica, sans-serif',
					'caption, Helvetica, sans-serif',
					'"Comic Sans MS New Roman MS Grande", Helvetica, sans-serif',
					'"Courier New", Courier, monospace',
					'cursive, Helvetica, sans-serif',
					'fantasy, Helvetica, sans-serif',
					'Geneva, Arial, Helvetica, sans-serif',
					'Georgia, "Times New Roman", Times, serif',
					'"Georgia New Roman MS Grande", Helvetica, sans-serif',
					'Helvetica, Helvetica, sans-serif',
					'icon, Helvetica, sans-serif',
					'inherit, Helvetica, sans-serif',
					'"inherit Sans MS New Roman MS Grande", Helvetica, sans-serif',
					'"Lucida Grande", Helvetica, sans-serif',
					'menu, Helvetica, sans-serif',
					'message-box, Helvetica, sans-serif',
					'monospace, Helvetica, sans-serif',
					'sans-serif, Helvetica, sans-serif',
					'serif, Helvetica, sans-serif',
					'status-bar, Helvetica, sans-serif',
					'small-caption, Helvetica, sans-serif',
					'"Tahoma New Roman MS Grande", Helvetica, sans-serif',
					'"Times New Roman", Times, serif',
					'"Times New Roman MS Grande", Helvetica, sans-serif',
					'"Trebuchet MS", Helvetica, sans-serif',
					'"Trebuchet MS Grande", Helvetica, sans-serif',
					'Verdana, Arial, Helvetica, sans-serif',
					'"Verdana New Roman MS Grande", Helvetica, sans-serif'
				];
				this.propAF = [
					'azimuth',
					'background',
					'background-attachment',
					'background-color',
					'background-image',
					'background-position',
					'background-repeat',
					'border',
					'border-bottom',
					'border-bottom-color',
					'border-bottom-style',
					'border-bottom-width',
					'border-collapse',
					'border-color',
					'border-left',
					'border-left-color',
					'border-left-style',
					'border-left-width',
					'border-right',
					'border-right-color',
					'border-right-style',
					'border-right-width',
					'border-spacing',
					'border-style',
					'border-top',
					'border-top-color',
					'border-top-style',
					'border-top-width',
					'border-width',
					'bottom',
					'caption-side',
					'clear',
					'clip',
					'color',
					'content',
					'counter-increment',
					'counter-reset',
					'cue',
					'cue-after',
					'cue-before',
					'cursor',
					'direction',
					'display',
					'elevation',
					'empty-cells',
					'float',
					'font',
					'font-family',
					'font-size',
					'font-size-adjust',
					'font-stretch',
					'font-style',
					'font-variant',
					'font-weight',
					'height',
					'left',
					'letter-spacing',
					'line-height',
					'list-style',
					'list-style-image',
					'list-style-position',
					'list-style-type',
					'margin',
					'margin-bottom',
					'margin-left',
					'margin-right',
					'margin-top',
					'marker-offset',
					'marks',
					'max-height',
					'max-width',
					'min-height',
					'min-width',
					'orphans',
					'outline',
					'outline-color',
					'outline-style',
					'outline-width',
					'overflow',
					'padding',
					'padding-bottom',
					'padding-left',
					'padding-right',
					'padding-top',
					'page',
					'page-break-after',
					'page-break-before',
					'page-break-inside',
					'pause',
					'pause-after',
					'pause-before',
					'pitch',
					'pitch-range',
					'play-during',
					'position',
					'quotes',
					'richness',
					'right',
					'size',
					'speak',
					'speak-header',
					'speak-numeral',
					'speak-punctuation',
					'speech-rate',
					'stress',
					'table-layout',
					'text-align',
					'text-decoration',
					'text-indent',
					'text-shadow',
					'text-transform',
					'top',
					'unicode-bidi',
					'vertical-align',
					'visibility',
					'voice-family',
					'volume',
					'white-space',
					'widows',
					'width',
					'word-spacing',
					'z-index'
				];
				this.dInc = 0;
				this.bps = new Array(14400, 28800, 33600, 56000, 128000, 394000, 640000, 10000000);
				this.loss = new Array(1, 1.15, 1.2, 1.25);
				this._styleSheets = document.styleSheets;
				this._ruleSet = new Array();
				this.newPropInc = 0;
				this.ffInc = 0;
				this.scriptData = '';
				
				this.jsFW = jQuery.data(document.body, 'jsFirebugWindow');
				if ( !this.jsFW ) {
					this.jsFW = new jQuery.jsFirebugWindow();
					jQuery.data(document.body, 'jsFirebugWindow', this.jsFW); 
				};
				this.highlightWrap = document.body.appendChild(document.createElement('div'));
				jQuery(this.highlightWrap).css({
						position: 'absolute',
						opacity: 50 / 100,
						filter: 'alpha(opacity=' + 50 + ')',
						width: '0px',
						height: '0px',
						display: 'block',
						zIndex: 100,
						left: 0,
						top: 0,
						margin: '0px',
						padding: '0px',
						fontSize: '0px',
						backgroundColor: '#99F'
					});
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
				this.strNoStyles = document.createElement('span');
				jQuery(this.strNoStyles).attr('id', 'noStylePhrase');
				jQuery(this.strNoStyles).text('No Styles');
				this.jsFW.append('Style', jQuery(this.strNoStyles));

				jQuery(document.body).bind('mousedown', function(event) {
					jQuery.jsFirebug.inspectElement(event);
				});
			},
			inspectElement: function(event) {
				if ( event == null ) {
					event = window.event;
				}
				var target = event.target != null ? event.target : event.srcElement;
				var btn = document.all ? 1 : 0;
				if ( event.button == btn ) {
					
					var obj = target;
					if ( obj.nodeType != 1 ) {
						return;
					}
					while ( obj ) {
						if ( obj.id == 'outputWindowContainer') {
							return;
						}
						obj = obj.parentNode;
					}
					jQuery.jsFirebug.findStyles(target);
				}
			},
			findStyles: function(obj) {
				if (obj == null || obj == 'undefined') return;
				this.jsFW.show('Style');
				this.jsFW.clear('Style');
				this.dInc = 0;
				this.currentObj = obj;
				this.objToCheck = obj;
				var tmp = '';
				if (obj.id) {tmp = '#' + obj.id;}
				for (var i=0; i<obj.attributes.length; i++) {
					if (obj.attributes.item(i).nodeName == 'class') {
						if (obj.attributes.item(i).nodeValue != '') {
							if (tmp == '') {
								tmp = '.' + obj.attributes.item(i).nodeValue;
							}
						}
					}
				}
				this.jsFW.changeTitle('<span class="stylesForSpan">Styles for: ' + obj.nodeName + tmp + '</span>');
				
				/* create span w/ class[retrievedStyleForPhrase] w/ text[Retrieved Styles For:] for the output window */
				var oSpan = document.createElement('span');
				jQuery(oSpan).addClass('retrievedStyleForPhrase')
					.text('Retrieved Styles For: ');
				this.jsFW.append('Style', jQuery(oSpan) );
				
				var oA = document.createElement('a');
				oA.obj = obj;
				jQuery(oA).addClass('retrievedStyleForPhrase')
					.attr('href', 'javascript: void(0);')
					.bind('mouseover', function() {
						jQuery.jsFirebug.highlight('add', this.obj);
					}).bind('mouseout', function() {
						jQuery.jsFirebug.highlight('remove');
					})
					.html(this.currentObj.nodeName.toLowerCase() + tmp + '<br />');
				this.jsFW.append('Style', oA);
				this.jsFW.append('Style', document.createElement('br'));
				
				while (this.currentObj) {
					if (obj.nodeType == 1) {
						if (this.currentObj.nodeName.toLowerCase() == 'body') {
							return;
						}
						if (this.currentObj != obj) {
							var _cID = false;
							if (this.currentObj.id) {
								var oIDClassSpan = document.createElement('span');
								oIDClassSpan.className = 'oIDClassSpan';
								oIDClassSpan.innerHTML = '#' + this.currentObj.id;
								_cID = true;
							}
							for (var i=0; i<this.currentObj.attributes.length; i++) {
								if (this.currentObj.attributes.item(i).nodeName == 'class') {
									if (this.currentObj.attributes.item(i).nodeValue != '') {
										if (!_cID) {
											if (oIDClassSpan) {
												oIDClassSpan.innerHTML = '.' + this.currentObj.attributes.item(i).nodeValue;
											}
										}
									}
								}
							}
							this.jsFW.append('Style', document.createElement('br') );
							var oInheritedFromSpan = document.createElement('span');
							jQuery(oInheritedFromSpan).addClass('oInheritedFromSpan')
								.text('Inherited from ');
							var oInheritedFromA = oInheritedFromSpan.appendChild(document.createElement('a'));
							oInheritedFromA.currentObj = this.currentObj;
							jQuery(oInheritedFromA).addClass('')
								.attr('href', '')
								.bind('click', function() {
									jQuery.jsFirebug.highlight('remove');
									jQuery.jsFirebug.matchStyles(this.currentObj)
								}).bind('mouseover', function() {
									jQuery.jsFirebug.highlight('add', this.currentObj);
								}).bind('mouseout', function() {
									jQuery.jsFirebug.highlight('remove');
								}).text(this.currentObj.nodeName.toLowerCase());
							if (_cID) oInheritedFromA.appendChild(oIDClassSpan);
							this.jsFW.append('Style', oInheritedFromSpan);
						}
						this.getStyles(this.currentObj);
					}
					this.currentObj = this.currentObj.parentNode;
				}
			},
			getStyles: function(obj) {
				var _mStyles = new Array();
				if (this._ruleSet) {
					for (var h=0; h<this._ruleSet.length; h++) {
						if (this._ruleSet[h] == undefined) continue;
						if (this._ruleSet[h]._href.indexOf(jsFBCss) != -1) continue;
						if (this._ruleSet[h]._rule) {
							for (var i=0; i<this._ruleSet[h]._rule.length; i++) {
								if (!this._ruleSet[h]._rule[i].selectorText) continue;
								if (this._ruleSet[h]._rule[i].selectorText.toLowerCase() == 'unknown') continue;
								this._selectorText = this._ruleSet[h]._rule[i].selectorText;
								var _splitSelectorText = this._selectorText.split(',');
								for (var j=0; j<_splitSelectorText.length; j++) {
									var currentObj = obj;
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
										if (!currentObj) break;
										if (currentObj.nodeType != 1) break;
										if (currentObj.nodeName == 'BODY') break;
										var _isID = _isClassName = _isNodeName = _isAdjacent = _isDirectChild = _matchFound = false;
										// get the needed branch of the selectorText a, p, div, #id etc...
										_neededBranch = _eachBranch[_matchCounter];
										if (_eachBranch[_matchCounter].indexOf(':') != -1) _neededBranch = _eachBranch[_matchCounter].split(':')[0];
										// check for ID
										if (_neededBranch.indexOf('#') != -1) {
											_isID = true;
											if (currentObj.id) {
												if (_neededBranch.substring(_neededBranch.indexOf('#') + 1, _neededBranch.length) == currentObj.id) {
													if (_directChildSymbolFound) {
														if (_elementBeforeDC.parentNode == currentObj) {_matchFound = true; _matchCounter++;}
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
											for (x=0; x<currentObj.attributes.length; x++) {
												if (currentObj.attributes.item(x).nodeName == 'class') {
													if (currentObj.attributes.item(x).nodeValue.indexOf(_neededBranch.substring(1, _neededBranch.length)) != -1) {
														if (_directChildSymbolFound) {
															if (_elementBeforeDC.parentNode == currentObj) {_matchFound = true; _matchCounter++;}
														} else {
															_matchFound = true;
															_matchCounter++;
														}
													}
												}
											}
										}
										if (_neededBranch == '+') {currentObj = _lastElement.previousSibling.previousSibling; _matchCounter++; continue;}
										if (_neededBranch == '>') {_directChildSymbolFound = true; _elementBeforeDC = _lastElement; currentObj = _lastElement; _matchCounter++; continue;}
										if (!_isID && !_isClassName && !_isAdjacent && !_isDirectChild) {_isNodeName = true; _mNodeName = _neededBranch.toLowerCase();}
										if (_isNodeName) if (_mNodeName == currentObj.nodeName.toLowerCase()) {_matchFound = true; _matchCounter++;}
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
													var _tempSelectorText = _splitSelectorText[j].split(' ');
													var _newSelectorText = '';
													for (var x=0; x<_tempSelectorText.length; x++) {
														var _idY = false;
														var _clY = false;
														if (_tempSelectorText[x].indexOf('#') != -1) {
															if ( _tempSelectorText[x].split('#').length > 1) {_idY = true; _newSelectorText +=  _tempSelectorText[x].split('#')[0].toLowerCase() + '#' +  _tempSelectorText[x].split('#')[1];}
														}
														if (_tempSelectorText[x].indexOf('.') != -1) {
															if ( _tempSelectorText[x].split('.').length > 1) {_clY = true; _newSelectorText +=  _tempSelectorText[x].split('.')[0].toLowerCase() + '.' +  _tempSelectorText[x].split('.')[1];}
														}
														if (_tempSelectorText[x] == '>' || _tempSelectorText[x] == '+') continue;
														if (!_idY && !_clY) _newSelectorText = _tempSelectorText[x].toLowerCase();
													}
													_mStyles.push(jQuery.jsFirebug.createRule(_newSelectorText, _cssText, this._ruleSet[h]._href));
												} else {
													_mStyles.push(jQuery.jsFirebug.createRule(_splitSelectorText[j], this._ruleSet[h]._rule[i].style.cssText, this._ruleSet[h]._href));
												}
											}
										} else {
											// if no match was found and we're on the first branch,
											// let's break out of the loop
											if (_matchCounter == 0) {break;}
										}
										_lastElement = currentObj;
										currentObj = currentObj.parentNode;
									}
									
								}
							}
						}
					}
				}
				for (var i=0; i<obj.attributes.length; i++) {
					if (obj.attributes.item(i).nodeName == 'style') {
						if (obj.attributes.item(i).nodeValue) {
							_mStyles.push(obj.attributes.item(i).nodeValue);
						}
					}
				}
				return _mStyles;
			},
			getHTML: function() {
				this.jsFW.clear('HTML');
				this.jsFWHtmlWrap = document.createElement('div');
				jQuery(this.jsFWHtmlWrap)
					.addClass('jsFWHtmlWrap')
					.attr('id', 'jsFWHtmlWrap')
					.html('<span class="jsFWHtmlTag">&lt;body&gt;</span>');
				this.jsFW.append('HTML', this.jsFWHtmlWrap);
				this.loopDOM(document.body, this.jsFWHtmlWrap);
				jQuery('.jsFWHtmlSpan').bind('mouseover', function() {
					jQuery.jsFirebug.highlight('add', this.obj);
				}).bind('mouseout', function() {
					jQuery.jsFirebug.highlight('remove');
				}).bind('click', function(event) {
					jQuery.jsFirebug.findStyles(this.obj);
				});
				this.jsFWHtmlEnd = document.createElement('div');
				jQuery(this.jsFWHtmlEnd)
					.html('<span class="jsFWHtmlTag">&lt;/body&gt;</span>');
				this.jsFW.append('HTML', this.jsFWHtmlEnd);
			},
			getScript: function() {
				this.jsFW.clear('Script');
				var all = document.getElementsByTagName('*');
				var out = '';
				for ( var i=0; i<all.length; i++ ) {
					if ( all[i].nodeType == 1 ) {
						var tagName = all[i].tagName.toLowerCase();
						if ( tagName == 'script' ) {
							if ( all[i].id != 'jsFirebugScript' ) {
								var strSrc = '';
								var srcFound = false;
								for ( j=0; j<all[i].attributes.length; j++ ) {
									var attrNodeName = all[i].attributes.item(j).nodeName.toLowerCase();
									if ( attrNodeName == 'src' ) {
										strSrc += all[i].attributes.item(j).nodeValue.toLowerCase();
										srcFound = true;
									}
								}
								this.scriptData = all[i].innerHTML;
								this.span = document.createElement('span');
								if ( srcFound ) {
									jQuery.get(strSrc, function(data) {
										jQuery.jsFirebug.span2 = document.createElement('span');
										jQuery(jQuery.jsFirebug.span2 ).html('<span id="scriptHTML' + i + '" class="textSpan"><pre>' + data + '</pre></span>');
										jQuery.jsFirebug.jsFW.append('Script', jQuery.jsFirebug.span2 );
									});
									jQuery(this.span ).html('<span class="headerSpan">' + strSrc + '<\span>');
								} else {
									jQuery(this.span ).html('<span class="headerSpan">(inline script)<\span>');
								}
								this.jsFW.append('Script', this.span );
								this.span2 = document.createElement('span');
								jQuery(this.span2 ).html('<span id="scriptHTML' + i + '" class="textSpan"><pre>' + this.scriptData + '</pre></span>');
								this.jsFW.append('Script', this.span2 );
							}
						}
					}
				}
			},
			formatScript: function(str) {
				alert(str);
				var ary = str.split(';');
				var out = '';
				for ( var i=0; i<ary.length; i++ ) {
					out += ary[i] + ';';
				}
				return out;
			},
			getInfo: function() {
				var markup = document.getElementsByTagName("html")[0].innerHTML;
				var bodymarkup = document.getElementsByTagName("body")[0].innerHTML;
				var nContent = bodymarkup.replace(/<(.|\n)+?>/g,"");
				var markupSize = bodymarkup.length;
				var contentSize = nContent.length;
				var titleContent = this.countTitleAndAlt();
				contentSize -= titleContent;
				var contentPercentage = Math.round( ( contentSize / bodymarkup.length ) * 100 );
			
				this.jsFW.clear('Info');
				
				this.h2 = document.createElement('h2');
				jQuery(this.h2 ).addClass('infoSpan');
				jQuery(this.h2 ).html('Code Weight Specifications');
				this.jsFW.append('Info', this.h2 );
				
				this.span = document.createElement('span');
				jQuery(this.span).addClass('infoSpan');
				jQuery(this.span).html('Total Code Weight: <span class="infoNum">' + markup.length + '</span> bytes.<br />');
				this.jsFW.append('Info', this.span);
				
				this.span = document.createElement('span');
				jQuery(this.span).addClass('infoSpan');
				jQuery(this.span).html('Body Code Weight: <span class="infoNum">' + bodymarkup.length + '</span> bytes.<br />');
				this.jsFW.append('Info', this.span);
				
				this.span = document.createElement('span');
				jQuery(this.span).addClass('infoSpan');
				jQuery(this.span).html('Content Weight: <span class="infoNum">' + contentSize + '</span> bytes.<br />');
				this.jsFW.append('Info', this.span);
				
				this.span = document.createElement('span');
				jQuery(this.span).addClass('infoSpan');
				jQuery(this.span).html('Markup Percent: <span class="infoNum">' + (100 - contentPercentage) + '</span>%.<br />');
				this.jsFW.append('Info', this.span);
				
				this.span = document.createElement('span');
				jQuery(this.span).addClass('infoSpan');
				jQuery(this.span).html('Content Percent: <span class="infoNum">' + contentPercentage + '</span>%.<br />');
				this.jsFW.append('Info', this.span);
				
				this.h2 = document.createElement('h2');
				jQuery(this.h2 ).addClass('infoSpan');
				jQuery(this.h2 ).html('Approximate Download Times');
				this.jsFW.append('Info', this.h2 );
				
				var tt = this.renderTimeTable(this.calcTimes(markupSize * 8))
				this.span = document.createElement('span');
				jQuery(this.span).addClass('infoSpan');
				jQuery(this.span).html(tt);
				this.jsFW.append('Info', this.span);
				
			},
			renderTimeTable: function(timesArray) {
				mHTML = '<table width="400" cellspacing="0"><tr class="headerRow"><td>bps</td><td>0%</td><td>15%</td><td>20%</td><td>25%</td></tr>';
				for ( i=0; i<this.bps.length; i++ ) {
					trClass = i % 2 ? 'on' : 'off';
					mHTML += '<tr class="' + trClass + '"><td>' + this.bps[i] + '</td>';
					for ( j=0; j<timesArray.length; j++ ) {
						if ( timesArray[i][j] != null ) {
							mHTML += '<td>' + timesArray[i][j] + '</td>';
						}
					}
					mHTML += '</tr>';
				}
				mHTML += '</table>';
				return mHTML;
			},
			calcTimes: function(byteSize) {
				times = new Array();
				for ( i=0; i<this.bps.length; i++ ) {
					times[i] = new Array();
					for ( j=0; j<this.loss.length; j++ ) {
						times[i][j] = this.formatTime( Math.round( (byteSize / this.bps[i]) * this.loss[j] ) );
					}
				}
				return times;
			},
			countTitleAndAlt: function() {
				altByteSize = 0;
				allObj = document.getElementsByTagName('*');
				for ( i=0; i<allObj.length; i++ ) {
					nTitle = allObj[i].title;
					nAlt = allObj[i].alt;
					if ( nTitle ) {
						altByteSize += nTitle.length;
					}
					if ( nAlt ) {
						altByteSize += nAlt.length;
					}
				}
				return altByteSize;
			},
			formatTime: function(time) {
				if ( time <= 59 ) {
					if ( time < 10 ) {
						return '00:0' + time;
					} else {
						return '00:' + time;
					}
				} else {
					time /= 60;
					time = time.toFixed(2);
					returnHTML = '';
					time = time.toString();
					time = time.split('.');
					m = parseInt(time[0]);
					s = parseInt(time[1]);
					if ( m < 10 ) {
						returnHTML += '0' + m + ':';
					} else {
						returnHTML += m + ':';
					}
					if ( s < 10 ) {
						returnHTML += '0' + s;
					} else {
						returnHTML += s;
					}
			
					return returnHTML;
				}
			},
			loopDOM: function(obj, container) {
				this.prevParent = container;
				var k = 0;
				if ( obj.childNodes ) {
					while ( obj.childNodes.length ) {
						if ( !obj.childNodes[k] ) {
							return;
						}			
						if ( obj.childNodes[k].nodeType == 1 ) {
							var curObj = obj.childNodes[k];
							var tagName = curObj.tagName.toLowerCase();
							if (
								tagName != 'meta' &&
								tagName != 'title' &&
								tagName != 'link' &&
								tagName != 'script' &&
								tagName != 'html' &&
								tagName != 'head') {
								if ( curObj.id == 'outputWindowContainer' ) {
									return;
								}
								var newContainer = document.createElement('div');
								newContainer.style.marginLeft = '20px';
								container.endTag = true;
								var jsFWHtmlString = slash = jsFWHtmlText = endHTML = '';
								var hasChildren = false;
								var jsFWHtmTagStart = newContainer.appendChild(document.createElement("span"));
								var jsFWHtmlString = '<span class="jsFWHtmlTag">&lt;' + tagName;
								for ( z=0; z<curObj.attributes.length; z++ ) {
									if ( curObj.attributes[z].name == 'id' || curObj.attributes[z].name == 'class' ) {
										jsFWHtmlString += ' <span class="jsFWHtmlAttributeName">' + curObj.attributes[z].name + '</span>="<span class="jsFWHtmlAttributeValue">' + curObj.attributes[z].value + '</span>"';
									}
								}
								for ( var zz=0; zz<curObj.childNodes.length; zz++ ) {
									if (curObj.childNodes[zz].nodeType == 3) {
										jsFWHtmlText = '<span class="jsFWHtmlText">' + curObj.childNodes[0].nodeValue + '</span>';
									}
									if (curObj.childNodes[zz].nodeType == 1) {
										hasChildren = true;
									}
								}
								if ( tagName == 'br' || tagName == 'img') {
									slash = ' /';
									container.endTag = false;
								}
								if ( !hasChildren ) {
									if ( tagName != 'img' && tagName != 'br') {
										endHTML = '<span class="jsFWHtmlTag">&lt;/' + tagName + '&gt;</span>';
										container.endTag = false;
									}
								}
								jsFWHtmlString += slash + '&gt;</span>' + jsFWHtmlText + endHTML;
								jsFWHtmTagStart.obj = curObj;
								jQuery(jsFWHtmTagStart)
									.addClass('jsFWHtmlSpan');
								jsFWHtmTagStart.innerHTML = jsFWHtmlString + '<br />';
								if ( container.endTag ) {
									if ( tagName != 'img' && tagName != 'br') {
										var jsFWHtmTagEnd = newContainer.appendChild(document.createElement("span"));
										newContainer.endTagObj = jsFWHtmTagEnd;
										jQuery(jsFWHtmTagEnd)
											.css('padding-left', '7px')
											.addClass('jsFWHtmlTag');
										jsFWHtmTagEnd.innerHTML = '&lt;/' + tagName + '&gt;';
										
										var expandSign = newContainer.insertBefore(document.createElement("span"), jsFWHtmTagStart);
										jQuery(expandSign).addClass('expandSign');
										expandSign.innerHTML = '-';
										expandSign.onclick = function() {
											for ( var i=0; i<this.parentNode.childNodes.length; i++ ) {
												if ( this.parentNode.childNodes[i].nodeType == 1 ) {
													if ( this.parentNode.childNodes[i].tagName.toLowerCase() == 'div') {
														jQuery(this.parentNode.childNodes[i]).toggle();
													}
												}
											}
											if ( this.innerHTML == '+' ) {
												this.innerHTML = '-';
											} else {
												this.innerHTML = '+';
											}
										}
										
									}
								}
								if (container.endTagObj != null) {
									container.insertBefore(newContainer, container.endTagObj);
								} else {
									container.appendChild(newContainer);
								}
								this.loopDOM(curObj, newContainer);
							}
						}
						k++;
					}
				}
			},
			showCssFiles: function() {
				this.jsFW.clear('CSS');
				this._outputStr = '';
				var ssOutputWrap = document.createElement('div');
				jQuery(ssOutputWrap).attr('id', 'ssOutputWrap');
				for ( var i=0; i<this._ruleSet.length; i++ ) {
					if ( this._ruleSet[i] == undefined || this._ruleSet[i]._href.indexOf(jsFBCss) != -1 ) {
						continue;
					}
					if ( this._ruleSet[i]._rule ) {
						this._cssFileName = '';
						var isIndexOf = this._ruleSet[i]._href.lastIndexOf('/');
						if ( isIndexOf != -1 ) {
							this._cssFileName = this._ruleSet[i]._href.substring(isIndexOf + 1, this._ruleSet[i]._href.length);
						} else {
							this._cssFileName = this._ruleSet[i]._href;
						}
						this._outputStr += '<a class="cssHrefConatiner" href="' + this._ruleSet[i]._href + '" target="_blank">' + this._cssFileName + '</a><br />';
						for ( var j=0; j<this._ruleSet[i]._rule.length; j++ ) {
							if ( !this._ruleSet[i]._rule[j].selectorText || this._ruleSet[i]._rule[j].selectorText.toLowerCase() == 'unknown' || this._ruleSet[i]._rule[j].style.cssText == '') {
								continue;
							}
							this._outputStr += this._ruleSet[i]._rule[j].selectorText.toLowerCase() + ' {<br />';
							var temp = this._ruleSet[i]._rule[j].style.cssText.split(';');
							for ( var k=0; k<temp.length - 1; k++ ) {
								if ( temp[k] == '' ) {
									continue;
								}
								var temp2 = temp[k].split(':');
								this._outputStr += '<span style="color: #00F; padding-left: 20px;">' + temp2[0].toLowerCase() + ': ' + temp2[1] + ';</span>';
							}
							this._outputStr += '}<br /><br />';
						}
					}
				}
				ssOutputWrap.innerHTML = this._outputStr;
				this.jsFW.append('CSS', ssOutputWrap);
			},
			getLineNumber: function(pSelectorText) {
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
					} catch(e) {}
				}
				return '';
			},
			createRule: function(selectorText, cssText, url) {
				var allCssText = cssText.replace(/^\s+/g, '').replace(/\s+$/g, '').split(';');
				var cssRuleWrap = document.createElement('div');
				jQuery(cssRuleWrap).attr('id', 'cssRuleContainer' + this.dInc)
					.addClass('cssRuleContainer');
				this.dInc++;
				var _cssFileName = '';
				if (url.lastIndexOf('/') != -1) {
					_cssFileName = url.substring(url.lastIndexOf('/') + 1, url.length);
				} else {
					_cssFileName = url;
				}
				var cssHrefWrap = document.createElement('a');
				jQuery(cssHrefWrap).addClass('cssHrefConatiner')
					.attr('href', url)
					.attr('target', '_blank')
					.html(_cssFileName + '<br />');
				jQuery(cssRuleWrap).append(cssHrefWrap);
				
				var selectorTextWrap = document.createElement('span');
				jQuery(selectorTextWrap).attr('id', 'cssSelectorTextContainer')
					.html(selectorText + ' {<br />');
				jQuery(cssRuleWrap).append(selectorTextWrap);
				
				for (var i=0; i<allCssText.length; i++) {
					if (allCssText[i] != '') {
						var _strikethrough = '';
						var _isApplied = jQuery.jsFirebug.isApplied(allCssText[i]);
						if (allCssText[i].indexOf('rgb(') != -1) {
							allCssText[i] = allCssText[i].replace('rgb(', '').replace(')', '');
							var _temp = allCssText[i].split(':')[1].split(',');
							var r = parseInt(_temp[0]).toString(16).toUpperCase();
							var g = parseInt(_temp[1]).toString(16).toUpperCase();
							var b = parseInt(_temp[2]).toString(16).toUpperCase();
							if (r.length == 1) {
								r = 0 + r;
							}
							if (g.length == 1) {
								g = 0 + g;
							}
							if (b.length == 1) {
								b = 0 + b;
							}
							var _new = '#' + r + g + b;
							allCssText[i] = allCssText[i].split(':')[0] + ': ' + _new;
						}
						if (!_isApplied) {
							_strikethrough = 'line-through';
							if (allCssText[i].indexOf('rgb(') != -1) {
								allCssText[i] = allCssText[i].replace('rgb(', '').replace(')', '');
								var _temp = allCssText[i].split(':')[1].split(',');
								var r = parseInt(_temp[0]).toString(16).toUpperCase();
								var g = parseInt(_temp[1]).toString(16).toUpperCase();
								var b = parseInt(_temp[2]).toString(16).toUpperCase();
								if (r.length == 1) {
									r = 0 + r;
								}
								if (g.length == 1) {
									g = 0 + g;
								}
								if (b.length == 1) {
									b = 0 + b;
								}
								var _new = '#' + r + g + b;
								allCssText[i] = allCssText[i].split(':')[0] + ': ' + _new;
							}
						} else {
							if (allCssText[i].indexOf('url(') != -1) {
								var _image = allCssText[i].substring(allCssText[i].indexOf('url(') + 4, allCssText[i].indexOf(')', allCssText[i].indexOf('url(')));
								if (document.all) {
									_image = _image.replace(/"/g, '');
								}
							}
						}
						var _cssTextProperty = allCssText[i].split(':')[0];
						var _cssTextValue = allCssText[i].split(':')[1];
						var _mPWidth = 6 * _cssTextProperty.length;
						var _mVWidth = 6 *  _cssTextValue.length;
						jQuery.jsFirebug.createPropertyValueSet(cssRuleWrap, this, false, _mPWidth, _cssTextProperty, _cssTextProperty, _mVWidth, _cssTextValue, _strikethrough, _cssTextProperty, _image, this.objToCheck);
					}
				}
				this.jsFW.append('Style', document.createElement('br'));
				this.jsFW.append('Style', cssRuleWrap);
				var cssRuleWrapEnd = document.createElement('div')
				jQuery(cssRuleWrapEnd).addClass('cssRuleContainer')
					.html('}<br />');
				this.jsFW.append('Style', cssRuleWrapEnd);
			},
			isApplied: function(cssText) {
				var _styleToCheck = _valueToCheck = '';
				_styleToCheck = cssText.replace(/^\s+/g, '').replace(/\s+$/g, '').split(':')[0];
				_valueToCheck = cssText.replace(/^\s+/g, '').replace(/\s+$/g, '').split(':')[1];
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
							case 0: {
								_tempSstyleToCheck = document.all ? _styleToCheck + 'Top' : _styleToCheck + '-top';
								break;
							}
							case 1: {
								_tempSstyleToCheck = document.all ? _styleToCheck + 'Right' : _styleToCheck + '-right';
								break;
							}
							case 2: {
								_tempSstyleToCheck = document.all ? _styleToCheck + 'Bottom' : _styleToCheck + '-bottom';
								break;
							}
							case 3: {
								_tempSstyleToCheck = document.all ? _styleToCheck + 'Left' : _styleToCheck + '-left';
								break;
							}
						}
						var _bStyle = jQuery(this.objToCheck).css(_tempSstyleToCheck);
						_tempC += _bStyle + ' ';
					}
					if ( _tempC.replace(/\s/g, '').indexOf(_valueToCheck.replace(/\s/g, '')) != -1 ) {
						return true;
					}
					
				}
				if (_styleToCheck == 'background') {
					var _temp = _valueToCheck.split(' ');
					var _tempC = '';
					for (var i=0; i<6; i++) {
						var _tempSstyleToCheck = '';
						switch (i) {
							case 0: {
								_tempSstyleToCheck = document.all ? _styleToCheck + 'Color' : _styleToCheck + '-color';
								break;
							}
							case 1: {
								_tempSstyleToCheck = document.all ? _styleToCheck + 'Image' : _styleToCheck + '-image';
								break;
							}
							case 2: {
								_tempSstyleToCheck = document.all ? _styleToCheck + 'Attachment' : _styleToCheck + '-attachment';
								break;
							}
							case 3: {
								_tempSstyleToCheck = document.all ? _styleToCheck + 'PositionX' : _styleToCheck + '-position-x';
								break;
							}
							case 4: {
								_tempSstyleToCheck = document.all ? _styleToCheck + 'PositionY' : _styleToCheck + '-position-y';
								break;
							}
							case 5: {
								_tempSstyleToCheck = document.all ? _styleToCheck + 'Repeat' : _styleToCheck + '-repeat';
								break;
							}
						}
						var _bStyle = jQuery(this.objToCheck).css(_tempSstyleToCheck);
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
				var _bStyle = ' ' + jQuery(this.objToCheck).css(_styleToCheck);
				if ( _bStyle == _valueToCheck ) {
					return true;
				} else {
					return false;
				}
			},
			createPropertyValueSet: function(jsFWHtmlWrap, obj, isNew, propW, propVal, propOldVal, valW, valVal, strike, propToChange, image, objToCheck) {
				/* create an ID */
				var _mID = 'rule' + this.newPropInc;
				
				/* create the containing span */
				var cssText = document.createElement('span');
				cssText._this = this;
				jQuery(cssText).attr('id', _mID)
					.addClass('oCssTextSpan');
				jQuery(jsFWHtmlWrap).append(cssText);
				
				var disable = document.createElement('div');
				disable._this = this;
				disable._rule = cssText;
				disable._on = false;
				disable._holdValue = '';
				disable.objToCheck = objToCheck;
				jQuery(disable).attr('id', 'disableRule' + this.newPropInc)
					.addClass('disableSpan')
					.bind('mouseover', function(event) {
						jQuery.jsFirebug.disable(event, this);
					}).bind('mouseout', function(event) {
						jQuery.jsFirebug.disable(event, this);
					}).bind('click', function(event) {
						jQuery.jsFirebug.disable(event, this);
					});
				jQuery(cssText).append(disable);
				
				// create the property textbox
				var txtProp = document.createElement('input');
				txtProp._parentID = _mID;
				txtProp._parentContainerID = jsFWHtmlWrap.id;
				txtProp.currentObj = obj.currentObj;
				txtProp._selectorText = obj._selectorText;
				jQuery(txtProp).attr('type', 'text')
					.addClass('oProperty');
				if ( propW != '' ) {
					if ( propW > 150 ) {
						jQuery(txtProp).css('width', '150px');
					} else {
						jQuery(txtProp).css('width', propW + 'px');
					}
				} else {
					jQuery(txtProp).css('width', '75px');
				}
				if (propVal != '') {
					jQuery(txtProp).attr('value', propVal.replace(/^\s+/g, ''));
				} else {
					jQuery(txtProp).attr('value', '');
				}
				jQuery(txtProp).css('text-decoration', strike)
					.bind('focus', function() {
						jQuery(this).css('border', '1px solid #FFF');
					}).bind('blur', function() {
						jQuery.jsFirebug.checkProperty(this);
					}).bind('keyup', function(event) {
						jQuery.jsFirebug.changeRuleProp(this, event);
					})
				if ( propOldVal != '' ) {
					txtProp._oldValue = propOldVal.replace(/^\s+/g, '');
				} else {
					txtProp._oldValue = '';
				}
				jQuery(cssText)
					.append(txtProp)
					.append(document.createTextNode(' : '));
				/* create the value textbox */
				var txtVal = document.createElement('input');
				txtVal.currentObj = obj.currentObj;
				txtVal._selectorText = obj._selectorText;
				txtVal._parentID = _mID;
				txtVal._parentContainerID = jsFWHtmlWrap.id;
				txtVal._sibling = txtProp;
				txtVal.objToCheck = objToCheck;
				txtVal._image = image;
				jQuery(txtVal).attr('type', 'text')
					.addClass('oValue');
				if ( valW != '' ) {
					if ( valW > 250 ) {
						jQuery(txtVal).css('width', '250px');
					} else {
						jQuery(txtVal).css('width', valW + 'px');
					}
				} else {
					jQuery(txtVal).css('width', '75px');
				}
				if (valVal != '') {
					jQuery(txtVal).attr('value', valVal.substring(1, valVal.length));
				} else {
					jQuery(txtVal).attr('value', 'undefined');
				}
				jQuery(txtVal).css('text-decoration', strike);

				if ( valVal.indexOf('#') != -1 ) {
					txtVal.previewObj = 'color';
				}
				if ( valVal.indexOf('url(') != -1 ) {
					txtVal.previewObj = 'image';
				}
				jQuery(txtVal).bind('focus', function() {
					jQuery(this).css('border', '1px solid #FFF');
				}).bind('mouseover', function(event) {
					jQuery.jsFirebug.previewPopup(this, 'create', event);
				}).bind('mouseout', function(event) {
					jQuery.jsFirebug.previewPopup(this, 'remove', event);
				}).bind('blur', function() {
					jQuery.jsFirebug.checkValue(this);
				}).bind('keyup', function(event) {
					jQuery.jsFirebug.changeRuleValue(this, event);
				}).css('cursor', 'pointer');
				if (propToChange != '') {
					txtVal._propertyToChange = propToChange;
				} else {
					txtVal._propertyToChange = '';
				}
				jQuery(cssText).append(txtVal);
				
				/* attach the property and value textboxes to the containing span */
				var br = document.createElement('br');
				jQuery(br).css('clear', 'left');
				jQuery(cssText).append(br);
				
				txtProp._sibling = txtVal;
				txtProp._value = txtVal.value;
				if (isNew) {
					jQuery(txtProp).css('border', '1px solid #FFF')
						.focus();
				}
				disable.prop = txtProp;
				disable._value = txtVal;
				
				this.newPropInc++;
			},
			changeRuleValue: function(obj, e) {
				var KeyID = document.all ? window.event.keyCode : e.keyCode;
				var prop = obj._sibling.value.replace(/\s/g, '');
				if ( prop.indexOf('-') != -1 ) {
					var pos = prop.indexOf('-');
					prop = prop.substring(0, pos) + prop.substring(pos + 1, pos + 2).toUpperCase() + prop.substring(pos + 2, prop.length);
				}
				switch (KeyID) {
					case 38: {
						if ( obj.value.indexOf('px') != -1 ) {
							var mNum =  parseInt( obj.value.substring( 0, obj.value.indexOf('px') ) );
							var mPX = obj.value.substring( obj.value.indexOf('px'), obj.value.length );
						}
						if ( obj.value.indexOf('pt') != -1 ) {
							var mNum =  parseInt( obj.value.substring( 0, obj.value.indexOf('pt') ) );
							var mPX = obj.value.substring( obj.value.indexOf('pt'), obj.value.length );
						}
						if ( obj.value.indexOf('em') != -1 ) {
							var mNum =  parseInt( obj.value.substring( 0, obj.value.indexOf('em') ) );
							var mPX = obj.value.substring( obj.value.indexOf('em'), obj.value.length );
						}
						mNum++;
						obj.value = mNum.toString() + mPX;
						eval( 'obj.currentObj.style.' + prop + ' = \'' + obj.value + '\';' );
						if ( prop == 'fontFamily' ) {
							if (this.ffInc < 0) {
								this.ffInc = this.fontFamilies.length - 1;
							}
							obj.value = this.fontFamilies[this.ffInc];
							eval('obj.currentObj.style.' + prop + ' = \'' + obj.value + '\';'); this.ffInc--;
						}
						break;
					}
					case 40: {
						if ( obj.value.indexOf('px') != -1 ) {
							var mNum =  parseInt( obj.value.substring( 0, obj.value.indexOf('px') ) );
							var mPX = obj.value.substring( obj.value.indexOf('px'), obj.value.length );
						}
						if ( obj.value.indexOf('pt') != -1 ) {
							var mNum =  parseInt( obj.value.substring( 0, obj.value.indexOf('pt') ) );
							var mPX = obj.value.substring( obj.value.indexOf('pt'), obj.value.length );
						}
						if ( obj.value.indexOf('em') != -1 ) {
							var mNum =  parseInt( objvalue.substring(0, obj.value.indexOf('em') ) );
							var mPX = obj.value.substring( obj.value.indexOf('em'), obj.value.length );
						}
						mNum--;
						obj.value = mNum.toString() + mPX;
						eval('obj.currentObj.style.' + prop + ' = \'' + obj.value + '\';' );
						if ( prop == 'fontFamily' ) {
							if (this.ffInc >= this.fontFamilies.length) {
								this.ffInc = 0;
							}
							obj.value = this.fontFamilies[this.ffInc];
							eval( 'obj.currentObj.style.' + prop + ' = \'' + obj.value + '\';' );
							this.ffInc++;
						}
						break;
					}
					case 13: {
						if ( obj.currentObj ) {
							if ( obj.value != '' ) {
								eval( 'obj.currentObj.style.' + prop + ' = \'' + obj.value + '\';' );
							}
							obj.style.border = 'none';
						}
						if ( obj.style.border.indexOf('none') != -1 || obj.style.border == '' ) {
							var _mContainer = document.getElementById( obj._parentContainerID );
							if ( _mContainer.lastChild.id == obj._parentID ) {
								jQuery.jsFirebug.createPropertyValueSet(_mContainer, obj, true, '', '', '', '', '', '', '', '', obj.objToCheck);
							}
						}
						break;
					}
				}
				jQuery(obj).css('width', 8 *  obj.value.length + 'px');
			},
			checkProperty: function(obj) {
				obj.style.border = 'none';
				if ( obj.value == '' ) {
					if ( this._ruleSet ) {
						for ( var h=0; h<this._ruleSet.length; h++ ) {
							if ( this._ruleSet[h] == undefined ) {
								continue;
							}
							if ( this._ruleSet[h]._href.indexOf(jsFBCss) != -1 ) {
								continue;
							}
							if ( this._ruleSet[h]._rule ) {
								for ( var j=0; j<this._ruleSet[h]._rule.length; j++ ) {
									if ( !this._ruleSet[h]._rule[j].selectorText || this._ruleSet[h]._rule[j].selectorText.toLowerCase() == 'unknown' ) {
										continue;
									}
									var _selectorText = this._ruleSet[h]._rule[j].selectorText;
									if ( _selectorText == obj._selectorText ) {
										var _newStr = '';
										var _rule = this._ruleSet[h]._rule[j].style.cssText.split(';');
										for ( var k=0; k<_rule.length; k++ ) {
											if ( _rule[k].split(':')[0].replace(/\s/g, '').toLowerCase() != obj._oldValue ) {
												if ( _rule[k].split(':')[0] != '' ) {
													_newStr += _rule[k].split(':')[0] + ':' + _rule[k].split(':')[1] + ';';
												}
											}
										}
										this._ruleSet[h]._rule[j].style.cssText = _newStr;
										jQuery('#' + obj._parentID).remove();
									}
								}
							}
						}
					}
				}
			},
			checkValue: function(obj) {
				if ( obj.value != '' ) {
					var prop = obj._sibling.value.replace(/\s/g, '');
					if ( prop.indexOf('-') != -1 ) {
						var pos = prop.indexOf('-');
						prop = prop.substring(0, pos) + prop.substring(pos + 1, pos + 2).toUpperCase() + prop.substring(pos + 2, prop.length);
					}
					obj.style.border = 'none';
					if ( this._ruleSet ) {
						for ( var h=0; h<this._ruleSet.length; h++ ) {
							if ( this._ruleSet[h] == undefined || this._ruleSet[h]._href.indexOf(jsFBCss) != -1 ) {
								continue;
							}
							if ( this._ruleSet[h]._rule ) {
								for ( var i=0; i<this._ruleSet[h]._rule.length; i++ ) {
									if ( !this._ruleSet[h]._rule[i].selectorText || this._ruleSet[h]._rule[i].selectorText.toLowerCase() == 'unknown' ) {
										continue;
									}
									var _selectorText = this._ruleSet[h]._rule[i].selectorText;
									if (_selectorText == obj._selectorText) {
										eval('this._ruleSet[h]._rule[i].style.' + prop + ' = \'' + obj.value + '\';');
									}
								}
							}
						}
					}
				}
			},
			selectRange: function(textbox, start, len) {
				if (textbox.createTextRange) {
					var oRange = textbox.createTextRange();
					oRange.moveStart("character", start);
					oRange.moveEnd("character", len - textbox.value.length);
					oRange.select();
				} else if (textbox.setSelectionRange) {
					textbox.setSelectionRange(start, len);
				}
				textbox.focus();
			},
			typeAhead: function(textbox, str) {
				if (textbox.createTextRange || textbox.setSelectionRange) {
					var iLen = textbox.value.length;
					textbox.value = str;
					this.selectRange(textbox, iLen, str.length);
				}
			},
			changeRuleProp: function(obj, e) {
				var KeyID = document.all ? window.event.keyCode : e.keyCode;
				var aryProps = jQuery.jsFirebug.propAF;
				switch (KeyID) {
					/* up arrow */
					case 38: {
						for (var i=0; i<aryProps.length; i++) {
							if (obj.value == aryProps[i]) {
								if ( i == 0 ) {
									i = aryProps.length;
								}
								obj.value = aryProps[i - 1];
								break;
							}
						}
						break;
					}
					/* down arrow */
					case 40: {
						for (var i=0; i<aryProps.length; i++) {
							if (obj.value == aryProps[i]) {
								if ( i >= aryProps.length - 1 ) {
									i = -1;
								}
								obj.value = aryProps[i + 1];
								break;
							}
						}
						break;
					}
					default: {
						if (obj.value.length > 0) {
							for (var i=0; i<aryProps.length; i++) {
								if ( aryProps[i].substring(0, obj.value.length).indexOf(obj.value) != -1 ) {
									jQuery.jsFirebug.typeAhead(obj, aryProps[i]);
									break;
								}
							}
						}
						break;
					}
				}
				jQuery(obj).css('width', 6 * obj.value.length + 'px');
			},
			highlight: function(action, obj) {
				switch (action) {
					case 'add': {
						var zi = jQuery.jsFirebug.getHighestZIndex();
						if (zi <= 0) {
							zi = 10;
						}
						jQuery(this.highlightWrap).css({
							display: 'block',
							width: obj.offsetWidth + 'px',
							height: obj.offsetHeight + 'px',
							zIndex: zi
						});
						jQuery.jsFirebug.positionObjectToElement(obj, this.highlightWrap, 0, 0);
						break;
					}
					case 'remove': {
						jQuery(this.highlightWrap).css('display', 'none');
						break;
					}
				}
			},
			disable: function(event, obj) {
				switch ( event.type ) {
					case 'mouseover': {
						if ( !obj._on ) {
							jQuery(obj).removeClass('disableSpan');
							jQuery(obj).addClass('disableSpanShow');
						}
						break;
					}
					case 'mouseout': {
						if ( !obj._on ) {
							jQuery(obj).removeClass('disableSpanShow');
							jQuery(obj).addClass('disableSpan');
						}
						break;
					}
					case 'click': {
						if ( !obj._on ) 	{
							obj._on = true;
							obj.className = 'disableSpanOn';
							obj._holdValue = obj._value.value;
							switch (obj.prop.value) {
								case 'background': {
									eval("obj.prop.currentObj.style.backgroundAttachment = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'background-attachment') + "';");
									eval("obj.prop.currentObj.style.backgroundColor = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'background-color') + "';");
									eval("obj.prop.currentObj.style.backgroundImage = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'background-image') + "';");
									eval("obj.prop.currentObj.style.backgroundPosition = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'background-position') + "';");
									eval("obj.prop.currentObj.style.backgroundRepeat = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'background-repeat') + "';");
									break;
								}
								case 'border': {
									eval("obj.prop.currentObj.style.borderBottomColor = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-bottom-color') + "';");
									eval("obj.prop.currentObj.style.borderBottomStyle = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-bottom-style') + "';");
									eval("obj.prop.currentObj.style.borderBottomWidth = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-bottom-width') + "';");
									eval("obj.prop.currentObj.style.borderCollapse = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-collapse') + "';");
									eval("obj.prop.currentObj.style.borderLeftColor = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-left-color') + "';");
									eval("obj.prop.currentObj.style.borderLeftStyle = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-left-style') + "';");
									eval("obj.prop.currentObj.style.borderLeftWidth = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-left-width') + "';");
									eval("obj.prop.currentObj.style.borderRightColor = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-right-color') + "';");
									eval("obj.prop.currentObj.style.borderRightStyle = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-right-style') + "';");
									eval("obj.prop.currentObj.style.borderRightWidth = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-right-width') + "';");
									eval("obj.prop.currentObj.style.borderSpacing = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-spacing') + "';");
									eval("obj.prop.currentObj.style.borderTopColor = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-top-color') + "';");
									eval("obj.prop.currentObj.style.borderTopStyle = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-top-style') + "';");
									eval("obj.prop.currentObj.style.borderTopWidth = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-top-width') + "';");
									break;
								}
								case 'border-bottom': {
									eval("obj.prop.currentObj.style.borderBottomColor = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-bottom-color') + "';");
									eval("obj.prop.currentObj.style.borderBottomStyle = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-bottom-style') + "';");
									eval("obj.prop.currentObj.style.borderBottomWidth = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-bottom-width') + "';");
									break;
								}
								case 'border-color': {
									eval("obj.prop.currentObj.style.borderBottomColor = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-bottom-color') + "';");
									eval("obj.prop.currentObj.style.borderLeftColor = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-left-color') + "';");
									eval("obj.prop.currentObj.style.borderRightColor = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-right-color') + "';");
									eval("obj.prop.currentObj.style.borderTopColor = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-top-color') + "';");
									break;
								}
								case 'border-left': {
									eval("obj.prop.currentObj.style.borderLeftColor = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-left-color') + "';");
									eval("obj.prop.currentObj.style.borderLeftStyle = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-left-style') + "';");
									eval("obj.prop.currentObj.style.borderLeftWidth = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-left-width') + "';");
									break;
								}
								case 'border-right': {
									eval("obj.prop.currentObj.style.borderRightColor = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-right-color') + "';");
									eval("obj.prop.currentObj.style.borderRightStyle = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-right-style') + "';");
									eval("obj.prop.currentObj.style.borderRightWidth = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-right-width') + "';");
									break;
								}
								case 'border-style': {
									eval("obj.prop.currentObj.style.borderBottomStyle = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-bottom-style') + "';");
									eval("obj.prop.currentObj.style.borderLeftStyle = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-left-style') + "';");
									eval("obj.prop.currentObj.style.borderRightStyle = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-right-style') + "';");
									eval("obj.prop.currentObj.style.borderTopStyle = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-top-style') + "';");
									break;
								}
								case 'border-top': {
									eval("obj.prop.currentObj.style.borderTopColor = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-top-color') + "';");
									eval("obj.prop.currentObj.style.borderTopStyle = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-top-style') + "';");
									eval("obj.prop.currentObj.style.borderTopWidth = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-top-width') + "';");
									break;
								}
								case 'border-width': {
									eval("obj.prop.currentObj.style.borderBottomWidth = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-bottom-width') + "';");
									eval("obj.prop.currentObj.style.borderLeftWidth = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-left-width') + "';");
									eval("obj.prop.currentObj.style.borderRightWidth = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-right-width') + "';");
									eval("obj.prop.currentObj.style.borderTopWidth = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'border-top-width') + "';");
									break;
								}
								case 'list-style': {
									eval("obj.prop.currentObj.style.listStyleImage = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'list-style-image') + "';");
									eval("obj.prop.currentObj.style.listStylePosition = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'list-style-position') + "';");
									eval("obj.prop.currentObj.style.listStyleType = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'list-style-type') + "';");
									break;
								}
								case 'font': {
									eval("obj.prop.currentObj.style.fontFamily = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'font-family') + "';");
									eval("obj.prop.currentObj.style.fontSize = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'font-size') + "';");
									eval("obj.prop.currentObj.style.fontSizeAdjust = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'font-size-adjust') + "';");
									eval("obj.prop.currentObj.style.fontStretch = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'font-stretch') + "';");
									eval("obj.prop.currentObj.style.fontStyle = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'font-style') + "';");
									eval("obj.prop.currentObj.style.fontVariant = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'font-variant') + "';");
									eval("obj.prop.currentObj.style.fontWeight = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, 'font-weight') + "';");
									break;
								}
								default:
									eval("obj.prop.currentObj.style." + jQuery.jsFirebug.convertCssProp(obj.prop.value) + " = '" + jQuery.jsFirebug.getDefaults(obj.prop.currentObj, obj.prop.value) + "';");
									break;
							}
							obj.prop.disabled = true;
							obj.prop.className = 'oPropertyDisabled';
							obj._value.disabled = true;
							obj._value.className = 'oValueDisabled';
						} else {
							obj._on = false;
							obj.className = 'disableSpan';
							eval("obj.prop.currentObj.style." + jQuery.jsFirebug.convertCssProp(obj.prop.value) + " = '" + obj._holdValue + "';");
							obj.prop.disabled = false;
							obj.prop.className = 'oProperty';
							obj._value.disabled = false;
							obj._value.className = 'oValue';
						}
						break;
					}
				}
			},
			getDefaults: function(obj, val) {
				var ret = bStyle = '';
				while ( obj = obj.parentNode ) {
					if (obj.nodeName.toLowerCase() == 'body') break;
					if ( document.all ) {
						if ( obj.currentStyle ) {
							bStyle = obj.currentStyle[this.convertCssProp(val)];
							break;
						} else if ( window.getComputedStyle ) {
							bStyle = document.defaultView.getComputedStyle(obj, null).getPropertyValue(this.convertCssProp(val));
							break;
						}
					} else {
						if ( obj.currentStyle ) {
							bStyle = obj.currentStyle[val];
							break;
						} else if ( window.getComputedStyle ) {
							bStyle = document.defaultView.getComputedStyle(obj, null).getPropertyValue(val);
							break;
						}
					}
				}
				var defaultCss = new Array();
				defaultCss['azimuth'] = 'center';
				defaultCss['background'] = '';
				defaultCss['background-attachment'] = 'scroll';
				defaultCss['background-color'] = 'transparent';
				defaultCss['background-image'] = 'none';
				defaultCss['background-position'] = '0% 0%';
				defaultCss['background-repeat'] = 'repeat';
				defaultCss['border'] = '';
				defaultCss['border-bottom'] = '';
				defaultCss['border-bottom-color'] = '';
				defaultCss['border-bottom-style'] = 'none';
				defaultCss['border-bottom-width'] = 'medium';
				defaultCss['border-collapse'] = 'separate';
				defaultCss['border-color'] = '';
				defaultCss['border-left'] = '';
				defaultCss['border-left-color'] = '';
				defaultCss['border-left-style'] = 'none';
				defaultCss['border-left-width'] = 'medium';
				defaultCss['border-right'] = '';
				defaultCss['border-right-color'] = '';
				defaultCss['border-right-style'] = 'none';
				defaultCss['border-right-width'] = 'medium';
				defaultCss['border-spacing'] = '0';
				defaultCss['border-style'] = '';
				defaultCss['border-top'] = '';
				defaultCss['border-top-color'] = '';
				defaultCss['border-top-style'] = 'none';
				defaultCss['border-top-width'] = 'medium';
				defaultCss['border-width'] = '';
				defaultCss['bottom'] = 'auto';
				defaultCss['caption-side'] = 'top';
				defaultCss['clear'] = 'none';
				defaultCss['clip'] = 'auto';
				defaultCss['color'] = 'black'; /* user agent specified */
				defaultCss['content'] = 'normal';
				defaultCss['counter-increment'] = ''; /* user agent dependant */
				defaultCss['counter-reset'] = ''; /* user agent dependant */
				defaultCss['cue'] = '';
				defaultCss['cue-after'] = 'none';
				defaultCss['cue-before'] = 'none';
				defaultCss['cursor'] = 'auto';
				defaultCss['direction'] = 'ltr';
				defaultCss['display'] = 'inline'; /* will probably required some programming although books says inline for all elements */
				defaultCss['elevation'] = 'level';
				defaultCss['empty-cells'] = 'show';
				defaultCss['float'] = 'none';
				defaultCss['font'] = '';
				defaultCss['font-family'] = 'Arial'; /* user agent specified */
				defaultCss['font-size'] = 'medium';
				defaultCss['font-size-adjust'] = 'none';
				defaultCss['font-stretch'] = 'normal';
				defaultCss['font-style'] = 'normal';
				defaultCss['font-variant'] = 'normal';
				defaultCss['font-weight'] = 'normal';
				defaultCss['height'] = 'auto';
				defaultCss['left'] = 'auto';
				defaultCss['letter-spacing'] = 'normal';
				defaultCss['line-height'] = 'normal';
				defaultCss['list-style'] = '';
				defaultCss['list-style-image'] = 'none';
				defaultCss['list-style-position'] = 'outside';
				defaultCss['list-style-type'] = 'disc'; 
				defaultCss['margin'] = '0'; /* not defined */
				defaultCss['margin-bottom'] = '0';
				defaultCss['margin-left'] = '0';
				defaultCss['margin-right'] = '0';
				defaultCss['margin-top'] = '0';
				defaultCss['marker-offset'] = 'auto';
				defaultCss['marks'] = 'none';
				defaultCss['max-height'] = 'none';
				defaultCss['max-width'] = 'none';
				defaultCss['min-height'] = '0';
				defaultCss['min-width'] = '0';
				defaultCss['orphans'] = '2';
				defaultCss['outline'] = '';
				defaultCss['outline-color'] = 'invert'; /* or user agent specific */
				defaultCss['outline-style'] = 'none';
				defaultCss['outline-width'] = 'medium';
				defaultCss['overflow'] = 'visile';
				defaultCss['padding'] = '0';
				defaultCss['padding-bottom'] = '0';
				defaultCss['padding-left'] = '0';
				defaultCss['padding-right'] = '0';
				defaultCss['padding-top'] = '0';
				defaultCss['page'] = 'auto';
				defaultCss['page-break-after'] = 'auto';
				defaultCss['page-break-before'] = 'auto';
				defaultCss['page-break-inside'] = 'auto';
				defaultCss['pause'] = '0';
				defaultCss['pause-after'] = '0';
				defaultCss['pause-before'] = '0';
				defaultCss['pitch'] = 'medium';
				defaultCss['pitch-range'] = '50';
				defaultCss['play-during'] = 'auto';
				defaultCss['position'] = 'static';
				defaultCss['quotes'] = ''; /* user agent dependant */
				defaultCss['richness'] = '50';
				defaultCss['right'] = 'auto';
				defaultCss['size'] = 'auto';
				defaultCss['speak'] = 'normal';
				defaultCss['speak-header'] = 'once';
				defaultCss['speak-numeral'] = 'continuous';
				defaultCss['speak-punctuation'] = 'none';
				defaultCss['speech-rate'] = 'medium';
				defaultCss['stress'] = '50';
				defaultCss['table-layout'] = 'auto';
				defaultCss['text-align'] = 'inherit'; /* user agent spcific; may also depend on writing direction */
				defaultCss['text-decoration'] = 'none';
				defaultCss['text-indent'] = '0';
				defaultCss['text-shadow'] = 'none';
				defaultCss['text-transform'] = 'none';
				defaultCss['top'] = 'auto';
				defaultCss['unicode-bidi'] = 'normal';
				defaultCss['vertical-align'] = 'baseline';
				defaultCss['visibility'] = 'inherit';
				defaultCss['voice-family'] = ''; /* user agent dependant */
				defaultCss['volume'] = 'medium';
				defaultCss['white-space'] = 'normal';
				defaultCss['widows'] = '2';
				defaultCss['width'] = 'auto';
				defaultCss['word-spacing'] = 'normal';
				defaultCss['z-index'] = 'auto';
				ret = bStyle != '' ? bStyle : defaultCss[val];
				if ( ret == undefined ) {
					ret = defaultCss[val];
				}
				return ret;
			},
			convertCssProp: function(str) {
				var iStr = str.replace(/\s/g, '');
				var ret = char = '';
				var isDash = false;
				for ( var i=0; i<iStr.length; i++ ) {
					char = isDash ? iStr.charAt(i).toUpperCase() : iStr.charAt(i);
					isDash = false;
					if ( iStr.charAt(i) == '-' ) {
						isDash = true;
						continue;
					}
					ret += char;
				}
				return ret;
			},
			previewPopup: function(obj, action, e) {
				switch ( action ) {
					case 'create': {
						var posx = posy = 0;
						if ( !e ) {
							var e = window.event;
						}
						if (e.pageX || e.pageY) {
							posx = e.pageX;
							posy = e.pageY;
						} else if (e.clientX || e.clientY) {
							posx = e.clientX + document.body.scrollLeft	+ document.documentElement.scrollLeft;
							posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
						}
						var popupContainer = document.body.appendChild(document.createElement('div'));
						jQuery(popupContainer).attr('id', 'popupContainer')
							.css('z-index', jQuery.jsFirebug.getHighestZIndex() + 1);
						switch ( obj.previewObj ) {
							case 'color':
								jQuery(popupContainer).addClass('colorPopup')
									.css({
										background: obj.value,
										width: '50px',
										height: '15px',
										border: 'medium double rgb(0, 0, 0)'
									});
								break;
							case 'image':
								var oImage = document.createElement('img');
								jQuery(oImage).attr('src', obj._image);
								var _mW = oImage.width;
								var _mH = oImage.height;
								if ( oImage.width > 100 ) {
									var _ratio = parseFloat(oImage.width / 100);
									jQuery(oImage).attr('width', '100')
										.attr('height', oImage.height / _ratio);
								}
								jQuery(popupContainer).addClass('imagePopup')
									.html('<br />' + _mW + ' x ' + _mH)
									.prepend(oImage);
								break;
						}
						jQuery(popupContainer).css({
							left: posx + 'px',
							top: (posy + 20) + 'px'
						});
						break;
					}
					case 'remove': {
						jQuery('#popupContainer').remove();
						break;
					}
				}
			},
			positionObjectToElement: function(obj, element, offX, offY) {
				var _coordinates = this.findPos(obj);
				element.style.left = _coordinates[0] + offX + 'px';
				element.style.top = _coordinates[1] + offY + 'px';
			},
			findPos: function(obj) {
				var cLeft = cTop = 0;
				if (obj.offsetParent) {
					cLeft = obj.offsetLeft;
					cTop = obj.offsetTop;
					while (obj = obj.offsetParent) {
						cLeft += obj.offsetLeft;
						cTop += obj.offsetTop;
					}
				}
				return [cLeft, cTop];
			},
			getHighestZIndex: function() {
				var jsFWAll = document.getElementsByTagName("*");
				var mZindices = new Array();
				mZindices[0] = 0;
				for (var i=0; i<jsFWAll.length; i++) {
					if (jsFWAll[i].nodeType == 1) {
						if (document.all) {
							if (jsFWAll[i].currentStyle) {
								mZIndex = jsFWAll[i].currentStyle["zIndex"];
								if (!isNaN(mZIndex)) mZindices.push(mZIndex);
							} else if (window.getComputedStyle) {
								mZIndex = document.defaultView.getComputedStyle(jsFWAll[i], null).getPropertyValue("zIndex");
								if (!isNaN(mZIndex)) mZindices.push(mZIndex);
							}
						} else {
							if (jsFWAll[i].currentStyle) {
								mZIndex = jsFWAll[i].currentStyle["z-index"];
								if (!isNaN(mZIndex)) mZindices.push(mZIndex);
							} else if (window.getComputedStyle) {
								mZIndex = document.defaultView.getComputedStyle(jsFWAll[i], null).getPropertyValue("z-index");
								if (!isNaN(mZIndex)) mZindices.push(mZIndex);
							}
						}
					}
				}
				mZindices = mZindices.sort(this.sortZindex);
				return parseInt(mZindices[mZindices.length - 1]);
			},
			sortZindex: function(a, b) {
				return a - b;
			}
		}
	});
	
	jQuery.jsFirebugWindow = function() {
		this.init();
		this.adjustPosition();
	};
	
	jQuery.extend(jQuery.jsFirebugWindow, {
		prototype: {
			init: function() {
				this.title = 'JS Firebug v 1.1.2 ';
				this.windows = [];
				this.currentWindow = null;
				
				this.jsFW = document.body.appendChild(document.createElement('div'));
				this.jsFW.id = 'outputWindowContainer';
				
				this.heightAdjuster = document.createElement('div');
				jQuery(this.heightAdjuster).addClass('heightAdjuster');
				jQuery(this.jsFW).append(jQuery(this.heightAdjuster));
				
				this.jsFWTitlebarWrap = document.createElement('div');
				jQuery(this.jsFWTitlebarWrap).attr('id', 'outputWindowTitlebarContainer');
				jQuery(this.jsFW).append(jQuery(this.jsFWTitlebarWrap));
				
				this.jsFWTitle = document.createElement('span');
				jQuery(this.jsFWTitle).attr('id', 'oDebuggerTitlebarTitleSpan')
					.html(this.title);
				jQuery(this.jsFWTitlebarWrap).append(jQuery(this.jsFWTitle));
				
				this.jsFWMenuWrap = document.createElement('div');
				jQuery(this.jsFWMenuWrap).attr('id', 'outputWindowMenuDiv');
				jQuery(this.jsFW).append(jQuery(this.jsFWMenuWrap));
				
				/* BTN Style */
				this.btnStyle = document.createElement('span');
				jQuery(this.btnStyle).attr('id', 'btnStyle')
					.addClass('jsFWMenuButton')
					.text('Style')
					.bind('mouseover', function() {
						jQuery(this).toggleClass('jsFWMenuButtonHighlight');
					}).bind('mouseout', function() {
						jQuery(this).toggleClass('jsFWMenuButtonHighlight');
					}).bind('click', function() {
						jQuery.jsFirebugWindow.prototype.show('Style');
					});
				jQuery(this.jsFWMenuWrap).append(jQuery(this.btnStyle));
							
				/* BTN CSS */
				this.btnCss = document.createElement('span');
				jQuery(this.btnCss).attr('id', 'btnCss')
					.addClass('jsFWMenuButton')
					.text('CSS')
					.bind('mouseover', function() {
						jQuery(this).toggleClass('jsFWMenuButtonHighlight');
					}).bind('mouseout', function() {
						jQuery(this).toggleClass('jsFWMenuButtonHighlight');
					}).bind('click', function() {
						jQuery.jsFirebugWindow.prototype.show('CSS');
					});
				jQuery(this.jsFWMenuWrap).append(jQuery(this.btnCss));
				
				/* BTN HTML */
				this.btnHtml = document.createElement('span');
				jQuery(this.btnHtml).attr('id', 'btnHtml')
					.addClass('jsFWMenuButton')
					.text('HTML')
					.bind('mouseover', function() {
						jQuery(this).toggleClass('jsFWMenuButtonHighlight');
					}).bind('mouseout', function() {
						jQuery(this).toggleClass('jsFWMenuButtonHighlight');
					}).bind('click', function() {
						jQuery.jsFirebugWindow.prototype.show('HTML');
					});
				jQuery(this.jsFWMenuWrap).append(jQuery(this.btnHtml));
				
				/* BTN Info */
				this.btnInfo = document.createElement('span');
				jQuery(this.btnInfo).attr('id', 'btnInfo')
					.addClass('jsFWMenuButton')
					.text('Info')
					.bind('mouseover', function() {
						jQuery(this).toggleClass('jsFWMenuButtonHighlight');
					}).bind('mouseout', function() {
						jQuery(this).toggleClass('jsFWMenuButtonHighlight');
					}).bind('click', function() {
						jQuery.jsFirebugWindow.prototype.show('Info');
					});
				jQuery(this.jsFWMenuWrap).append(jQuery(this.btnInfo));
				
				/* BTN Script */
				this.btnScript = document.createElement('span');
				jQuery(this.btnScript).attr('id', 'btnScript')
					.addClass('jsFWMenuButton')
					.text('Script')
					.bind('mouseover', function() {
						jQuery(this).toggleClass('jsFWMenuButtonHighlight');
					}).bind('mouseout', function() {
						jQuery(this).toggleClass('jsFWMenuButtonHighlight');
					}).bind('click', function() {
						jQuery.jsFirebugWindow.prototype.show('Script');
					});
				//jQuery(this.jsFWMenuWrap).append(jQuery(this.btnScript));
				
				/* create the Style window */
				this.jsFWEditor = document.createElement("div");
				jQuery(this.jsFWEditor).attr('id', 'outputWindowEditorContainer')
					.css('display', 'block')
					.bind('scroll', function() {
						jQuery.data(document.body, 'scrollTop', jQuery(this).get(0).scrollTop);
					});
				jQuery(this.jsFW).append(jQuery(this.jsFWEditor));
				this.windows.push(this.jsFWEditor);
				
				/* create the CSS window */
				this.jsFWSSWindow = document.createElement("div");
				jQuery(this.jsFWSSWindow).attr('id', 'outputWindowSSOutputContainer')
					.css('display', 'none')
					.bind('scroll', function() {
						jQuery.data(document.body, 'scrollTop', jQuery(this).get(0).scrollTop);
					});
				jQuery(this.jsFW).append(jQuery(this.jsFWSSWindow));
				this.windows.push(this.jsFWSSWindow);
				
				/* create the HTML window */
				this.jsFWHtmlWindow = document.createElement('div');
				jQuery(this.jsFWHtmlWindow).attr('id', 'jsFWHtmlWindow')
					.css('display', 'none')
					.bind('scroll', function() {
						jQuery.data(document.body, 'scrollTop', jQuery(this).get(0).scrollTop);
					});
				jQuery(this.jsFW).append(jQuery(this.jsFWHtmlWindow));
				this.windows.push(this.jsFWHtmlWindow);
				
				/* create the Info window */
				this.jsFWInfoWindow = document.createElement('div');
				jQuery(this.jsFWInfoWindow).attr('id', 'jsFWInfoWindow')
					.css('display', 'none')
					.bind('scroll', function() {
						jQuery.data(document.body, 'scrollTop', jQuery(this).get(0).scrollTop);
					});
				jQuery(this.jsFW).append(jQuery(this.jsFWInfoWindow));
				this.windows.push(this.jsFWInfoWindow);
				
				/* create the Script window */
				this.jsFWScriptWindow = document.createElement('div');
				jQuery(this.jsFWScriptWindow).attr('id', 'jsFWScriptWindow')
					.css('display', 'none')
					.bind('scroll', function() {
						jQuery.data(document.body, 'scrollTop', jQuery(this).get(0).scrollTop);
					});
				jQuery(this.jsFW).append(jQuery(this.jsFWScriptWindow));
				this.windows.push(this.jsFWScriptWindow);
				
//				jQuery(this.jsFW).resizable({
//					handles: 'n',
//					minHeight: jQuery(this.jsFW).height(),
//					start: function() {
//						var jsFW = jQuery.data(document.body, 'jsFirebugWindow');
//						jQuery.data(document.body, 'htmlResizeHolder', jQuery(jsFW.currentWindow).html());
//						jQuery(jsFW.currentWindow).html('');
//					},
//					stop: function() {
//						var jsFW = jQuery.data(document.body, 'jsFirebugWindow');
//						jQuery(jsFW.currentWindow).html(jQuery.data(document.body, 'htmlResizeHolder'));
//					},
//					resize: function() {
//						jQuery('#outputWindowEditorContainer').css('height', jQuery('#outputWindowContainer').height() - 50);
//						jQuery('#outputWindowSSOutputContainer').css('height', jQuery('#outputWindowContainer').height() - 50);
//						jQuery('#jsFWHtmlWindow').css('height', jQuery('#outputWindowContainer').height() - 50);
//						jQuery('#jsFWInfoWindow').css('height', jQuery('#outputWindowContainer').height() - 50);
//						jQuery('#jsFWScriptWindow').css('height', jQuery('#outputWindowContainer').height() - 50);
//					}
//				});
				this.currentWindow = this.jsFWEditor;
			},
			show: function(scr) {
				var jsFW = jQuery.data(document.body, 'jsFirebugWindow');
				for ( var i=0; i<jsFW.windows.length; i++ ) {
					jQuery(jsFW.windows[i]).hide();
				}
				jQuery(jsFW.getWin(scr)).show();
			},
			adjustPosition: function() {
				var vw, vh;
				if (typeof window.innerWidth != 'undefined') {
					vw = window.innerWidth;
					vh = window.innerHeight;
				} else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
					vw = document.documentElement.clientWidth;
					vh = document.documentElement.clientHeight;
				} else {
					vw = document.getElementsByTagName('body')[0].clientWidth;
					vh = document.getElementsByTagName('body')[0].clientHeight;
				}
				jQuery('#outputWindowContainer')
					.css('top', ( (vh - ( jQuery('#outputWindowContainer').height() - document.documentElement.scrollTop ) - 3) ) + 'px')
					.css('left', '1px');
			},
			changeTitle: function(str) {
				jQuery(this.jsFWTitle).html(this.title + str);
			},
			getWin: function(scr) {
				var win = null;
				switch (scr) {
					case 'Style': {
						win = this.jsFWEditor;
						break;
					}
					case 'CSS': {
						win = this.jsFWSSWindow;
						break;
					}
					case 'HTML': {
						win = this.jsFWHtmlWindow;
						break;
					}
					case 'Info': {
						win = this.jsFWInfoWindow;
						break;
					}
					case 'Script': {
						win = this.jsFWScriptWindow;
						break;
					}
				}
				this.currentWindow = win;
				return win;
			},
			write: function(scr, str) {
				if ( !scr ) {
					return;
				}
				jQuery(this.getWin(scr)).html(str + '<br />');
				jQuery(this.getWin(scr)).get(0).scrollTop = jQuery(this.jsFWEditor).get(0).scrollHeight;
			},
			writeEsc: function(scr, str) {
				if ( !scr ) {
					return;
				}
				jQuery(this.getWin(scr)).text(str).html('<br />');
				jQuery(this.getWin(scr)).get(0).scrollTop = jQuery(this.jsFWEditor).get(0).scrollHeight;
			},
			append: function(scr, obj) {
				if ( !scr || !obj ) {
					return;
				}
				jQuery(this.getWin(scr)).append(obj);
			},
			clear: function(scr) {
				if (!scr) {
					return;
				}
				jQuery(this.getWin(scr)).empty();
			}
		}
	});

	//jQuery(document).ready(function() {
		var jsFWAll = document.body.getElementsByTagName('*');
		for (var i=0; i<jsFWAll.length; i++) {
			if (jsFWAll[i].nodeType == 1) {
				if (jsFWAll[i].nodeName.toLowerCase() == 'a') jsFWAll[i].href = 'javascript: void(0);';
				jsFWAll[i].onclick = jsFWAll[i].onmousedown = null;
			}
		}
		window.onresize = window.onscroll = function() {
			jQuery.jsFirebugWindow.prototype.adjustPosition();
		};
		jQuery.jsFirebug = new jQuery.jsFirebug();
	//});
}