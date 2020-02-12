function childLoaded() {
	var jsFBDomain = 'http://10.69.68.20/CDEObjects/js_firebug/';
	//var jsFBDomain = 'http://common.scrippsnetworks.com/common/js/jsfirebug/';
	var jquery_inc = document.createElement('script');
	jquery_inc.type = 'text/javascript';
	jquery_inc.id = 'jsFirebugScript';
	jquery_inc.src = jsFBDomain + 'test_open/jquery.js';
	jquery_inc.language = 'javascript';
	if ( document.getElementsByTagName('head')[0] )
		document.getElementsByTagName('head')[0].appendChild(jquery_inc);
	else
		document.body.appendChild(jquery_inc);
	jquery_inc.onload = jquery_ready;
	jquery_inc.onreadystatechange = function() {
		if ( jquery_inc.readyState == 'loaded' || jquery_inc.readyState == 'complete' ) {
			jquery_ready();
		}
	};
};
function jquery_ready() {
	jQuery.noConflict();
	(function($) {
			/* right click context menu */
			(function($) {
				$.fn.showMenu = function(options) {
					var opts = $.extend({}, $.fn.showMenu.defaults, options);
					$(this).bind('contextmenu', function(e){
						$(opts.query, jsfbWindow.document).get(0).obj = this;
						$(opts.query, jsfbWindow.document)
							.css({
								display		: 'block',
								top			: e.pageY + 'px',
								left		: e.pageX + 'px',
								position	: 'absolute',
								opacity		: opts.opacity,
								zIndex		: $.jsFirebug.getHighestZIndex() + 1
							});
						return false;
					});
				};
				$.fn.showMenu.defaults = {
					query: jsfbWindow.document,
					opacity: 1.0
				};
			})(jQuery);
			/* clipboard copy */
			$.copy = function(data) { return $.fn.copy.call({}, data); };
			$.fn.copy = function(delimiter) {
				// Get Previous Object List
				var self = this,
				// Capture or Create Div for SWF Object
				flashcopier = (function(fid) {
					return document.getElementById(fid) || (function() {
						var divnode    = document.createElement('div');
							divnode.id = fid;
						document.body.appendChild(divnode);
						return divnode;
					})();
				})('_flash_copier'),
				// Capture our jQuery Selected Data and Scrub
				data = $.map(self, function(bit) {
					return typeof bit === 'object' ? bit.value || bit.innerHTML.replace(/<.+>/g, '') : '';
				}).join( delimiter || '' ).replace(/^\s+|\s+$/g, '') || delimiter,
				// Define SWF Object with our Captured Data
				divinfo = '<embed src="jquery.copy.swf" FlashVars="clipboard=' + encodeURIComponent(data) + '" width="0" height="0" ' + 'type="application/x-shockwave-flash"></embed>';
				// Create SWF Object with Defined Data Above
				flashcopier.innerHTML = divinfo;
				// Return Previous Object List
				return self;
			};
			$.jsFirebug = function() {
				this.init();
				this.getCSS();
				this.getHTML();
				//this.getInfo();
				//this.getScript();
				/* get rid of the "loading... please wait" screen */
				$('#pleaseWait', jsfbWindow.document.body).remove();
			};
			$.extend(jQuery.jsFirebug, {
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
						this.bps = [14400, 28800, 33600, 56000, 128000, 394000, 640000, 10000000];
						this.loss = [1, 1.15, 1.2, 1.25];
						this.styleSheets = document.styleSheets;
						this.ruleSet = [];
						this.parentGeneratedItems = [];
						this.newPropInc = 0;
						this.ffInc = 0;
						this.jsfb = jsfbW;
						/* loop through all stylesheets and push the rules into an array */
						for ( var i=0; i<this.styleSheets.length; i++ ) {
							try {
								this.rules = this.styleSheets[i].cssRules ? this.styleSheets[i].cssRules : this.styleSheets[i].rules;
								this.ruleSet[i] = new Object();
								this.ruleSet[i].rule = new Array();
								this.ruleSet[i].href = this.styleSheets[i].href
								for (var j=0; j<this.rules.length; j++) {
									this.ruleSet[i].rule.push(this.rules[j]);
								}
							} catch(e) {}
						}
						this.jsfb.append('Style', '<span id="noStylePhrase">No styles inspected yet.<br /><br />Click on any element in the parent window to begin inspecting.</span>');
						/* create our highlighter */
						this.highlightWrap = document.createElement('div');
						this.highlightWrap.id = 'highlightWrap';
						$(this.highlightWrap)
							.css({
								position		: 'absolute',
								opacity			: 50 / 100,
								filter			: 'alpha(opacity=' + 50 + ')',
								width			: '0px',
								height			: '0px',
								display			: 'block',
								zIndex			: 100,
								left			: 0,
								top				: 0,
								margin			: '0px',
								padding			: '0px',
								fontSize		: '0px',
								backgroundColor	: '#99F'
							});
						this.parentGeneratedItems.push(this.highlightWrap);
						$(document.body).append(this.highlightWrap);
						$(document.body)
							.mousedown(function( event ) {
								$.jsFirebug.inspectElement(event);
							});
					},
					/* method: inspectElement( event ) */
					inspectElement: function( event ) {
						if ( event == null )
							event = window.event;
						var target = event.target != null ? event.target : event.srcElement;
						var btn = document.all ? 1 : 0;
						if ( event.button == btn ) {
							var obj = target;
							if ( obj.nodeType != 1 )
								return;
							while ( obj ) {
								if ( obj.id == 'jsfWrap')
									return;
								obj = obj.parentNode;
							}
							$.jsFirebug.findStyles(target);
						}
					},
					/* method: findStyles( obj ) */
					findStyles: function( obj ) {
						if ( obj == null || obj == 'undefined' )
							return;
						this.jsfb.show('Style');
						this.jsfb.clear('Style');
						this.dInc = 0;
						this.currentObj = obj;
						this.objToCheck = obj;
						var tmp = '';
						if ( obj.id ) 
							tmp = '#' + obj.id;
						if ( $(obj).attr('className') )
							if ( tmp == '' )
								tmp = '.' + $(obj).attr('className')
						//this.jsfb.changeTitle('<span class="stylesForSpan">Styles for: ' + obj.nodeName + tmp + '</span>');
						/* create span w/ class[retrievedStyleForPhrase] w/ text[Retrieved Styles For:] for the output window */
						var oSpan = jsfbWindow.document.createElement('span');
						$(oSpan)
							.addClass('retrievedStyleForPhrase')
							.text('Retrieved Styles For: ');
						this.jsfb.append('Style', $(oSpan) );
						var oA = jsfbWindow.document.createElement('a');
						oA.obj = obj;
						$(oA)
							.addClass('retrievedStyleForPhrase')
							.attr('href', 'javascript: void(0);')
							.mouseover(function() {
								$.jsFirebug.highlight('add', this.obj);
							})
							.mouseout(function() {
								$.jsFirebug.highlight('remove');
							})
							.html(this.currentObj.nodeName.toLowerCase() + tmp + '<br />');
						this.jsfb.append('Style', oA);
						this.jsfb.append('Style', jsfbWindow.document.createElement('br'));
						while ( this.currentObj ) {
							if ( obj.nodeType == 1 ) {
								if ( this.currentObj.nodeName.toLowerCase() == 'body' )
									return;
								if ( this.currentObj != obj ) {
									var cID = false;
									if ( this.currentObj.id ) {
										var idAttr = jsfbWindow.document.createElement('span');
										$(idAttr)
											.addClass('idAttr')
											.html('#' + this.currentObj.id);
										cID = true;
									}
									if ( $(this.currentObj).attr('className') )
										if ( !cID )
											if ( idAttr )
												$(idAttr).html('.' + $(this.currentObj).attr('className'));
									this.jsfb.append('Style', jsfbWindow.document.createElement('br'));
									var inheritedFrom = jsfbWindow.document.createElement('span');
									$(inheritedFrom)
										.addClass('inheritedFrom')
										.text('Inherited from ');
									var oInheritedFromA = jsfbWindow.document.createElement('a');
									oInheritedFromA.currentObj = this.currentObj;
									$(oInheritedFromA)
										.addClass('')
										.attr('href', 'javascript: void(0);')
										.click(function() {
											$.jsFirebug.highlight('remove');
											$.jsFirebug.matchStyles(this.currentObj)
										})
										.mouseover(function() {
											$.jsFirebug.highlight('add', this.currentObj);
										})
										.mouseout(function() {
											$.jsFirebug.highlight('remove');
										})
										.text(this.currentObj.nodeName.toLowerCase());
									$(inheritedFrom).append(oInheritedFromA);
									if (cID)
										oInheritedFromA.appendChild(idAttr);
									this.jsfb.append('Style', inheritedFrom);
								}
								this.getStyles(this.currentObj);
							}
							this.currentObj = this.currentObj.parentNode;
						}
					},
					/* method: getStyles( obj ) */
					getStyles: function( obj ) {
						var mStyles = [];
						if ( this.ruleSet ) {
							for ( var h=0; h<this.ruleSet.length; h++ ) {
								if ( this.ruleSet[h] == undefined )
									continue;
								if ( this.ruleSet[h].href.indexOf(jsFBCss) != -1 )
									continue;
								if ( this.ruleSet[h].rule ) {
									for ( var i=0; i<this.ruleSet[h].rule.length; i++ ) {
										if ( !this.ruleSet[h].rule[i].selectorText )
											continue;
										if ( this.ruleSet[h].rule[i].selectorText.toLowerCase() == 'unknown' )
											continue;
										var arySelectorText = this.ruleSet[h].rule[i].selectorText.split(',');
										for ( var j=0; j<arySelectorText.length; j++ ) {
											var currentObj = obj;
											var lastObj = objBeforeDC = null;
											var matchIndex = 0;
											var neededBranch = mNodeName = '';
											var directChildSymbolFound = false;
											var eachBranch = arySelectorText[j]
												.replace(/^\s+/g, '')
												.replace(/\s+$/g, '')
												.split(' ');
											eachBranch.reverse();
											// go through each branch backwards
											// div p a
											// becomes
											// a p div
											//for (k=0; k<eachBranch.length; k++) {
											while ( matchIndex < eachBranch.length ) {
												if ( !currentObj )
													break;
												if ( currentObj.nodeType != 1 )
													break;
												if ( currentObj.nodeName == 'BODY' )
													break;
												var isID = isClassName = isNodeName = isAdjacent = isDirectChild = matchFound = false;
												// get the needed branch of the selectorText a, p, div, #id etc...
												neededBranch = eachBranch[matchIndex];
												if ( eachBranch[matchIndex].indexOf(':') != -1 )
													neededBranch = eachBranch[matchIndex].split(':')[0];
												// check for ID
												if ( neededBranch.indexOf('#') != -1 ) {
													isID = true;
													if ( currentObj.id ) {
														if ( neededBranch.substring(neededBranch.indexOf('#') + 1, neededBranch.length) == currentObj.id ) {
															if ( directChildSymbolFound ) {
																if ( objBeforeDC.parentNode == currentObj ) {
																	matchFound = true;
																	matchIndex++;
																}
															} else {
																matchFound = true;
																matchIndex++;
															}
														}
													}
												}
												// check for ClassName
												if ( neededBranch.indexOf('.') != -1 ) {
													isClassName = true;
													if ( $(this.currentObj).attr('className') ) {
														if ( $(this.currentObj).attr('className').indexOf(neededBranch.substring(1, neededBranch.length)) != -1 ) {
															if (directChildSymbolFound) {
																if (objBeforeDC.parentNode == currentObj) {matchFound = true; matchIndex++;}
															} else {
																matchFound = true;
																matchIndex++;
															}
														}
													}
												}
												if ( neededBranch == '+' ) {
													currentObj = lastObj.previousSibling.previousSibling;
													matchIndex++;
													continue;
												}
												if ( neededBranch == '>' ) {
													directChildSymbolFound = true;
													objBeforeDC = lastObj;
													currentObj = lastObj;
													matchIndex++;
													continue;
												}
												if ( !isID && !isClassName && !isAdjacent && !isDirectChild ) {
													isNodeName = true;
													mNodeName = neededBranch.toLowerCase();
												}
												if ( isNodeName )
													if ( mNodeName == currentObj.nodeName.toLowerCase() ) {
														matchFound = true;
														matchIndex++;
													}
												// if a match is found then
												// see if we have checked each branch
												// if so then write to cssText
												// if not then goto the next branch while moving through the DOM
												if ( matchFound ) {
													if ( matchIndex == eachBranch.length ) {
														/* handle IE */
														if ( document.all ) {
															var tmp2 = this.ruleSet[h].rule[i].style.cssText.split(';');
															var cssText = '';
															for ( var y=0; y<tmp2.length; y++ ) {
																var cssTextDefinition = tmp2[y].split(':')[0].toLowerCase();
																var cssTextProp = tmp2[y].split(':')[1];
																cssText += cssTextDefinition + ':' + cssTextProp + ';';
															}
															var tmpSelectorText = arySelectorText[j].split(' ');
															var newSelectorText = '';
															for ( var x=0; x<tmpSelectorText.length; x++ ) {
																var idY = false;
																var clY = false;
																if ( tmpSelectorText[x].indexOf('#') != -1 )
																	if ( tmpSelectorText[x].split('#').length > 1) {
																		idY = true;
																		newSelectorText +=  tmpSelectorText[x].split('#')[0].toLowerCase() + '#' +  tmpSelectorText[x].split('#')[1];
																	}
																if ( tmpSelectorText[x].indexOf('.') != -1 )
																	if ( tmpSelectorText[x].split('.').length > 1) {
																		clY = true;
																		newSelectorText +=  tmpSelectorText[x].split('.')[0].toLowerCase() + '.' +  tmpSelectorText[x].split('.')[1];
																	}
																if ( tmpSelectorText[x] == '>' || tmpSelectorText[x] == '+' )
																	continue;
																if ( !idY && !clY )
																	newSelectorText = tmpSelectorText[x].toLowerCase();
															}
															mStyles.push($.jsFirebug.createRule(newSelectorText, cssText, this.ruleSet[h].href));
														} else
															mStyles.push($.jsFirebug.createRule(arySelectorText[j], this.ruleSet[h].rule[i].style.cssText, this.ruleSet[h].href));
													}
												/*
													if no match was found and we're on the first branch,
													let's break out of the loop
												*/
												} else
													if ( matchIndex == 0 )
														break;
												lastObj = currentObj;
												currentObj = currentObj.parentNode;
											}
										}
									}
								}
							}
						}
						if ( $(obj).attr('style') )
							mStyles.push($(obj).attr('style'));
						return mStyles;
					},
					/* method: getHTML() */
					getHTML: function() {
						this.jsfb.clear('HTML');
						var wrap = jsfbWindow.document.createElement('div');
						$(wrap)
							.attr('id', 'jsfb_htmlWrap')
							.html('<span class="htmlTag">&lt;body&gt;</span>');
						this.jsfb.append('HTML', wrap);
						this.loopDOM(document.body, wrap);
						this.jsfb.append('HTML', '<div><span class="htmlTag">&lt;/body&gt;</span></div>');
					},
					/* method: loopDOM( obj, container ) */
					loopDOM: function( obj, container ) {
						//this.prevParent = container;
						var k = 0;
						if ( obj.childNodes ) {
							while ( obj.childNodes.length ) {
								if ( !obj.childNodes[k] )
									return;
								if ( obj.childNodes[k].nodeType == 1 ) {
									var curObj = obj.childNodes[k];
									var tagName = curObj.tagName.toLowerCase();
									for ( var i=0; i<this.parentGeneratedItems.length; i++ ) {
										if ( this.parentGeneratedItems[i] == curObj )
											return;
									}
									if (
										tagName != 'meta' &&
										tagName != 'title' &&
										tagName != 'link' &&
										tagName != 'script' &&
										tagName != 'html' &&
										tagName != 'head' ) {
										/* create the wrapper for a group of children to draw */
										container.endTag = true;
										var startHTML = slash = htmlText = endHTML = '';
										var hasChildren = false;
										var newContainer = jsfbWindow.document.createElement('div');
										$(newContainer).css('margin-left', '15px');
										var htmlLine = jsfbWindow.document.createElement('span');
										$(newContainer).append(htmlLine);
										var startHTML = '<span class="htmlTag">&lt;' + tagName;
										if ( $(curObj).attr('id') )
											startHTML += ' <span class="htmlAttrName">id</span>="<span class="htmlAttrValue">' + $(curObj).attr('id') + '</span>"';
										if ( $(curObj).attr('class') )
											startHTML += ' <span class="htmlAttrName">class</span>="<span class="htmlAttrValue">' + $(curObj).attr('class') + '</span>"';
										for ( var zz=0; zz<curObj.childNodes.length; zz++ ) {
											/* text_node */
											if ( curObj.childNodes[zz].nodeType == 3 )
												if ( curObj.childNodes[0].nodeValue != null )
													htmlText = '<span class="htmlText">' + curObj.childNodes[0].nodeValue + '</span>';
											/* element_node */
											if ( curObj.childNodes[zz].nodeType == 1 )
												hasChildren = true;
										}
										/* we'll check for br and img tags and add a forward slash before the close and have no end tag */
										if ( tagName == 'br' || tagName == 'img') {
											slash = ' /';
											container.endTag = false;
										}
										if ( !hasChildren ) {
											if ( tagName != 'img' && tagName != 'br') {
												endHTML = '<span class="htmlTag">&lt;/' + tagName + '&gt;</span>';
												container.endTag = false;
											}
										}
										startHTML += slash + '&gt;</span>' + htmlText + endHTML;
										htmlLine.obj = curObj;
										htmlLine.htmlCB = '<' + curObj.nodeName.toString().toLowerCase() + '>' + curObj.innerHTML + '<\/' + curObj.nodeName.toString().toLowerCase() + '>';
										htmlLine.innerHTMLCB = curObj.innerHTML;
										$(htmlLine)
											.addClass('htmlLine')
											.html(startHTML + '<br />')
											.mouseover(function() {
												$.jsFirebug.highlight('add', this.obj);
											})
											.mouseout(function() {
												$.jsFirebug.highlight('remove');
											})
											.click(function() {
												$.jsFirebug.findStyles(this.obj);
											})
											.showMenu({
												opacity	: 0.8,
												query	: '#htmlContext'
											});
										if ( container.endTag ) {
											if ( tagName != 'img' && tagName != 'br') {
												var htmlEndTag = jsfbWindow.document.createElement('span');
												$(htmlEndTag)
													.addClass('htmlTag')
													.html('&lt;/' + tagName + '&gt;');
												$(newContainer).append(htmlEndTag);
												newContainer.endTagObj = htmlEndTag;
												var expandSign = newContainer.insertBefore(jsfbWindow.document.createElement('span'), htmlLine);
												$(expandSign)
													.css('padding-left', '7px')
													.addClass('expandSign')
													.html('-')
													.click(function() {
														for ( var i=0; i<this.parentNode.childNodes.length; i++ ) {
															if ( this.parentNode.childNodes[i].nodeType == 1 ) {
																if ( this.parentNode.childNodes[i].tagName.toLowerCase() == 'div' ) {
																	$(this.parentNode.childNodes[i]).toggle();
																}
															}
														}
														if ( $(this).html() == '+' )
															$(this).html('-');
														else
															$(this).html('+');
													});
											}
										}
										if ( container.endTagObj != null )
											$(container.endTagObj).before(newContainer);
										else
											$(container).append(newContainer);
										this.loopDOM(curObj, newContainer);
									}
								}
								k++;
							}
						}
					},
					/* method: getScript() */
					getScript: function() {
						this.jsfb.clear('Script');
						var all = $('*', document);
						var out = '';
						for ( var i=0; i<all.length; i++ ) {
							if ( all[i].nodeType == 1 ) {
								var tagName = all[i].tagName.toLowerCase();
								if ( tagName == 'script' ) {
									if ( all[i].id != 'jsFirebugScript' ) {
										if ( $(all[i]).attr('src') ) {
											try {
												var self = this, a = all[i];
												$.get($(all[i]).attr('src'), function(data) {
													var headerSpan = jsfbWindow.document.createElement('span');
													$(headerSpan).html('<span class="headerSpan">' + $(a).attr('src') + '<\span><br /><br />');
													self.jsFW.append('Script', headerSpan);
													var dataSpan = document.createElement('span');
													$(dataSpan).html('<span id="scriptHTML' + i + '" class="textSpan"><pre>' + data + '</pre></span>');
													$(headerSpan).after(dataSpan);
												});
											} catch(e) {
												var headerSpan = jsfbWindow.document.createElement('span');
												$(headerSpan).html('<span class="headerSpan">' + $(all[i]).attr('src') + '<\span><br /><br />');
												this.jsfb.append('Script', headerSpan);
											}
										} else {
											var headerSpan = jsfbWindow.document.createElement('span');
											$(headerSpan).html('<span class="headerSpan">(inline script)<\span>');
											this.jsfb.append('Script', headerSpan);
										}
										var dataSpan = jsfbWindow.document.createElement('span');
										$(dataSpan).html('<span id="scriptHTML' + i + '" class="textSpan"><pre>' + $(all[i]).html() + '</pre></span>');
										this.jsfb.append('Script', dataSpan);
									}
								}
							}
						}
					},
					/* method: getInfo() */
					getInfo: function() {
						var markup = $('html', document).html();
						var bodymarkup = $('body', document).html();
						var nContent = bodymarkup.replace(/<(.|\n)+?>/g,"");
						var markupSize = bodymarkup.length;
						var contentSize = nContent.length;
						var titleContent = this.countTitleAndAlt();
						contentSize -= titleContent;
						var contentPercentage = Math.round( ( contentSize / bodymarkup.length ) * 100 );
						this.jsfb.clear('Info');
						this.h2 = jsfbWindow.document.createElement('h2');
						$(this.h2 )
							.addClass('infoSpan')
							.html('Code Weight Specifications');
						this.jsfb.append('Info', this.h2);
						this.span = jsfbWindow.document.createElement('span');
						$(this.span)
							.addClass('infoSpan')
							.html('Total Code Weight: <span class="infoNum">' + markup.length + '</span> bytes.<br />');
						this.jsfb.append('Info', this.span);
						this.span = jsfbWindow.document.createElement('span');
						$(this.span)
							.addClass('infoSpan')
							.html('Body Code Weight: <span class="infoNum">' + bodymarkup.length + '</span> bytes.<br />');
						this.jsfb.append('Info', this.span);
						this.span = jsfbWindow.document.createElement('span');
						$(this.span)
							.addClass('infoSpan')
							.html('Content Weight: <span class="infoNum">' + contentSize + '</span> bytes.<br />');
						this.jsfb.append('Info', this.span);
						this.span = jsfbWindow.document.createElement('span');
						$(this.span)
							.addClass('infoSpan')
							.html('Markup Percent: <span class="infoNum">' + (100 - contentPercentage) + '</span>%.<br />');
						this.jsfb.append('Info', this.span);
						this.span = jsfbWindow.document.createElement('span');
						$(this.span)
							.addClass('infoSpan')
							.html('Content Percent: <span class="infoNum">' + contentPercentage + '</span>%.<br />');
						this.jsfb.append('Info', this.span);
						this.h2 = jsfbWindow.document.createElement('h2');
						$(this.h2 )
							.addClass('infoSpan')
							.html('Approximate Download Times');
						this.jsfb.append('Info', this.h2 );
						var tt = this.renderTimeTable(this.calcTimes(markupSize * 8))
						this.span = jsfbWindow.document.createElement('span');
						$(this.span)
							.addClass('infoSpan')
							.html(tt);
						this.jsfb.append('Info', this.span);
					},
					/* method: renderTimeTable( timesArray ) */
					renderTimeTable: function( timesArray ) {
						mHTML = '<table width="400" cellspacing="0"><tr class="headerRow"><td>bps</td><td>0%</td><td>15%</td><td>20%</td><td>25%</td></tr>';
						for ( i=0; i<this.bps.length; i++ ) {
							trClass = i % 2 ? 'on' : 'off';
							mHTML += '<tr class="' + trClass + '"><td>' + this.bps[i] + '</td>';
							for ( j=0; j<timesArray.length; j++ )
								if ( timesArray[i][j] != null )
									mHTML += '<td>' + timesArray[i][j] + '</td>';
							mHTML += '</tr>';
						}
						mHTML += '</table>';
						return mHTML;
					},
					/* method: calcTimes( byteSize) */
					calcTimes: function( byteSize ) {
						times = new Array();
						for ( i=0; i<this.bps.length; i++ ) {
							times[i] = new Array();
							for ( j=0; j<this.loss.length; j++ )
								times[i][j] = this.formatTime( Math.round( (byteSize / this.bps[i]) * this.loss[j] ) );
						}
						return times;
					},
					/* method: countTitleAndAlt() */
					countTitleAndAlt: function() {
						altByteSize = 0;
						allObj = $('*');
						for ( i=0; i<allObj.length; i++ ) {
							nTitle = allObj[i].title;
							nAlt = allObj[i].alt;
							if ( nTitle )
								altByteSize += nTitle.length;
							if ( nAlt )
								altByteSize += nAlt.length;
						}
						return altByteSize;
					},
					/* method: formatTime( time ) */
					formatTime: function( time ) {
						if ( time <= 59 ) {
							if ( time < 10 )
								return '00:0' + time;
							else
								return '00:' + time;
						} else {
							time /= 60;
							time = time.toFixed(2);
							returnHTML = '';
							time = time.toString();
							time = time.split('.');
							m = parseInt(time[0]);
							s = parseInt(time[1]);
							if ( m < 10 )
								returnHTML += '0' + m + ':';
							else
								returnHTML += m + ':';
							if ( s < 10 )
								returnHTML += '0' + s;
							else
								returnHTML += s;
							return returnHTML;
						}
					},
					/* method: getCSS() */
					getCSS: function() {
						this.jsfb.clear('CSS');
						this.strReturn = '';
						var ssOutputWrap = jsfbWindow.document.createElement('div');
						$(ssOutputWrap).attr('id', 'ssOutputWrap');
						for ( var i=0; i<this.ruleSet.length; i++ ) {
							if ( this.ruleSet[i] == undefined || this.ruleSet[i].href.indexOf(jsFBCss) != -1 )
								continue;
							if ( this.ruleSet[i].rule ) {
								this.cssFileName = '';
								var isIndexOf = this.ruleSet[i].href.lastIndexOf('/');
								if ( isIndexOf != -1 )
									this.cssFileName = this.ruleSet[i].href.substring(isIndexOf + 1, this.ruleSet[i].href.length);
								else
									this.cssFileName = this.ruleSet[i].href;
								this.strReturn += '<a class="cssHrefConatiner" href="' + this.ruleSet[i].href + '" target="_blank">' + this.cssFileName + '</a><br />';
								for ( var j=0; j<this.ruleSet[i].rule.length; j++ ) {
									if ( !this.ruleSet[i].rule[j].selectorText || this.ruleSet[i].rule[j].selectorText.toLowerCase() == 'unknown' || this.ruleSet[i].rule[j].style.cssText == '' )
										continue;
									this.strReturn += this.ruleSet[i].rule[j].selectorText.toLowerCase() + ' {<br />';
									var tmp = this.ruleSet[i].rule[j].style.cssText.split(';');
									for ( var k=0; k<tmp.length - 1; k++ ) {
										if ( tmp[k] == '' )
											continue;
										var tmp2 = tmp[k].split(':');
										this.strReturn += '<span style="color: #00F; padding-left: 20px;">' + tmp2[0].toLowerCase() + ': ' + tmp2[1] + ';</span>';
									}
									this.strReturn += '}<br /><br />';
								}
							}
						}
						ssOutputWrap.innerHTML = this.strReturn;
						this.jsfb.append('CSS', ssOutputWrap);
					},
					/* method: getLineNumber( pSelectorText ) */
					getLineNumber: function( pSelectorText ) {
						for ( var i=0; i<this.styleSheets.length; i++ ) {
							try {
								var rules = this.styleSheets[i].cssRules ? this.styleSheets[i].cssRules : this.styleSheets[i].rules;
								for ( var j=0; j<rules.length; j++ ) {
									var rule = rules[j];
									if ( rule ) {
										for ( var k=0; k<this.rule.length; k++ ) {
											if ( !this.rule[k].selectorText )
												continue;
											if ( this.rule[k].selectorText.toLowerCase() == 'unknown' )
												continue;
											if ( rules[k].selectorText == pSelectorText )
												return k + 1;
										}
									}
								}
							} catch(e) {}
						}
						return '';
					},
					/* method: createRule( selectorText, cssText, url ) */
					createRule: function( selectorText, cssText, url ) {
						var allCssText = cssText.replace(/^\s+/g, '').replace(/\s+$/g, '').split(';');
						var cssRuleWrap = jsfbWindow.document.createElement('div');
						$(cssRuleWrap)
							.attr('id', 'css_ruleWrap' + this.dInc)
							.addClass('css_ruleWrap');
						this.dInc++;
						var cssFileName = '';
						if ( url.lastIndexOf('/') != -1 )
							cssFileName = url.substring(url.lastIndexOf('/') + 1, url.length);
						else
							cssFileName = url;
						var cssHrefWrap = jsfbWindow.document.createElement('a');
						$(cssHrefWrap)
							.addClass('cssHrefConatiner')
							.attr('href', url)
							.attr('target', '_blank')
							.html(cssFileName + '<br />');
						$(cssRuleWrap).append(cssHrefWrap);
						var selectorTextWrap = jsfbWindow.document.createElement('span');
						$(selectorTextWrap)
							.attr('id', 'cssSelectorTextContainer')
							.html(selectorText + ' {<br />');
						$(cssRuleWrap).append(selectorTextWrap);
						for ( var i=0; i<allCssText.length; i++ ) {
							if ( allCssText[i] != '' ) {
								var strike_through = '';
								var isApplied = $.jsFirebug.isApplied(allCssText[i]);
								if ( allCssText[i].indexOf('rgb(') != -1 ) {
									allCssText[i] = allCssText[i].replace('rgb(', '').replace(')', '');
									var tmp = allCssText[i].split(':')[1].split(',');
									var r = parseInt(tmp[0]).toString(16).toUpperCase();
									var g = parseInt(tmp[1]).toString(16).toUpperCase();
									var b = parseInt(tmp[2]).toString(16).toUpperCase();
									if ( r.length == 1 )
										r = 0 + r;
									if ( g.length == 1 )
										g = 0 + g;
									if ( b.length == 1 )
										b = 0 + b;
									var newRGB = '#' + r + g + b;
									allCssText[i] = allCssText[i].split(':')[0] + ': ' + newRGB;
								}
								if ( !isApplied ) {
									strike_through = 'line-through';
									if ( allCssText[i].indexOf('rgb(') != -1 ) {
										allCssText[i] = allCssText[i].replace('rgb(', '').replace(')', '');
										var tmp = allCssText[i].split(':')[1].split(',');
										var r = parseInt(tmp[0]).toString(16).toUpperCase();
										var g = parseInt(tmp[1]).toString(16).toUpperCase();
										var b = parseInt(tmp[2]).toString(16).toUpperCase();
										if ( r.length == 1 )
											r = 0 + r;
										if ( g.length == 1 )
											g = 0 + g;
										if ( b.length == 1 )
											b = 0 + b;
										var newRGB = '#' + r + g + b;
										allCssText[i] = allCssText[i].split(':')[0] + ': ' + newRGB;
									}
								} else {
									if ( allCssText[i].indexOf('url(') != -1 ) {
										var img = allCssText[i].substring(allCssText[i].indexOf('url(') + 4, allCssText[i].indexOf(')', allCssText[i].indexOf('url(')));
										if ( document.all )
											img = img.replace(/"/g, '');
									}
								}
								var cssTextProp = allCssText[i].split(':')[0];
								var cssTextVal = allCssText[i].split(':')[1];
								var mpWidth = 6 * cssTextProp.length;
								var mvWidth = 6 *  cssTextVal.length;
								$.jsFirebug.createPropertyValueSet(cssRuleWrap, this, false, mpWidth, cssTextProp, cssTextProp, mvWidth, cssTextVal, strike_through, cssTextProp, img, this.objToCheck);
							}
						}
						this.jsfb.append('Style', jsfbWindow.document.createElement('br'));
						this.jsfb.append('Style', cssRuleWrap);
						var cssRuleWrapEnd = jsfbWindow.document.createElement('div')
						$(cssRuleWrapEnd)
							.addClass('css_ruleWrap')
							.html('}<br />');
						this.jsfb.append('Style', cssRuleWrapEnd);
					},
					/* method: isApplied( cssText) */
					isApplied: function( cssText ) {
						var styleToCheck = valueToCheck = '';
						styleToCheck = cssText.replace(/^\s+/g, '').replace(/\s+$/g, '').split(':')[0];
						valueToCheck = cssText.replace(/^\s+/g, '').replace(/\s+$/g, '').split(':')[1];
						if ( document.all ) {
							if ( styleToCheck.indexOf('-') != -1 ) {
								var pos = styleToCheck.indexOf('-');
								styleToCheck = styleToCheck.replace('-', '');
								styleToCheck = styleToCheck.substring(0, pos).toLowerCase() + styleToCheck.substring(pos, pos + 1).toUpperCase() + styleToCheck.substring(pos + 1, styleToCheck.length).toLowerCase();
							}
						}
						if ( styleToCheck == 'padding' || styleToCheck == 'margin' ) {
							var tmp = valueToCheck.split(' ');
							var tmpC = '';
							for ( var i=0; i<4; i++ ) {
								var tmpStyleToCheck = '';
								switch ( i ) {
									case 0: {
										tmpStyleToCheck = document.all ? styleToCheck + 'Top' : styleToCheck + '-top';
										break;
									}
									case 1: {
										tmpStyleToCheck = document.all ? styleToCheck + 'Right' : styleToCheck + '-right';
										break;
									}
									case 2: {
										tmpStyleToCheck = document.all ? styleToCheck + 'Bottom' : styleToCheck + '-bottom';
										break;
									}
									case 3: {
										tmpStyleToCheck = document.all ? styleToCheck + 'Left' : styleToCheck + '-left';
										break;
									}
								}
								var bStyle = $(this.objToCheck).css(tmpStyleToCheck);
								tmpC += bStyle + ' ';
							}
							if ( tmpC.replace(/\s/g, '').indexOf(valueToCheck.replace(/\s/g, '')) != -1 )
								return true;
						}
						if ( styleToCheck == 'background' ) {
							var tmp = valueToCheck.split(' ');
							var tmpC = '';
							for ( var i=0; i<6; i++ ) {
								var tmpStyleToCheck = '';
								switch ( i ) {
									case 0: {
										tmpStyleToCheck = document.all ? styleToCheck + 'Color' : styleToCheck + '-color';
										break;
									}
									case 1: {
										tmpStyleToCheck = document.all ? styleToCheck + 'Image' : styleToCheck + '-image';
										break;
									}
									case 2: {
										tmpStyleToCheck = document.all ? styleToCheck + 'Attachment' : styleToCheck + '-attachment';
										break;
									}
									case 3: {
										tmpStyleToCheck = document.all ? styleToCheck + 'PositionX' : styleToCheck + '-position-x';
										break;
									}
									case 4: {
										tmpStyleToCheck = document.all ? styleToCheck + 'PositionY' : styleToCheck + '-position-y';
										break;
									}
									case 5: {
										tmpStyleToCheck = document.all ? styleToCheck + 'Repeat' : styleToCheck + '-repeat';
										break;
									}
								}
								var bStyle = jQuery(this.objToCheck).css(tmpStyleToCheck);
								tmpC += bStyle + ' ';
							}
							var allBackgrounds = valueToCheck.split(' ');
							for ( var i=1; i<allBackgrounds.length; i++ ) {
								if ( allBackgrounds[i].indexOf('url') != -1 ) {
									var url = allBackgrounds[i].substring(4, allBackgrounds[i].length - 1);
									if ( tmpC.indexOf(url) )
										return true;
								}
							}
							if ( tmpC.replace(/\s/g, '').indexOf(valueToCheck.replace(/\s/g, '')) != -1 )
								return true;
						}
						var bStyle = ' ' + $(this.objToCheck).css(styleToCheck);
						if ( bStyle == valueToCheck )
							return true;
						else
							return false;
					},
					/* method: createPropertyValueSet( jsFWHtmlWrap, obj, isNew, propW, propVal, propOldVal, valW, valVal, strike, propToChange, image, objToCheck ) */
					createPropertyValueSet: function( jsFWHtmlWrap, obj, isNew, propW, propVal, propOldVal, valW, valVal, strike, propToChange, image, objToCheck ) {
						/* create an ID */
						var mID = 'rule' + this.newPropInc;
						/* create the containing span */
						var span = jsfbWindow.document.createElement('span');
						span.self = this;
						$(span)
							.attr('id', mID)
							.addClass('oCssTextSpan');
						$(jsFWHtmlWrap).append(span);
							var disable = jsfbWindow.document.createElement('div');
							disable.self = this;
							disable.rule = span;
							disable.on = false;
							disable.holdValue = '';
							disable.objToCheck = objToCheck;
							$(disable)
								.attr('id', 'disableRule' + this.newPropInc)
								.addClass('disabled')
								.mouseover(function( event ) {
									$.jsFirebug.disable(event, this);
								})
								.mouseout(function( event ) {
									$.jsFirebug.disable(event, this);
								}).click(function( event ) {
									$.jsFirebug.disable(event, this);
								});
							$(span).append(disable);
							// create the property textbox
							var txtProp = jsfbWindow.document.createElement('input');
							txtProp.parentID = mID;
							txtProp.parentWrapID = jsFWHtmlWrap.id;
							txtProp.currentObj = obj.currentObj;
							txtProp.selector_text = obj.selector_text;
							$(txtProp)
								.attr('type', 'text')
								.addClass('oProperty');
							if ( propW != '' ) {
								if ( propW > 150 )
									$(txtProp).css('width', '150px');
								else
									$(txtProp).css('width', propW + 'px');
							} else
								$(txtProp).css('width', '75px');
							if (propVal != '')
								$(txtProp).attr('value', propVal.replace(/^\s+/g, ''));
							else
								$(txtProp).attr('value', '');
							$(txtProp)
								.css('text-decoration', strike)
								.focus(function() {
									$(this).css('border', '1px solid #FFF');
								}).blur(function() {
									$.jsFirebug.checkProperty(this);
								}).keyup(function(event) {
									$.jsFirebug.changeRuleProp(this, event);
								})
							if ( propOldVal != '' )
								txtProp._oldValue = propOldVal.replace(/^\s+/g, '');
							else
								txtProp._oldValue = '';
							$(span)
								.append(txtProp)
								.append(jsfbWindow.document.createTextNode(' : '));
							/* create the value textbox */
							var txtVal = jsfbWindow.document.createElement('input');
							txtVal.currentObj = obj.currentObj;
							txtVal.selector_text = obj.selector_text;
							txtVal.parentID = mID;
							txtVal.parentWrapID = jsFWHtmlWrap.id;
							txtVal.sibling = txtProp;
							txtVal.objToCheck = objToCheck;
							txtVal.img = image;
							$(txtVal)
								.attr('type', 'text')
								.css('text-decoration', strike);
							if ( valW != '' ) {
								if ( valW > 250 )
									$(txtVal).css('width', '250px');
								else
									$(txtVal).css('width', valW + 'px');
							} else
								$(txtVal).css('width', '75px');
							if ( valVal != '' )
								$(txtVal).attr('value', valVal.substring(1, valVal.length));
							else
								$(txtVal).attr('value', 'undefined');
							if ( valVal.indexOf('#') != -1 )
								txtVal.previewObj = 'color';
							if ( valVal.indexOf('url(') != -1 )
								txtVal.previewObj = 'image';
							$(txtVal)
								.css('cursor', 'pointer')
								.mouseover(function( event ) {
									$.jsFirebug.previewPopup(this, 'create', event);
								})
								.mouseout(function( event ) {
									$.jsFirebug.previewPopup(this, 'remove', event);
								})
								.blur(function() {
									$.jsFirebug.checkValue(this);
									$.jsFirebug.changeProperty(this);
								})
								.keyup(function( event ) {
									$.jsFirebug.checkKeys(this, event);
								});
							if (propToChange != '')
								txtVal._propertyToChange = propToChange;
							else
								txtVal._propertyToChange = '';
							$(span).append(txtVal);
							/* attach the property and value textboxes to the containing span */
							var br = jsfbWindow.document.createElement('br');
							$(br).css('clear', 'left');
							$(span).append(br);
						txtProp.sibling = txtVal;
						txtProp._value = txtVal.value;
						if (isNew)
							$(txtProp).css('border', '1px solid #FFF').focus();
						disable.prop = txtProp;
						disable._value = txtVal;
						this.newPropInc++;
					},
					/* method: checkKeys( obj, e ) */
					checkKeys: function( obj, e ) {
						var keyID = jsfbWindow.document.all ? jsfbWindow.event.keyCode : e.keyCode;
						var prop = obj.sibling.value.replace(/\s/g, '');
						if ( prop.indexOf('-') != -1 ) {
							var pos = prop.indexOf('-');
							prop = prop.substring(0, pos) + prop.substring(pos + 1, pos + 2).toUpperCase() + prop.substring(pos + 2, prop.length);
						}
						switch (keyID) {
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
									if (this.ffInc < 0)
										this.ffInc = this.fontFamilies.length - 1;
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
									if (this.ffInc >= this.fontFamilies.length)
										this.ffInc = 0;
									obj.value = this.fontFamilies[this.ffInc];
									eval( 'obj.currentObj.style.' + prop + ' = \'' + obj.value + '\';' );
									this.ffInc++;
								}
								break;
							}
							case 13: {
								if ( obj.currentObj ) {
									if ( obj.value != '' )
										eval( 'obj.currentObj.style.' + prop + ' = \'' + obj.value + '\';' );
									obj.style.border = 'none';
								}
								if ( obj.style.border.indexOf('none') != -1 || obj.style.border == '' ) {
									var wrap = jsfbWindow.document.getElementById(obj.parentWrapID);
									if ( wrap.lastChild.id == obj.parentID )
										$.jsFirebug.createPropertyValueSet(wrap, obj, true, '', '', '', '', '', '', '', '', obj.objToCheck);
								}
								break;
							}
						}
						$(obj).css('width', 8 *  obj.value.length + 'px');
					},
					changeProperty: function( obj ) {
						if ( obj.currentObj ) {
							if ( obj.value != '' )
								eval( 'obj.currentObj.style.' + obj.sibling.value + ' = \'' + obj.value + '\';' );
							obj.style.border = 'none';
						}
					},
					/* method: checkProperty( obj ) */
					checkProperty: function( obj ) {
						obj.style.border = 'none';
						if ( obj.value == '' ) {
							if ( this.ruleSet ) {
								for ( var h=0; h<this.ruleSet.length; h++ ) {
									if ( this.ruleSet[h] == undefined ) {
										continue;
									}
									if ( this.ruleSet[h].href.indexOf(jsFBCss) != -1 ) {
										continue;
									}
									if ( this.ruleSet[h].rule ) {
										for ( var j=0; j<this.ruleSet[h].rule.length; j++ ) {
											if ( !this.ruleSet[h].rule[j].selectorText || this.ruleSet[h].rule[j].selectorText.toLowerCase() == 'unknown' ) {
												continue;
											}
											var selector_text = this.ruleSet[h].rule[j].selectorText;
											if ( selector_text == obj.selector_text ) {
												var strNew = '';
												var rule = this.ruleSet[h].rule[j].style.cssText.split(';');
												for ( var k=0; k<rule.length; k++ ) {
													if ( rule[k].split(':')[0].replace(/\s/g, '').toLowerCase() != obj._oldValue ) {
														if ( rule[k].split(':')[0] != '' ) {
															strNew += rule[k].split(':')[0] + ':' + rule[k].split(':')[1] + ';';
														}
													}
												}
												this.ruleSet[h].rule[j].style.cssText = strNew;
												$('#' + obj.parentID).remove();
											}
										}
									}
								}
							}
						}
					},
					/*
						method: checkValue( obj )
							this method attemps to go through all css files and
							match the rule/[property/value]	set against what the
							user is currently manipulating in the inspector window.
							If there's a mtch, it modifies that rule set, otherwise
							it creates a new ruleset.
					*/
					checkValue: function( obj ) {
						if ( obj.value != '' ) {
							var prop = obj.sibling.value.replace(/\s/g, '');
							if ( prop.indexOf('-') != -1 ) {
								var pos = prop.indexOf('-');
								prop = prop.substring(0, pos) + prop.substring(pos + 1, pos + 2).toUpperCase() + prop.substring(pos + 2, prop.length);
							}
							obj.style.border = 'none';
							if ( this.ruleSet ) {
								for ( var h=0; h<this.ruleSet.length; h++ ) {
									if ( this.ruleSet[h] == undefined || this.ruleSet[h].href.indexOf(jsFBCss) != -1 )
										continue;
									if ( this.ruleSet[h].rule ) {
										for ( var i=0; i<this.ruleSet[h].rule.length; i++ ) {
											if ( !this.ruleSet[h].rule[i].selectorText || this.ruleSet[h].rule[i].selectorText.toLowerCase() == 'unknown' )
												continue;
											var selector_text = this.ruleSet[h].rule[i].selectorText;
											if ( selector_text == obj.selector_text )
												eval( 'this.ruleSet[h].rule[i].style.' + prop + ' = \'' + obj.value + '\';' );
										}
									}
								}
							}
						}
					},
					/* method: selectRange( textbox, start, len ) */
					selectRange: function( textbox, start, len ) {
						if (textbox.createTextRange) {
							var oRange = textbox.createTextRange();
							oRange.moveStart('character', start);
							oRange.moveEnd('character', len - textbox.value.length);
							oRange.select();
						} else if (textbox.setSelectionRange)
							textbox.setSelectionRange(start, len);
						textbox.focus();
					},
					/* method: typeAhead( textbox, str ) */
					typeAhead: function( textbox, str ) {
						if (textbox.createTextRange || textbox.setSelectionRange) {
							var iLen = textbox.value.length;
							textbox.value = str;
							this.selectRange(textbox, iLen, str.length);
						}
					},
					/* method: changeRuleProp( obj, e ) */
					changeRuleProp: function( obj, e ) {
						var keyID = jsfbWindow.document.all ? jsfbWindow.event.keyCode : e.keyCode;
						var aryProps = jQuery.jsFirebug.propAF;
						switch ( keyID ) {
							/* up arrow */
							case 38: {
								for ( var i=0; i<aryProps.length; i++ ) {
									if ( obj.value == aryProps[i] ) {
										if ( i == 0 )
											i = aryProps.length;
										obj.value = aryProps[i - 1];
										break;
									}
								}
								break;
							}
							/* down arrow */
							case 40: {
								for ( var i=0; i<aryProps.length; i++ ) {
									if ( obj.value == aryProps[i] ) {
										if ( i >= aryProps.length - 1 )
											i = -1;
										obj.value = aryProps[i + 1];
										break;
									}
								}
								break;
							}
							default: {
								if ( obj.value.length > 0 ) {
									for ( var i=0; i<aryProps.length; i++ ) {
										if ( aryProps[i].substring(0, obj.value.length).indexOf(obj.value) != -1 ) {
											$.jsFirebug.typeAhead(obj, aryProps[i]);
											break;
										}
									}
								}
								break;
							}
						}
						$(obj).css('width', 6 * obj.value.length + 'px');
					},
					/* method: highlight( action, obj ) */
					highlight: function( action, obj ) {
						switch ( action ) {
							case 'add': {
								var zi = $.jsFirebug.getHighestZIndex() + 1;
								if ( zi <= 0 )
									zi = 10;
								$(this.highlightWrap).css({
									display	: 'block',
									width	: obj.offsetWidth + 'px',
									height	: obj.offsetHeight + 'px',
									zIndex	: zi
								});
								$.jsFirebug.positionObjectToElement(obj, this.highlightWrap, 0, 0);
								break;
							}
							case 'remove': {
								$(this.highlightWrap).css('display', 'none');
								break;
							}
						}
					},
					/* method: disable( event, obj ) */
					disable: function( event, obj ) {
						switch ( event.type ) {
							case 'mouseover': {
								if ( !obj.on ) {
									$(obj).removeClass('disabled');
									$(obj).addClass('disabledShow');
								}
								break;
							}
							case 'mouseout': {
								if ( !obj.on ) {
									$(obj).removeClass('disabledShow');
									$(obj).addClass('disabled');
								}
								break;
							}
							case 'click': {
								if ( !obj.on ) 	{
									obj.on = true;
									obj.className = 'disabledOn';
									obj.holdValue = obj._value.value;
									switch (obj.prop.value) {
										case 'background': {
											eval("obj.prop.currentObj.style.backgroundAttachment = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'background-attachment') + "';");
											eval("obj.prop.currentObj.style.backgroundColor = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'background-color') + "';");
											eval("obj.prop.currentObj.style.backgroundImage = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'background-image') + "';");
											eval("obj.prop.currentObj.style.backgroundPosition = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'background-position') + "';");
											eval("obj.prop.currentObj.style.backgroundRepeat = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'background-repeat') + "';");
											break;
										}
										case 'border': {
											eval("obj.prop.currentObj.style.borderBottomColor = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-bottom-color') + "';");
											eval("obj.prop.currentObj.style.borderBottomStyle = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-bottom-style') + "';");
											eval("obj.prop.currentObj.style.borderBottomWidth = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-bottom-width') + "';");
											eval("obj.prop.currentObj.style.borderCollapse = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-collapse') + "';");
											eval("obj.prop.currentObj.style.borderLeftColor = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-left-color') + "';");
											eval("obj.prop.currentObj.style.borderLeftStyle = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-left-style') + "';");
											eval("obj.prop.currentObj.style.borderLeftWidth = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-left-width') + "';");
											eval("obj.prop.currentObj.style.borderRightColor = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-right-color') + "';");
											eval("obj.prop.currentObj.style.borderRightStyle = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-right-style') + "';");
											eval("obj.prop.currentObj.style.borderRightWidth = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-right-width') + "';");
											eval("obj.prop.currentObj.style.borderSpacing = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-spacing') + "';");
											eval("obj.prop.currentObj.style.borderTopColor = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-top-color') + "';");
											eval("obj.prop.currentObj.style.borderTopStyle = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-top-style') + "';");
											eval("obj.prop.currentObj.style.borderTopWidth = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-top-width') + "';");
											break;
										}
										case 'border-bottom': {
											eval("obj.prop.currentObj.style.borderBottomColor = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-bottom-color') + "';");
											eval("obj.prop.currentObj.style.borderBottomStyle = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-bottom-style') + "';");
											eval("obj.prop.currentObj.style.borderBottomWidth = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-bottom-width') + "';");
											break;
										}
										case 'border-color': {
											eval("obj.prop.currentObj.style.borderBottomColor = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-bottom-color') + "';");
											eval("obj.prop.currentObj.style.borderLeftColor = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-left-color') + "';");
											eval("obj.prop.currentObj.style.borderRightColor = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-right-color') + "';");
											eval("obj.prop.currentObj.style.borderTopColor = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-top-color') + "';");
											break;
										}
										case 'border-left': {
											eval("obj.prop.currentObj.style.borderLeftColor = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-left-color') + "';");
											eval("obj.prop.currentObj.style.borderLeftStyle = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-left-style') + "';");
											eval("obj.prop.currentObj.style.borderLeftWidth = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-left-width') + "';");
											break;
										}
										case 'border-right': {
											eval("obj.prop.currentObj.style.borderRightColor = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-right-color') + "';");
											eval("obj.prop.currentObj.style.borderRightStyle = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-right-style') + "';");
											eval("obj.prop.currentObj.style.borderRightWidth = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-right-width') + "';");
											break;
										}
										case 'border-style': {
											eval("obj.prop.currentObj.style.borderBottomStyle = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-bottom-style') + "';");
											eval("obj.prop.currentObj.style.borderLeftStyle = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-left-style') + "';");
											eval("obj.prop.currentObj.style.borderRightStyle = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-right-style') + "';");
											eval("obj.prop.currentObj.style.borderTopStyle = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-top-style') + "';");
											break;
										}
										case 'border-top': {
											eval("obj.prop.currentObj.style.borderTopColor = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-top-color') + "';");
											eval("obj.prop.currentObj.style.borderTopStyle = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-top-style') + "';");
											eval("obj.prop.currentObj.style.borderTopWidth = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-top-width') + "';");
											break;
										}
										case 'border-width': {
											eval("obj.prop.currentObj.style.borderBottomWidth = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-bottom-width') + "';");
											eval("obj.prop.currentObj.style.borderLeftWidth = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-left-width') + "';");
											eval("obj.prop.currentObj.style.borderRightWidth = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-right-width') + "';");
											eval("obj.prop.currentObj.style.borderTopWidth = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'border-top-width') + "';");
											break;
										}
										case 'list-style': {
											eval("obj.prop.currentObj.style.listStyleImage = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'list-style-image') + "';");
											eval("obj.prop.currentObj.style.listStylePosition = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'list-style-position') + "';");
											eval("obj.prop.currentObj.style.listStyleType = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'list-style-type') + "';");
											break;
										}
										case 'font': {
											eval("obj.prop.currentObj.style.fontFamily = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'font-family') + "';");
											eval("obj.prop.currentObj.style.fontSize = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'font-size') + "';");
											eval("obj.prop.currentObj.style.fontSizeAdjust = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'font-size-adjust') + "';");
											eval("obj.prop.currentObj.style.fontStretch = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'font-stretch') + "';");
											eval("obj.prop.currentObj.style.fontStyle = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'font-style') + "';");
											eval("obj.prop.currentObj.style.fontVariant = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'font-variant') + "';");
											eval("obj.prop.currentObj.style.fontWeight = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, 'font-weight') + "';");
											break;
										}
										default:
											eval("obj.prop.currentObj.style." + $.jsFirebug.convertCssProp(obj.prop.value) + " = '" + $.jsFirebug.getDefaults(obj.prop.currentObj, obj.prop.value) + "';");
											break;
									}
									obj.prop.disabled = true;
									obj.prop.className = 'oPropertyDisabled';
									obj._value.disabled = true;
									obj._value.className = 'oValueDisabled';
								} else {
									obj.on = false;
									obj.className = 'disabled';
									eval("obj.prop.currentObj.style." + $.jsFirebug.convertCssProp(obj.prop.value) + " = '" + obj.holdValue + "';");
									obj.prop.disabled = false;
									obj.prop.className = 'oProperty';
									obj._value.disabled = false;
									obj._value.className = 'oValue';
								}
								break;
							}
						}
					},
					/* method: getDefaults( obj, val ) */
					getDefaults: function( obj, val ) {
						var ret = bStyle = '';
						while ( obj = obj.parentNode ) {
							if ( obj.nodeName.toLowerCase() == 'body' )
								break;
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
						var defaultCss = [];
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
						if ( ret == undefined )
							ret = defaultCss[val];
						return ret;
					},
					/* method: convertCssProp( str ) */
					convertCssProp: function( str ) {
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
					/* method: previewPopup( obj, action, e ) */
					previewPopup: function( obj, action, e ) {
						switch ( action ) {
							case 'create': {
								var posx = posy = 0;
								if ( !e ) {
									var e = window.event;
								}
								if ( e.pageX || e.pageY ) {
									posx = e.pageX;
									posy = e.pageY;
								} else if ( e.clientX || e.clientY ) {
									posx = e.clientX + document.body.scrollLeft	+ document.documentElement.scrollLeft;
									posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
								}
								switch ( obj.previewObj ) {
									case 'color': {
										$('#colorPreview', jsfbWindow.document.body)
											.css({
												background	: obj.value,
												left	: posx + 'px',
												top		: (posy + 20) + 'px',
												display	: 'block'
											});
										break;
									}
									case 'image': {
										var img = document.createElement('img');
										$(img).attr('src', obj.img);
										var ow = img.width;
										var oh = img.height;
										if ( img.width > 100 ) {
											var ratio = parseFloat(img.width / 100);
											$(img)
												.attr({
													width	: '100',
													height	: img.height / ratio
												});
											w = 100;
											h = img.height / ratio;
										}
										$('#imagePreview', jsfbWindow.document.body)
											.css({
												display		: 'block',
												background	: '#FFF',
												width		: 'auto',
												height		: 'auto',
												left	: posx + 'px',
												top		: (posy + 20) + 'px'
											})
											.html('<p>' + ow + ' x ' + oh + '</p>')
											.prepend(img);
										break;
									}
								}
								break;
							}
							case 'remove': {
								$('#colorPreview, #imagePreview', jsfbWindow.document.body)
									.css('display', 'none')
									.html('');
								break;
							}
						}
					},
					/* method: positionObjectToElement( obj, element, offX, offY ) */
					positionObjectToElement: function( obj, element, offX, offY ) {
						var coords = this.findPos(obj);
						element.style.left = coords[0] + offX + 'px';
						element.style.top = coords[1] + offY + 'px';
					},
					/* method: findPos( obj ) */
					findPos: function( obj ) {
						var cLeft = cTop = 0;
						if ( obj.offsetParent ) {
							cLeft = obj.offsetLeft;
							cTop = obj.offsetTop;
							while ( obj = obj.offsetParent ) {
								cLeft += obj.offsetLeft;
								cTop += obj.offsetTop;
							}
						}
						return [cLeft, cTop];
					},
					/* function compareNums(a, b) : Compares two numbers and returns the greater one */
					compareNums: function(a, b) {
						return a - b;
					},
					/*
						function getHighestZIndex() - Returns the element on the page with the highest z-index
						Return Type: (int)
						Usage:
							var highZIndex = $.jsFirebug.getHighestZIndex();
							document.getElementById('myID').style.zIndex = $.jsFirebug.getHighestZindex() + 1;
					*/
					getHighestZIndex: function() {
						var allElements = document.getElementsByTagName('*');
						var mZindices = new Array();
						mZindices[0] = 0;
						for (var i=0; i<allElements.length; i++) {
							if (allElements[i].nodeType == 1) {
								if (document.all) { if (allElements[i].currentStyle) { mZIndex = allElements[i].currentStyle['zIndex']; if (!isNaN(mZIndex)) { mZindices.push(mZIndex); } } else if (window.getComputedStyle) { mZIndex = document.defaultView.getComputedStyle(allElements[i], null).getPropertyValue('zIndex'); if (!isNaN(mZIndex)) { mZindices.push(mZIndex); } }
								} else { if (allElements[i].currentStyle) { mZIndex = allElements[i].currentStyle['z-index']; if (!isNaN(mZIndex)) { mZindices.push(mZIndex); } } else if (window.getComputedStyle) { mZIndex = document.defaultView.getComputedStyle(allElements[i], null).getPropertyValue('z-index'); if (!isNaN(mZIndex)) { mZindices.push(mZIndex); } } }
							}
						}
						mZindices = mZindices.sort(jQuery.jsFirebug.compareNums);
						var highest = parseInt(mZindices[mZindices.length - 1]);
						if ( highest == 0 )
							highest = 100;
						return highest;
					},
					copy: function( copyObj ) {
						eval("$.copy($('#htmlContext', jsfbWindow.document).get(0).obj." + copyObj + ");");
					}
				}
			});
			/* Object: jsFirebugWindow() */
			$.jsFirebugWindow = function() {
				this.init();
			};
			$.extend($.jsFirebugWindow, {
				prototype: {
					init: function() {
						this.title = 'JS Firebug v 1.1.2 ';
						this.windows = [];
						this.curScreen = null;
						var css = jsfbWindow.document.createElement('link');
						css.id = "cssReaderCss";
						css.rel = "stylesheet";
						css.href = 'http://10.69.68.20/CDEObjects/js_firebug/js_firebug.css';
						css.type = "text/css";
						$(jsfbWindow.document.body).append(css);
						this.jsfb = jsfbWindow.document.createElement('div');
						$(this.jsfb).attr('id', 'jsfWrap');
						$(jsfbWindow.document.body).append(this.jsfb);

						/* create a "loading... please wait" screen */
						var pw = jsfbWindow.document.createElement('div');
						$(pw)
							.attr('id', 'pleaseWait')
							.html('<p class="appTitle">jsFirebug 2.0</p>loading... please wait');
						$(this.jsfb).append(pw);
							
							/* create the menu wrap */
							this.jsfbMenuWrap = jsfbWindow.document.createElement('div');
							$(this.jsfbMenuWrap).attr('id', 'menuWrap');
							$(this.jsfb).append(this.jsfbMenuWrap);

						/* create btn/screen combinations */
						this.createScreen('Style', '#btnStyle', 'styleScreen');
						this.createScreen('CSS', '#btnCss', 'cssScreen');
						this.createScreen('HTML', '#btnHtml', 'htmlScreen');
						this.createScreen('Info', '#btnInfo', 'infoScreen');
						this.createScreen('Script', '#btnScript', 'scriptScreen');
						
						/* create the color preview wrap */
						var div = jsfbWindow.document.createElement('div');
						$(div).attr('id', 'colorPreview');
						$(this.jsfb).append(div);
						/* create the image preview wrap */
						var div = jsfbWindow.document.createElement('div');
						$(div).attr('id', 'imagePreview');
						$(this.jsfb).append(div);
						/* create the context menu for the HTML tab */
						/*
						<div id="htmlContext">
							<ul>
								<li><a id="btnHTMLCM_CopyHTML" href="javascript: void(0);">Copy HTML</a></li>
								<li><a id="btnHTMLCM_CopyInnerHTML" href="javascript: void(0);">Copy innerHTML</a></li>
								<li><a id="btnHTMLCM_NewAttribute" href="javascript: void(0);">New Attribute&hellip;</a></li>
								<li><a id="btnHTMLCM_EditHTML" href="javascript: void(0);">Edit HTML&hellip;</a></li>
								<li><a id="btnHTMLCM_DeleteElement" href="javascript: void(0);">Delete Element</a></li>
							</ul>
						</div>
						*/
						var div = jsfbWindow.document.createElement('div');
						$(div).attr('id', 'htmlContext');
						$(this.jsfb).append(div);
							var ul = jsfbWindow.document.createElement('ul');
							$(div).append(ul);
								var li = jsfbWindow.document.createElement('li');
								$(ul).append(li);
									var a = jsfbWindow.document.createElement('a');
									$(a)
										.attr('href', 'javascript: document.getElementById("htmlContext").style.display="none"; void(0);')
										.html('Copy HTML')
										.click(function() {
											$.jsFirebug.copy('htmlCB');
										});
									$(li).append(a);
									var a = jsfbWindow.document.createElement('a');
									$(a)
										.attr('href', 'javascript: document.getElementById("htmlContext").style.display="none"; void(0);')
										.html('Copy innerHTML')
										.click(function() {
											$.jsFirebug.copy('innerHTMLCB');
										});
									$(li).append(a);
						/* set the current output widow */
						this.curScreen = this.windows[0];
						this.adjustJSFB();
					},
					createScreen: function( name, btnId, screenId ) {
						/* BTN Style */
						var btn = jsfbWindow.document.createElement('span');
						$(btn)
							.addClass('menuBtn')
							.attr('id', btnId.substring(1, btnId.length))
							.html(name);
						$(this.jsfbMenuWrap).append(btn);
						$(btnId, jsfbWindow.document.body)
							.bind('mouseover mouseout', function() {
								$(this).toggleClass('menuBtnHi');
							})
							.click(function() {
								jsfbW.show(name);
							});
						var screen = jsfbWindow.document.createElement('div');
						$(screen).attr('id', screenId);
						$(this.jsfb).append(screen);
						screen.name = name;
						this.windows.push(screen);
					},
					show: function( scr ) {
						for ( var i=0; i<this.windows.length; i++ )
							$(this.windows[i]).hide();
						$(this.getWin(scr)).show();
					},
					changeTitle: function( str ) {
						//$(this.jsfbTitle).html(this.title + str);
					},
					getWin: function( scr ) {
						var win = null;
						$.each(this.windows, function(i) {
							if ( this.name == scr ) {
								win = this;
							}
						});
						this.curScreen = win;
						return win;
					},
					write: function(scr, str) {
						if ( !scr )
							return;
						$(this.getWin(scr))
							.html(str + '<br />')
							.get(0).scrollTop = $(this.getWin(scr)).get(0).scrollHeight;
					},
					writeEsc: function(scr, str) {
						if ( !scr )
							return;
						$(this.getWin(scr))
							.text(str).html('<br />')
							.get(0).scrollTop = $(this.getWin(scr)).get(0).scrollHeight;
					},
					append: function(scr, obj) {
						if ( !scr || !obj )
							return;
						$(this.getWin(scr)).append(obj);
					},
					clear: function(scr) {
						if (!scr)
							return;
						$(this.getWin(scr)).empty();
					},
					getChildSize: function() {
						var w = 0, h = 0;
						if ( typeof( jsfbWindow.innerWidth ) == 'number' ) {
							/* Non-IE */
							w = jsfbWindow.innerWidth;
							h = jsfbWindow.innerHeight;
						} else if ( jsfbWindow.document.documentElement && ( jsfbWindow.document.documentElement.clientWidth || jsfbWindow.document.documentElement.clientHeight ) ) {
							/* IE 6+ in 'standards compliant mode' */
							w = jsfbWindow.document.documentElement.clientWidth;
							h = jsfbWindow.document.documentElement.clientHeight;
						} else if ( jsfbWindow.document.body && ( jsfbWindow.document.body.clientWidth || jsfbWindow.document.body.clientHeight ) ) {
							/* IE 4 compatible */
							w = jsfbWindow.document.body.clientWidth;
							h = jsfbWindow.document.body.clientHeight - 18;
						}
						return [w, h];
					},
					adjustJSFB: function() {
						var w = this.getChildSize()[0];
						var h = this.getChildSize()[1];
						$('#jsfWrap', jsfbWindow.document.body).css({
							width	: w + 'px',
							height	: h + 'px'
						});
						$.each(this.windows, function() {
							$(this).css({
								width	: (w - 5) + 'px',
								height	: h + 'px'
							});
						});
					}
				}
			});
			$.each($('*', document), function() {
				if ( this.nodeName.toLowerCase() == 'a' )
					$(this).attr('href', 'javascript: void(0);');
				this.onclick = this.onmousedown = null;
			});
		/* startup */
		jsfbW = new $.jsFirebugWindow();
		$.jsFirebugWindow = jsfbW;
		$.data(document.body, 'jsFirebugWindow', jsfbW);
		$.jsFirebug = new $.jsFirebug();
	})(jQuery);
};
