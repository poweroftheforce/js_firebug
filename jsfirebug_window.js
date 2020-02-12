/*
	jsFirebug v 2.0.3
*/
console.log('domain2');
var jsFBDomain = 'http://localhost:8081/';
console.log(jsFBDomain + 'js_firebug.css');
//var jsFBDomain = 'http://common.scrippsnetworks.com/common/js/jsfirebug/';

/*
	we load up a blank popup window so everything
	in this application is created via javascript
	Even though the window is blank, it still seems
	to have html, body and probably a head tag.
*/

/* create and load the css for this app old school */
var jsfb_css = document.createElement('link');

jsfb_css.rel = 'stylesheet';
jsfb_css.type = 'text/css';
jsfb_css.href = jsFBDomain + 'js_firebug.css';

/* I wanna use jQuery!! */
var jquery_inc = document.createElement('script');

jquery_inc.type = 'text/javascript';
jquery_inc.id = 'jsFirebugScript';
jquery_inc.src = jsFBDomain + 'jquery.js';
jquery_inc.language = 'javascript';
document.getElementsByTagName('head')[0].appendChild(jsfb_css);
document.getElementsByTagName('head')[0].appendChild(jquery_inc);
/* onload for jQuery = jquery_ready(); */
jquery_inc.onload = jquery_ready;
jquery_inc.onreadystatechange = function () {
  if ( jquery_inc.readyState == 'loaded' || jquery_inc.readyState == 'complete' )
    jquery_ready();
};
/* this function should only fire after jQuery has been loaded */
function jquery_ready () {
	/*
		jQuery plugin: json2HTML( obj )
		this method I created to try and
		dynamically create HTML from a json
		type structure.  Using json, you create, setup and append
		elements to whatever $( [MATCHED_ELEMENTS] )
		EXAMPLE:
			You always start with an array.
			var html = [];
			// var html = [{}]; inside the array are objects {}
			// These objects have properties that tell the plugin what to do.
			// you can think of these properties as you would with jQuery plugin options.
			nodeName - This is simply "createElement" - nodeName: 'div'
			append - Has to be an array - [] (with objects inside, yay!!) [{}] - this is what makes it possible to have mutliple versions of some element.
			html, css, attr, or any other jQuery method can be used in between nodeName AND append
				EXAMPLE STRUCTURE:
					// create an array with one div that has "Hello World" as it's innerHTML
					var html = [ { nodeName: 'div', html: 'Hello World' } ];
					$(document).json2HTML(html);
					// let's say you wanted 2 div as siblings
					var html = [
						{ nodeName: 'div', html: 'Hello World' },
						{ nodeName: 'div', html: 'Hello World, I am div #2...it's as simple as adding a comma and another set of curly brackets with nodeName: and html: properties!' }
					];
					$(document).json2HTML(html);
	*/
	$.fn.json2HTML = function ( obj ) {
		var defaults = {};
		var options = $.extend(defaults, options);
		return this.each(function (i) {
			var previousElement = this;
			function json2HTML( obj ) {
				for ( var i=0; i<obj.length; i++ ) {
					for ( prop in obj[i] ) {
						switch ( prop ) {
							case 'eval': { eval(obj[i][prop]); break; }
							case 'nodeName': {
								var node = document.createElement(obj[i][prop]);
								break;
							}
							case 'append': {
								/*
									append here if the append: [property] is used
									since we will be executing this function again.
								*/
								$(previousElement).append(node);
								previousElement = node;
								json2HTML(obj[i][prop]);
								break;
							}
							case 'extend': {
								var props = obj[i][prop];
								for ( var x=0; x<props.length; x++ )
									for ( y in props[x] )
										$.data(node, y, props[x][y]);
								break;
							}
							case 'props': {
								var props = obj[i][prop];
								for ( var x=0; x<props.length; x++ )
									eval('node.' + props[x].split('=')[0] + ' = ' + props[x].split('=')[1] + ';');
								break;
							}
							case 'id': { $(node).attr('id', obj[i][prop]); break; }
							case 'if': { eval(obj[i][prop]); break; }
							case 'href': { $(node).attr('href', obj[i][prop]); break; }
							case 'return': { return eval(obj[i][prop]); break; }
							case 'addClass':
							case 'val':
							case 'text':
							case 'html':
							case 'attr':
							case 'css': {
									eval('$(node).' + prop + '(obj[i][prop]);');
								break;
							}
							/* default - click, mouseover, my_plugin */
							default: { eval('$(node).' + prop + '(' + obj[i][prop] + ');'); break; }
						}
					}
					/*
						this append will occur if the append: [property] is not used
						and all of the props have been gone through
					*/
					$(previousElement).append(node);
				}
				if ( node )
					previousElement = node.parentNode.parentNode;
			};
			json2HTML(obj);
		});
	};
	/* right click context menu */
	$.fn.showMenu = function (options) {
		var opts = $.extend({}, $.fn.showMenu.defaults, options);
		$(this).bind('contextmenu', function (e){
			$(opts.query).get(0).obj = this;
			$(opts.query)
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
		query: document,
		opacity: 1.0
	};
	/* clipboard copy */
	$.copy = function (data) { return $.fn.copy.call({}, data); };
	$.fn.copy = function (delimiter) {
		// Get Previous Object List
		var self = this,
		// Capture or Create Div for SWF Object
		flashcopier = (function (fid) {
			return document.getElementById(fid) || (function () {
				var divnode    = document.createElement('div');
					divnode.id = fid;
				document.body.appendChild(divnode);
				return divnode;
			})();
		})('_flash_copier'),
		// Capture our jQuery Selected Data and Scrub
		data = $.map(self, function (bit) {
			return typeof bit === 'object' ? bit.value || bit.innerHTML.replace(/<.+>/g, '') : '';
		}).join( delimiter || '' ).replace(/^\s+|\s+$/g, '') || delimiter,
		// Define SWF Object with our Captured Data
		divinfo = '<embed src="jquery.copy.swf" FlashVars="clipboard=' + encodeURIComponent(data) + '" width="0" height="0" ' + 'type="application/x-shockwave-flash"></embed>';
		// Create SWF Object with Defined Data Above
		flashcopier.innerHTML = divinfo;
		// Return Previous Object List
		return self;
	};
	$.jsFirebug = function () {
		this.init();
		//this.getCSS(true);
		this.jsfbWindow.json2HTML('CSS', [ { nodeName: 'a', attr: { href: 'javascript:$.jsFirebug.getCSS(true);' }, html: 'Enable CSS' } ]);
		//this.getHTML();
		this.jsfbWindow.json2HTML('HTML', [ { nodeName: 'a', attr: { href: 'javascript:$.jsFirebug.getHTML();' }, html: 'Enable HTML' } ]);
		this.getInfo();
		//this.jsfbWindow.json2HTML('Info', [ { nodeName: 'a', attr: { href: 'javascript:$.jsFirebug.getInfo();' }, html: 'enable' } ]);
		//this.getScript();
		this.jsfbWindow.json2HTML('Script', [ { nodeName: 'a', attr: { href: 'javascript:$.jsFirebug.getScript();' }, html: 'Enable Script' } ]);
		//this.getVisual('all[i].nodeName.toLowerCase()');
		this.jsfbWindow.json2HTML('Visual', [ { nodeName: 'a', attr: { href: "javascript:$.jsFirebug.getVisual('all[i].nodeName.toLowerCase()');" }, html: 'Enable Visual' } ]);
		/* get rid of the "loading... please wait" screen */
		this.loadPlugins();
//		$('#pleaseWait').remove();
	};
	$.extend(jQuery.jsFirebug, {
		prototype: {
			init: function () {
				/* create an array for font families */
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
				/* create an array used for CSS rule[property] ** can be used for auto fill. */
				this.propAF = [
					'azimuth',
					'background', 'background-attachment', 'background-color', 'background-image', 'background-position', 'background-repeat', 'border', 'border-bottom', 'border-bottom-color', 'border-bottom-style', 'border-bottom-width', 'border-collapse', 'border-color', 'border-left', 'border-left-color', 'border-left-style', 'border-left-width', 'border-right', 'border-right-color', 'border-right-style', 'border-right-width', 'border-spacing', 'border-style', 'border-top', 'border-top-color', 'border-top-style', 'border-top-width', 'border-width', 'bottom',
					'caption-side', 'clear', 'clip', 'color', 'content', 'counter-increment', 'counter-reset', 'cue', 'cue-after', 'cue-before', 'cursor',
					'direction', 'display',
					'elevation', 'empty-cells',
					'float', 'font', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight',
					'height',
					'left', 'letter-spacing', 'line-height', 'list-style', 'list-style-image', 'list-style-position', 'list-style-type',
					'margin', 'margin-bottom', 'margin-left', 'margin-right', 'margin-top', 'marker-offset', 'marks', 'max-height', 'max-width', 'min-height', 'min-width',
					'orphans', 'outline', 'outline-color', 'outline-style', 'outline-width', 'overflow',
					'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'page', 'page-break-after', 'page-break-before', 'page-break-inside', 'pause', 'pause-after', 'pause-before', 'pitch', 'pitch-range', 'play-during', 'position',
					'quotes',
					'richness', 'right',
					'size', 'speak', 'speak-header', 'speak-numeral', 'speak-punctuation', 'speech-rate', 'stress',
					'table-layout', 'text-align', 'text-decoration', 'text-indent', 'text-shadow', 'text-transform', 'top',
					'unicode-bidi',
					'vertical-align', 'visibility', 'voice-family', 'volume',
					'white-space', 'widows', 'width', 'word-spacing',
					'z-index'
				];
				
				//javascript: for ( var i=0; i<document.styleSheets.length; i++ ) { var rules = document.styleSheets[i].cssRules ? document.styleSheets[i].cssRules : document.styleSheets[i].rules; for ( var j=0; j<rules.length; j++ ) { alert(rules[j].cssText); } } void(0);
				
				this.dInc = 0;
				this.bps = [14400, 28800, 33600, 56000, 128000, 394000, 640000, 10000000];
				this.loss = [1, 1.15, 1.2, 1.25];
				this.styleSheets = opener.document.styleSheets;
				this.ruleSet = [];
				this.parentGeneratedItems = [];
				this.newPropInc = 0;
				this.ffInc = 0;
				this.plugins = null;
				this.jsfbWindow = $.data(document.body, 'jsFirebugWindow');
				/* loop through all stylesheets and push the rules into an array */
				for ( var i=0; i<this.styleSheets.length; i++ ) {
					try {
						this.rules = this.styleSheets[i].cssRules ? this.styleSheets[i].cssRules : this.styleSheets[i].rules;
						this.ruleSet[i] = {};
						this.ruleSet[i].rule = [];
						this.ruleSet[i].href = this.styleSheets[i].href;
						for ( var j=0; j<this.rules.length; j++ ) {
							this.ruleSet[i].rule.push(this.rules[j]);
						}
					} catch(e) {}
				}
				this.jsfbWindow.append('Style', '<span id="noStylePhrase">No elements inspected yet.<br /><br />Click on any element in the parent window to begin inspecting.</span>');
				/* create our highlighter in the opener/parent window */
				this.highlightWrap = opener.document.createElement('div');
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
				this.appendToOpener(this.highlightWrap);
				var self = this;
				/*
					nullify all objects on the inspected page (opener)
					we'll set onclick and onmousedown to null for all elements
					as well as all anchors href to "javascript: void(0);"
				*/
				$.each($('*', opener.document), function () {
					if ( this.nodeName.toLowerCase() == 'a' )
						$(this).attr('href', 'javascript: void(0);');
					/* here we could store the original onclick and onmousedown events somewhere */
					this.onclick = this.onmousedown = null;
				});
				/* try and stop all/any flash */
				if ( opener.document.all ) {
					
				} else {
					$.each($('embed', opener.document), function () {
						if ( $(this).attr('src') ) {
							var src = $(this).attr('src'), w = h = '';
							if ( $(this).attr('width') )
								w = $(this).attr('width');
							if ( $(this).attr('height') )
								h = $(this).attr('height');
							/*
								at this point I'm hoping I grabbed a swf and got it's w & h.
								I'll set it's parentNode (most likely a div) to that width
								and height and give it a bg color of #CCC
							*/
							if ( w != '' && h != '' && src.indexOf('.swf') != -1 )
								self.stopSWF(this, w, h);
						}
					});
				}
				$(opener.document.body).mousedown(function ( event ) {
					self.inspectElement(event);
				});
				$.data(document.body, 'jsFirebug', this);
			},
			stopSWF: function ( obj, w, h ) {
				$('object, script, embed', opener.document).css({
					width: w + 'px',
					height: h + 'px',
					background: '#333',
					padding: '10px',
					color: '#FFF',
					'text-align': 'center',
					'overflow': 'hidden'
				});
//				var embedSWF = obj;
//				while ( obj ) {
//					if ( obj.nodeType == 1 ) {
//						if ( obj.nodeName.toLowerCase() != 'object'
//							&& obj.nodeName.toLowerCase() != 'script'
//							&& obj.nodeName.toLowerCase() != 'embed') {
//							$(obj)
//								.css({
//									width: w + 'px',
//									height: h + 'px',
//									background: '#333',
//									padding: '10px',
//									color: '#FFF',
//									'text-align': 'center',
//									'overflow': 'hidden'
//								})
//								.html(embedSWF.src);
//							return;
//						}
//						if ( obj.nodeName.toLowerCase() == 'body' )
//							return;
//					}
//					obj = obj.parentNode;
//				}
			},
			isArray: function (obj) {
				return obj && !(obj.propertyIsEnumerable('length')) && typeof obj === 'object' && typeof obj.length === 'number';
			},
			loadPlugins: function () {
				var all = document.getElementsByTagName('script');
				for ( var i=0; i<all.length; i++ ) {
					var str = 'jsfirebug_window.js?plugins=';
					if ( all[i].src.indexOf(str) != -1 ) {
						this.plugins = all[i].src.substring(all[i].src.indexOf(str) + str.length, all[i].src.length);
					}
				}
				var allPlugins = this.plugins != null ? this.plugins.split(';') : [];
				for ( var j=0; j<allPlugins.length; j++ ) {
					var x = document.createElement('script');
					x.language = 'javascript';
					x.type = 'text/javascript';
					x.src = allPlugins[j];
					if ( document.getElementsByTagName('head')[0] )
						document.getElementsByTagName('head')[0].appendChild(x);
					else
						document.body.appendChild(x);
					try {
						var x = document.createElement('link');
						x.rel = 'stylesheet';
						x.type = 'text/css';
						x.href = allPlugins[j].substring(0, allPlugins[j].lastIndexOf('.')) + '.css';
						if ( document.getElementsByTagName('head')[0] )
							document.getElementsByTagName('head')[0].appendChild(x);
						else
							document.body.appendChild(x);
					} catch(e) {}
				}
			},
			getURLParam: function ( param ) {
				var q = opener.document.location.search || opener.document.location.hash;
				if ( param == null ) { return q; }
				if ( q ) {
					var pairs = q.substring(1).split('&');
					for ( var i=0; i<pairs.length; i++ )
						if ( pairs[i].substring(0, pairs[i].indexOf('=')) == param )
							return unescape(pairs[i].substring((pairs[i].indexOf('=') + 1)));
				}
				return '';
			},
			appendToOpener: function ( obj ) {
				this.parentGeneratedItems.push(obj);
				$(opener.document.body).append(obj);
			},
			/* method: inspectElement( event ) */
			inspectElement: function ( event ) {
				if ( event == null )
					event = window.event;
				var target = event.target != null ? event.target : event.srcElement;
				var btn = opener.document.all ? 1 : 0;
				if ( event.button == btn ) {
					var obj = target;
					if ( obj.nodeType != 1 )
						return;
					while ( obj ) {
						if ( obj.id == 'jsfWrap')
							return;
						obj = obj.parentNode;
					}
					this.findStyles(target);
				}
			},
			/* method: findStyles( obj ) */
			findStyles: function ( obj ) {
				var jsFirebug = this;
				if ( obj == null || obj == 'undefined' )
					return;
				this.jsfbWindow.show('Style');
				this.jsfbWindow.clear('Style');
				this.dInc = 0;
				this.currentObj = obj;
				this.objToCheck = obj;
				var tmp = '';
				if ( obj.id ) 
					tmp = '#' + obj.id;
				if ( $(obj).attr('className') )
					if ( tmp == '' )
						tmp = '.' + $(obj).attr('className')
				//this.jsfbWindow.changeTitle('<span class="stylesForSpan">Styles for: ' + obj.nodeName + tmp + '</span>');
				/* create span w/ class[retrievedStyleForPhrase] w/ text[Styles retrieved for:] for the output window */
				this.jsfbWindow.json2HTML('Style', [{ nodeName: 'span', addClass: 'retrievedStyleForPhrase', html: 'Styles retrieved for: ' }] );
				this.jsfbWindow.json2HTML('Style', [{
					nodeName: 'a',
					addClass: 'retrievedStyleForPhrase',
					extend: [ {obj: obj, jsFirebug: jsFirebug } ],
					mouseover: function () {
						var jsFirebug = $.data(this, 'jsFirebug');
						var obj = $.data(this, 'obj');
						jsFirebug.highlight('add', obj);
					},
					mouseout: function () {
						var jsFirebug = $.data(this, 'jsFirebug');
						jsFirebug.highlight('remove');
					},
					href: 'javascript: void(0);',
					html: this.currentObj.nodeName.toLowerCase() + tmp
				}]);
				this.jsfbWindow.json2HTML('Style', [ { nodeName: 'br' } ]);
				/* loop backwards through parentNodes from this element back to the body */
				while ( this.currentObj ) {
					if ( obj.nodeType == 1 ) {
						/* when we hit the html tag, we're done */
						if ( this.currentObj.nodeName.toLowerCase() == 'html' )
							return;
						if ( this.currentObj != obj ) {
							/* set a flag if an id was found */
							var cID = false, strIDC = '';
							/* does this element have an id? ) */
							if ( $(this.currentObj).attr('id') ) {
								strIDC = '#' + this.currentObj.id;
								cID = true;
							}
							if ( $(this.currentObj).attr('className') ) {
								if ( !cID ) {
									strIDC = '.' + $(this.currentObj).attr('className');
									cID = true;
								}
							}
							this.jsfbWindow.json2HTML('Style', [{ nodeName: 'br' }, {
							 	nodeName: 'span',
								addClass: 'inheritedFrom',
								html: 'Inherited from ',
								append: [{
									nodeName: 'a',
									extend: [ {currentObj: this.currentObj, jsFirebug: jsFirebug}],
									href: 'javascript: void(0);',
									click: function () {
										$.data(this, 'jsFirebug').highlight('remove');
										$.data(this, 'jsFirebug').findStyles($.data(this, 'currentObj'))
									},
									mouseover: function () {
										$.data(this, 'jsFirebug').highlight('add', $.data(this, 'currentObj'));
									},
									mouseout: function () {
										$.data(this, 'jsFirebug').highlight('remove');
									},
									html: this.currentObj.nodeName.toLowerCase(),
									append: [{ nodeName: 'span', addClass: 'idAttr', html: strIDC }]
								}]
							}]);
						}
						this.getStyles(this.currentObj);
					}
					this.currentObj = this.currentObj.parentNode;
				}
			},
			/* method: getStyles( obj ) */
			getStyles: function ( obj ) {
				var mStyles = [];
				if ( this.ruleSet ) {
					for ( var h=0; h<this.ruleSet.length; h++ ) {
						if ( this.ruleSet[h] == undefined )
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
//												if ( opener.document.all ) {
//													var tmp2 = this.ruleSet[h].rule[i].style.cssText.split(';');
//													var cssText = '';
//													for ( var y=0; y<tmp2.length; y++ ) {
//														var cssTextDefinition = tmp2[y].split(':')[0].toLowerCase();
//														//var cssTextProp = tmp2[y].split(':')[1];
//														/* this needs to be use substring instead of split because the cssTextProp may contain ':' e.g. url(http:...) */
//														var cssTextProp = tmp2[y].substring(tmp2[y].indexOf(':'), tmp2[y].length);
//														cssText += cssTextDefinition + ':' + cssTextProp + ';';
//													}
//													var tmpSelectorText = arySelectorText[j].split(' ');
//													var newSelectorText = '';
//													for ( var x=0; x<tmpSelectorText.length; x++ ) {
//														var idY = clY = false;
//														if ( tmpSelectorText[x].indexOf('#') != -1 ) {
//															if ( tmpSelectorText[x].split('#').length > 1) {
//																idY = true;
//																newSelectorText += tmpSelectorText[x].split('#')[0].toLowerCase() + ' #' +  tmpSelectorText[x].split('#')[1];
//															}
//														}
//														if ( tmpSelectorText[x].indexOf('.') != -1 ) {
//															if ( tmpSelectorText[x].split('.').length > 1) {
//																clY = true;
//																newSelectorText +=  tmpSelectorText[x].split('.')[0].toLowerCase() + ' .' +  tmpSelectorText[x].split('.')[1];
//															}
//														}
//														if ( tmpSelectorText[x] == '>' || tmpSelectorText[x] == '+' )
//															continue;
//														if ( !idY && !clY )
//															newSelectorText = tmpSelectorText[x].toLowerCase();
//													}
//													mStyles.push(this.createRule(newSelectorText, cssText, this.ruleSet[h].href));
//												} else
													mStyles.push(this.createRule(arySelectorText[j], this.ruleSet[h].rule[i].style.cssText, this.ruleSet[h].href));
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
			getHTML: function () {
				this.jsfbWindow.clear('HTML');
				var wrap = document.createElement('div');
				$(wrap)
					.attr('id', 'jsfb_htmlWrap')
					.html('<span class="htmlTag">&lt;body&gt;</span>');
				this.jsfbWindow.append('HTML', wrap);
				this.loopDOM(opener.document.body, wrap);
				this.jsfbWindow.append('HTML', '<div><span class="htmlTag">&lt;/body&gt;</span></div>');
			},
			/* method: loopDOM( obj, container ) */
			loopDOM: function ( obj, container ) {
				//this.prevParent = container;
				var k = 0;
				var jsFirebug = this;
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
							if ( tagName != 'html'
								&& tagName != 'meta'
								&& tagName != 'title'
								&& tagName != 'head'
								&& tagName != 'script'
								&& tagName != 'noscript'
								&& tagName != 'noembed'
								&& tagName != 'param'
								&& tagName != 'link'
							) {
								/* create the wrapper for a group of children to draw */
								container.endTag = true;
								var startHTML = slash = htmlText = endHTML = '';
								var hasChildren = false;
								var newContainer = document.createElement('div');
								$(newContainer).css('margin-left', '15px');
								var htmlLine = document.createElement('span');
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
								$(htmlLine)
									.addClass('htmlLine')
									.html(startHTML + '<br />')
									.mouseover(function () {
										jsFirebug.highlight('add', this.obj);
									})
									.mouseout(function () {
										jsFirebug.highlight('remove');
									})
									.click(function () {
										jsFirebug.findStyles(this.obj);
									})
									.showMenu({ query	: '#htmlContext' });
								if ( container.endTag ) {
									if ( tagName != 'img' && tagName != 'br') {
										var htmlEndTag = document.createElement('span');
										$(htmlEndTag)
											.addClass('htmlTag')
											.html('&lt;/' + tagName + '&gt;');
										$(newContainer).append(htmlEndTag);
										newContainer.endTagObj = htmlEndTag;
										var expandSign = newContainer.insertBefore(document.createElement('span'), htmlLine);
										$(expandSign)
											.css('padding-left', '7px')
											.addClass('expandSign')
											.html('-')
											.click(function () {
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
								htmlLine.htmlCB = curObj.outerHTML;
								htmlLine.innerHTMLCB = curObj.innerHTML;
							}
						}
						k++;
					}
				}
			},
			/* method showCCKey() */
			showCCKey: function ( method ) {
				var wrap = document.createElement('div');
				$(wrap).attr('id', 'ccKeyWrap');
					var btnClose = document.createElement('div');
					$(btnClose)
						.addClass('btnClose')
						.click(function () {
							$(this.parentNode).remove();
						})
						.html('close');
					$(wrap).append(btnClose);
					var ul = document.createElement('ul');
					$(wrap).append(ul);
						for ( name in this.aryColorCodes ) {
							if ( name != 'null' ) {
								var li = document.createElement('li');
								li.jsFirebug = this;
								li.name = name;
								$(li)
									.css('background', this.aryColorCodes[name])
									.mouseover(function () {
										switch ( method ) {
											case 'nodeName': {
												this.jsFirebug.highlightMultiple('set', this.name);
												break;
											}
											case 'display': {
												var objs = [];
												var name = this.name;
												$.each($('*', opener.document), function () {
													if ( this.nodeType == 1 ) {
														if ( this.tagName.toLowerCase() != 'script' &&
															this.tagName.toLowerCase() != 'link' &&
															this.tagName.toLowerCase() != 'br ') {
															if ( $(this).css('display') == name )
																objs.push(this);
														}
													}
												});
												this.jsFirebug.highlightMultiple('set', objs);
												break;
											}
											case 'className': {
												var objs = [];
												var name = this.name;
												$.each($('*', opener.document), function () {
													if ( this.nodeType == 1 ) {
														if ( this.tagName.toLowerCase() != 'script' &&
															this.tagName.toLowerCase() != 'link' &&
															this.tagName.toLowerCase() != 'br ') {
															if ( $(this).attr('className') == name )
																objs.push(this);
														}
													}
												});
												this.jsFirebug.highlightMultiple('set', objs);
												break;
											}
										}
									})
									.mouseout(function () {
										switch ( method ) {
											case 'nodeName': {
												this.jsFirebug.highlightMultiple('undo', this.name);
												break;
											}
											case 'display': {
												var objs = [];
												var name = this.name;
												$.each($('*', opener.document), function () {
													if ( this.nodeType == 1 ) {
														if ( this.tagName.toLowerCase() != 'script' &&
															this.tagName.toLowerCase() != 'link' &&
															this.tagName.toLowerCase() != 'br ') {
															if ( $(this).css('display') == name )
																objs.push(this);
														}
													}
												});
												this.jsFirebug.highlightMultiple('undo', objs);
												break;
											}
											case 'className': {
												var objs = [];
												var name = this.name;
												$.each($('*', opener.document), function () {
													if ( this.nodeType == 1 ) {
														if ( this.tagName.toLowerCase() != 'script' &&
															this.tagName.toLowerCase() != 'link' &&
															this.tagName.toLowerCase() != 'br ') {
															if ( $(this).attr('className') == name )
																objs.push(this);
														}
													}
												});
												this.jsFirebug.highlightMultiple('undo', objs);
												break;
											}
										}
									})
									.html(name);
								$(ul).append(li);
							}
						}
				this.jsfbWindow.append('Visual', wrap);
			},
			/* method filterTags( array ) - returns true or false */
			filterTags: function ( str, array ) {
				for ( var i=0; i<array.length; i++ )
					if ( array[i] == str )
						return true;
				return false;
			},
			/* method: getVisual( method ) */
			getVisual: function ( method ) {
				/*
					loop through opener dom and color code by nodeName.
					What we're going to do is create color coded rectangles
					as a representation of the page.
				*/
				this.jsfbWindow.clear('Visual');
				var jsFirebug = this;
				this.aryColorCodes = [];
				this.aryColorCodes['null'] = '';
				var all = $('*', opener.document);
				for ( var i=0; i<all.length; i++ ) {
					if ( all[i].nodeType == 1 ) {
						if ( this.filterTags(all[i].tagName.toLowerCase(), ['head', 'script', 'link', 'noscript',  'meta', 'html', 'title', 'br']) )
							continue;
						for ( var j=0; j<this.parentGeneratedItems.length; j++ ) {
							if ( this.parentGeneratedItems[j] == all[i] )
								return;
						}
						var block = document.createElement('div');
						block.obj = all[i];
						var coords = this.findPos(block.obj);
						$(block)
							.css({
								position	: 'absolute',
								left		: coords[0] + 'px',
								top			: coords[1] + 'px',
								display		: 'block',
								width		: all[i].offsetWidth + 'px',
								height		: all[i].offsetHeight + 'px',
								background	: eval('this.setNodeNameColor(' + method + ')'),
								border		: '1px solid #000',
								cursor		: 'pointer'
							})
							.mouseover(function () {
								jsFirebug.highlight('add', this.obj);
							})
							.mouseout(function () {
								jsFirebug.highlight('remove');
							})
							.click(function () {
								jsFirebug.findStyles(this.obj);
							})
							.showMenu({ query	: '#ccContext' });
						this.jsfbWindow.append('Visual', block);
					}
				}
			},
			setNodeNameColor: function ( name ) {
				for ( n in this.aryColorCodes ) {
					if ( name == n ) {
						return this.aryColorCodes[n];
					}
				}
				var hex = this.randomHex();
				this.aryColorCodes[name] = hex;
				return hex;
			},
			randomHex: function () {
				var colors = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
				var digit = [];
				var color = '';
				/* use this method to get a random hex from 16 million colors */
				//for ( var i=0; i<6; i++ ) {
				//	digit[i] = colors[Math.round(Math.random()*14)];
				//	color = color + digit[i];
				//}
				//return '#' + color;
				/* use this method to get web safe colors */
				var c1 = colors[Math.round(Math.random()*14)].toString();
				var ary = [c1+c1, c1+c1, 'FF'];
				ary = this.randArray(ary);
				return '#' + ary[0] + ary[1] + ary[2];
								
			},
			swapper: function ( a, L, e ) {
				var r = Math.floor(Math.random()*L);                               
				var x = a[e];                                                       
				a[e] = a[r];                                                       
				a[r] = x;
				return a;
			},
			randArray: function ( ary ) {
				var i = L = ary.length;                                               
				while ( i-- )
					return this.swapper(ary, L, i); 
			},
			/* method: getScript() */
			getScript: function () {
				this.jsfbWindow.clear('Script');
				var all = $('*', opener.document);
				var str = '';
				for ( var i=0; i<all.length; i++ ) {
					if ( all[i].nodeType == 1 ) {
						var tagName = all[i].tagName.toLowerCase();
						if ( tagName == 'script' ) {
							if ( all[i].src != '' ) {
								if ( $(all[i]).attr('src').indexOf('js_firebug_start.js') == -1 ) {
									if ( $(all[i]).attr('src') ) {
										try {
											var self = this, a = all[i];
											$.get($(all[i]).attr('src'), function (data) {
												self.jsfbWindow.json2HTML('Script', [ { nodeName: 'h2', html: $(a).attr('src') } ]);
												self.jsfbWindow.json2HTML('Script', [ { nodeName: 'span', html: '<pre>' + data + '</pre>' } ]);
											});
										} catch(e) {
											this.jsfbWindow.json2HTML('Script', [ { nodeName: 'h2', html: $(all[i]).attr('src') } ]);
										}
									} else {
										this.jsfbWindow.json2HTML('Script', [ { nodeName: 'h2', html: '(inline script)' } ]);
									}
									this.jsfbWindow.json2HTML('Script', [ { nodeName: 'span', html: '<pre>' + $(all[i]).html() + '</pre>' } ]);
								}
							}
						}
					}
				}
			},
			/* method: getInfo() */
			getInfo: function () {
				var markup = $('html', opener.document).html();
				var bodymarkup = $('body', opener.document).html();
				var nContent = bodymarkup.replace(/<(.|\n)+?>/g, '');
				var markupSize = bodymarkup.length;
				var contentSize = nContent.length;
				var titleContent = this.countTitleAndAlt();
				contentSize -= titleContent;
				var contentPercentage = Math.round( ( contentSize / bodymarkup.length ) * 100 );
				this.jsfbWindow.clear('Info');
				this.h2 = document.createElement('h2');
				$(this.h2 )
					.addClass('infoSpan')
					.html('Code Weight Specifications');
				this.jsfbWindow.append('Info', this.h2);
				this.span = document.createElement('span');
				$(this.span)
					.addClass('infoSpan')
					.html('Total Code Weight: <span class="infoNum">' + (parseFloat(markup.length) / 1000) + '</span> kb.<br />');
				this.jsfbWindow.append('Info', this.span);
				this.span = document.createElement('span');
				$(this.span)
					.addClass('infoSpan')
					.html('Body Code Weight: <span class="infoNum">' + (parseFloat(bodymarkup.length) / 1000) + '</span> kb.<br />');
				this.jsfbWindow.append('Info', this.span);
				this.span = document.createElement('span');
				$(this.span)
					.addClass('infoSpan')
					.html('Content Weight: <span class="infoNum">' + (parseFloat(contentSize) / 1000) + '</span> kb.<br />');
				this.jsfbWindow.append('Info', this.span);
				this.span = document.createElement('span');
				$(this.span)
					.addClass('infoSpan')
					.html('Markup Percent: <span class="infoNum">' + (100 - contentPercentage) + '</span>%.<br />');
				this.jsfbWindow.append('Info', this.span);
				this.span = document.createElement('span');
				$(this.span)
					.addClass('infoSpan')
					.html('Content Percent: <span class="infoNum">' + contentPercentage + '</span>%.<br />');
				this.jsfbWindow.append('Info', this.span);
				this.h2 = document.createElement('h2');
				$(this.h2 )
					.addClass('infoSpan')
					.html('Approximate Download Times');
				this.jsfbWindow.append('Info', this.h2 );
				var tt = this.renderTimeTable(this.calcTimes(markupSize * 8))
				this.span = document.createElement('span');
				$(this.span)
					.addClass('infoSpan')
					.html(tt);
				this.jsfbWindow.append('Info', this.span);
				/* create a table showing a list of elements and how many of each there are */
				this.h2 = document.createElement('h2');
				$(this.h2 )
					.addClass('infoSpan')
					.html('Element Usage');
//				this.jsfbWindow.append('Info', this.h2 );
//				var tt = this.renderElementUsage();
//				this.span = document.createElement('span');
//				$(this.span)
//					.addClass('infoSpan')
//					.html(tt);
//				this.jsfbWindow.append('Info', this.span);
//				$('#dlTimes tr:odd').css('background', '#CCF');
//				$('#elementUsage tr:odd').css('background', '#CCF');


				this.jsfbWindow.json2HTML('Info', [{ nodeName: 'div', id: 'infoWrap' }] );
				
				$('#infoWrap').json2HTML( [{ nodeName: 'h2', html: 'Dead Images' }] );

				this.jsfbWindow.json2HTML('Info', [{ nodeName: 'div', id: 'tmpImgWrap' }] );
				$.each($('img', opener.document), function (i) {
					$('#tmpImgWrap').json2HTML( [{
						nodeName: 'img',
						attr: { src: this.src },
						error: function () {
							$('#infoWrap').json2HTML( [{ nodeName: 'p', html: $(this).attr('src') }] );
						},
						load: function () {
							$(this).remove();
						}
					}] );
				});
				
				$('#infoWrap').json2HTML( [{ nodeName: 'h2', html: 'Possible Local Images' }] );
				$.each($('img', opener.document), function (i) {
					if ( $(this).attr('src').indexOf('http://') == -1 ) {
						$('#infoWrap').json2HTML( [{ nodeName: 'p', html: $(this).attr('src') }] );
					}
				});
				$('#infoWrap').json2HTML( [{ nodeName: 'h2', html: 'Relative Anchors' }] );
				$.each($('a', opener.document), function (i) {
					if ( $(this).attr('href').indexOf('http://') == -1 ) {
						$('#infoWrap').json2HTML( [{ nodeName: 'p', html: $(this).html() + ' | <span class="relative_anchors">' + $(this).attr('href') + '</span>' }] );
					}
				});
				$('#infoWrap').json2HTML( [{ nodeName: 'h2', html: 'IDs' }] );
				$.each($('*', opener.document), function (i) {
					if ( $(this).attr('id') ) {
						$('#infoWrap').json2HTML( [{ nodeName: 'p', html: '<span class="id_name">#' + $(this).attr('id') + '</span> | <span class="id_nodeName">' + $(this).get(0).nodeName.toUpperCase() + '</span>' }] );
					}
				});
				$('#infoWrap').json2HTML( [{ nodeName: 'h2', html: 'Classes' }] );
				$.each($('*', opener.document), function (i) {
					if ( $(this).attr('class') ) {
						$('#infoWrap').json2HTML( [{ nodeName: 'p', html: '<span class="class_name">#' + $(this).attr('class') + '</span> | <span class="class_nodeName">' + $(this).get(0).nodeName.toUpperCase() + '</span>' }] );
					}
				});
				$('#infoWrap').json2HTML( [{ nodeName: 'br' }] );
				$('#infoWrap').json2HTML( [{ nodeName: 'br' }] );
			},
			renderElementUsage: function () {
				/* first find and push all the different tagNames into an array */
				var aryTagNames = ['html'];
				var all = $('*', opener.document);
				for ( var i=0; i<all.length; i++ ) {
					if ( all[i].nodeType == 1 ) {
						var t = all[i].tagName.toLowerCase();
						if ( this.filterTags(t, ['html', 'title', 'head', 'meta', 'script', 'link']) )
							continue;
						if (aryTagNames.toString().indexOf(t) == -1 ) {
							aryTagNames.push(t);
							continue;
						}
					}
				}
				/* now create the table */
				aryTagNames.sort();
				var mHTML = '<table id="elementUsage" width="200" cellspacing="0" cellspacing="0"><tr class="headerRow"><td width="50%">element</td><td>#uses</td></tr>';
				for ( var i=0; i<aryTagNames.length; i++ )
					if ( aryTagNames[i] != 'html' )
						if ( $(aryTagNames[i], opener.document).length > 0 )
							mHTML += '<tr><td>' + aryTagNames[i] + '</td><td>' + $(aryTagNames[i], opener.document).length + '</td></tr>';
				mHTML += '</table>';
				return mHTML;
			},
			/* method: renderTimeTable( timesArray ) */
			renderTimeTable: function ( timesArray ) {
				var mHTML = '<table id="dlTimes" width="400" cellspacing="0"><tr class="headerRow"><td>bps</td><td>0%</td><td>15%</td><td>20%</td><td>25%</td></tr>';
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
			calcTimes: function ( byteSize ) {
				times = new Array();
				for ( i=0; i<this.bps.length; i++ ) {
					times[i] = new Array();
					for ( j=0; j<this.loss.length; j++ )
						times[i][j] = this.formatTime( Math.round( (byteSize / this.bps[i]) * this.loss[j] ) );
				}
				return times;
			},
			/* method: countTitleAndAlt() */
			countTitleAndAlt: function () {
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
			formatTime: function ( time ) {
				if ( time <= 59 ) {
					if ( time < 10 )
						return '00:0' + time;
					else
						return '00:' + time;
				} else {
					time /= 60;
					time = time.toFixed(2);
					var str = '';
					time = time.toString();
					time = time.split('.');
					m = parseInt(time[0]);
					s = parseInt(time[1]);
					if ( m < 10 )
						str += '0' + m + ':';
					else
						str += m + ':';
					if ( s < 10 )
						str += '0' + s;
					else
						str += s;
					return str;
				}
			},
			cssRGB2Hex: function ( str ) {
				if ( str.indexOf('rgb(') != -1 ) {
					str = str.replace('rgb(', '').replace(')', '');
					var tmp = str.split(',');
					var r = parseInt(tmp[0]).toString(16).toUpperCase();
					var g = parseInt(tmp[1]).toString(16).toUpperCase();
					var b = parseInt(tmp[2]).toString(16).toUpperCase();
					if ( r.length == 1 )
						r = 0 + r;
					if ( g.length == 1 )
						g = 0 + g;
					if ( b.length == 1 )
						b = 0 + b;
					return '#' + r + g + b;
				}
				return str;
			},
			/* method: getCSS() */
			getCSS: function ( compressed ) {
				var str = '';
				this.jsfbWindow.clear('CSS');
				for ( var i=0; i<this.ruleSet.length; i++ ) {
					if ( this.ruleSet[i] ) {
						if ( this.ruleSet[i].href ) {
							this.cssFileName = '';
							if ( this.ruleSet[i].href.lastIndexOf('/') != -1 )
								this.cssFileName = this.ruleSet[i].href.substring(this.ruleSet[i].href.lastIndexOf('/') + 1, this.ruleSet[i].href.length);
							else
								this.cssFileName = this.ruleSet[i].href;
							/* create a link for this css file name */
							str += '<a class="cssLinkHref" href="' + this.ruleSet[i].href + '" target="_blank">' + this.cssFileName + '</a>';
							for ( var j=0; j<this.ruleSet[i].rule.length; j++ ) {
								if ( !this.ruleSet[i].rule[j].selectorText
									|| this.ruleSet[i].rule[j].selectorText.toLowerCase() == 'unknown'
									|| this.ruleSet[i].rule[j].style.cssText == '' )
										continue;
								var cssLine = '';
								if ( this.ruleSet[i].rule[j].style.cssText.indexOf('rgb') != -1 ) {
									var tmp = this.ruleSet[i].rule[j].style.cssText.split(';');
									var cssText = ''
									for ( var k=0; k<tmp.length - 1; k++ ) {
										if ( tmp[k] == '' )
											continue;
										var tmp2 = tmp[k].split(':');
										cssText += tmp2[0] + ': ' + this.cssRGB2Hex(tmp2[1]) + ';';										
									}
									cssLine += cssText;
								} else
									cssLine = this.ruleSet[i].rule[j].style.cssText;
								if ( compressed )
									str += '<p>' + this.ruleSet[i].rule[j].selectorText.toLowerCase() + ' {<span>' + cssLine + '</span>}</p>';
								else {
									if ( cssLine.indexOf(';') != -1 ) {
										str += this.ruleSet[i].rule[j].selectorText.toLowerCase() + ' {<br />';
										var tmp = cssLine.split(';');
										/* create a <ul> to show the property: value; pairs of a css rule */
										str += '<ul>';
										for ( var k=0; k<tmp.length - 1; k++ ) {
											if ( tmp[k] == '' )
												continue;
											var tmp2 = tmp[k].split(':');
											str += '<li>' + tmp2[0].toLowerCase() + ': ' + tmp2[1] + ';</li>';
										}
										str += '</ul>';
										str += '}<br /><br />';
									} else
										str += '<p>' + this.ruleSet[i].rule[j].selectorText.toLowerCase() + ' {<span>' + cssLine + '</span>}</p>';
								}
							}
						}
					}
				}
				this.jsfbWindow.json2HTML('CSS', [ { nodeName: 'div', id: 'ssOutputWrap', html: str } ]);
			},
			/* method: createRule( selectorText, cssText, url ) */
			createRule: function ( selectorText, cssText, url ) {
				var allCssText = cssText.replace(/^\s+/g, '').replace(/\s+$/g, '').split(';');
				var cssRuleWrap = document.createElement('div');
				$(cssRuleWrap)
					.attr('id', 'css_ruleWrap' + this.dInc)
					.addClass('css_ruleWrap');
				this.dInc++;
				var cssFileName = '';
				if ( url.lastIndexOf('/') != -1 )
					cssFileName = url.substring(url.lastIndexOf('/') + 1, url.length);
				else
					cssFileName = url;
				var cssHrefWrap = document.createElement('a');
				$(cssHrefWrap)
					.addClass('cssLinkHref')
					.attr('href', url)
					.attr('target', '_blank')
					.html(cssFileName + '<br />');
				$(cssRuleWrap).append(cssHrefWrap);
				var selectorTextWrap = document.createElement('span');
				$(selectorTextWrap)
					.attr('id', 'cssSelectorTextContainer')
					.html(selectorText + ' {<br />');
				$(cssRuleWrap).append(selectorTextWrap);
				for ( var i=0; i<allCssText.length; i++ ) {
					if ( allCssText[i] != '' ) {
						var strike_through = '';
						var isApplied = this.isApplied(allCssText[i]);
						if ( allCssText[i].indexOf('rgb(') != -1 )
							allCssText[i] = allCssText[i].split(':')[0] + ': ' + this.cssRGB2Hex(allCssText[i].split(':')[1]);
						if ( !isApplied ) {
							strike_through = 'line-through';
							if ( allCssText[i].indexOf('rgb(') != -1 )
								allCssText[i] = allCssText[i].split(':')[0] + ': ' + this.cssRGB2Hex(allCssText[i].split(':')[1]);
						} else {
							if ( allCssText[i].indexOf('url(') != -1 ) {
								var img = allCssText[i].substring(allCssText[i].indexOf('url(') + 4, allCssText[i].indexOf(')', allCssText[i].indexOf('url(')));
								if ( document.all )
									img = img.replace(/"/g, '');
								/*
									looks like this image url has a relative path let's try and
									create an absolute path using stringing together:
									opener.location.href.substring(0, opener.location.href.lastIndexOf('/') + 1)
								  + url.substring(0, (url.length - cssFileName.length))
								  + img
								*/
								if ( img.indexOf('http') == -1 ) {
									img = document.all ? opener.location.href.substring(0, opener.location.href.lastIndexOf('/') + 1) + url.substring(0, (url.length - cssFileName.length)) + img : url.substring(0, (url.length - cssFileName.length)) + img;
								}
							}
						}
						//var cssTextProp = allCssText[i].split(':')[0];
						var cssTextProp = allCssText[i].substring(0, allCssText[i].indexOf(':'));
						//var cssTextVal = allCssText[i].split(':')[1];
						var cssTextVal = allCssText[i].substring(allCssText[i].indexOf(':') + 1, allCssText[i].length);
						var mpWidth = 6 * cssTextProp.length;
						var mvWidth = 6 *  cssTextVal.length;
						this.createPropertyValueSet(cssRuleWrap, this, false, mpWidth, cssTextProp, cssTextProp, mvWidth, cssTextVal, strike_through, cssTextProp, img, this.objToCheck);
					}
				}
				this.jsfbWindow.append('Style', document.createElement('br'));
				this.jsfbWindow.append('Style', cssRuleWrap);
				var cssRuleWrapEnd = document.createElement('div')
				$(cssRuleWrapEnd)
					.addClass('css_ruleWrap')
					.html('}<br />');
				this.jsfbWindow.append('Style', cssRuleWrapEnd);
			},
			/* method: isApplied( cssText) */
			isApplied: function ( cssText ) {
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
			/*
				method: createPropertyValueSet( jsFWHtmlWrap, obj, isNew, propW, propVal, propOldVal, valW, valVal, strike, propToChange, image, objToCheck )
				STRUCTURE
					<span id="?">
						<div id="disableRule" class="disabled"></div>
						<input type="text" class="oProperty" value="" />
						<input type="text" class="oValue" value="" />
					</span>
			*/			
			createPropertyValueSet: function ( jsFWHtmlWrap, obj, isNew, propW, propVal, propOldVal, valW, valVal, strike, propToChange, image, objToCheck ) {
				var jsFirebug = this;
				/* create an ID */
				var mID = 'rule' + this.newPropInc;
				/* create the containing span */
				var span = document.createElement('span');
				span.self = this;
				$(span)
					.attr('id', mID)
					.addClass('oCssTextSpan');
				$(jsFWHtmlWrap).append(span);
					var disable = document.createElement('div');
					disable.self = this;
					disable.rule = span;
					disable.on = false;
					disable.holdValue = '';
					disable.objToCheck = objToCheck;
					$(disable)
						.attr('id', 'disableRule' + this.newPropInc)
						.addClass('disabled')
						.mouseover(function ( event ) {
							jsFirebug.disable(event, this);
						})
						.mouseout(function ( event ) {
							jsFirebug.disable(event, this);
						}).click(function ( event ) {
							jsFirebug.disable(event, this);
						});
					$(span).append(disable);
					// create the property textbox
					var txtProp = document.createElement('input');
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
						$(txtProp).attr('value', propVal.replace(/^\s+/g, '').toLowerCase());
					else
						$(txtProp).attr('value', '');
					$(txtProp)
						.css('text-decoration', strike)
						.focus(function () { $(this).css('border', '1px solid #000'); })
						.blur(function () { jsFirebug.checkProperty(this); })
						.keyup(function (event) { jsFirebug.changeRuleProp(this, event); });
					if ( propOldVal != '' )
						txtProp._oldValue = propOldVal.replace(/^\s+/g, '');
					else
						txtProp._oldValue = '';
					$(span)
						.append(txtProp)
						.append(document.createTextNode(' : '));
					/* create the value textbox */
					var txtVal = document.createElement('input');
					txtVal.currentObj = obj.currentObj;
					txtVal.selector_text = obj.selector_text;
					txtVal.parentID = mID;
					txtVal.parentWrapID = jsFWHtmlWrap.id;
					txtVal.sibling = txtProp;
					txtVal.objToCheck = objToCheck;
					txtVal.img = image;
					$(txtVal)
						.attr('type', 'text')
						.addClass('oValue')
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
						.mouseover(function ( event ) { jsFirebug.previewPopup(this, 'create', event); })
						.mouseout(function ( event ) { jsFirebug.previewPopup(this, 'remove', event); })
						.focus(function () { $(this).css('border', '1px solid #000'); })
						.blur(function () {
							jsFirebug.checkValue(this);
							jsFirebug.changeProperty(this);
						})
						.keyup(function ( event ) { jsFirebug.checkKeys(this, event); });
					if (propToChange != '')
						txtVal._propertyToChange = propToChange;
					else
						txtVal._propertyToChange = '';
					$(span).append(txtVal);
					/* attach the property and value textboxes to the containing span */
					$(span).json2HTML([{ nodeName: 'br', css: { clear: 'left' } }]);
				txtProp.sibling = txtVal;
				txtProp._value = txtVal.value;
				if ( isNew )
					$(txtProp).css('border', '1px solid #FFF').focus();
				disable.prop = txtProp;
				disable._value = txtVal;
				this.newPropInc++;
			},
			/* method: checkKeys( obj, e ) */
			checkKeys: function ( obj, e ) {
				var keyID = document.all ? window.event.keyCode : e.keyCode;
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
						$(obj.currentObj).css(prop, obj.value);
						if ( prop == 'fontFamily' ) {
							if (this.ffInc < 0)
								this.ffInc = this.fontFamilies.length - 1;
							obj.value = this.fontFamilies[this.ffInc];
							$(obj.currentObj).css(prop, obj.value);
							this.ffInc--;
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
						$(obj.currentObj).css(prop, obj.value);
						if ( prop == 'fontFamily' ) {
							if (this.ffInc >= this.fontFamilies.length)
								this.ffInc = 0;
							obj.value = this.fontFamilies[this.ffInc];
							$(obj.currentObj).css(prop, obj.value);
							this.ffInc++;
						}
						break;
					}
					case 13: {
						if ( obj.currentObj ) {
							if ( obj.value != '' ) {
//								if ( $(obj.currentObj).css('cssText') ) {
//									var re = new RegExp(prop + ":\s.*[;]", 'gi');
//									var cssText = $(obj.currentObj).css('cssText').toLowerCase().replace(re, prop + ': ' + obj.value + ';');
//									$(obj.currentObj).css('cssText', cssText);
//								} else {
//									$(obj.currentObj).css('cssText', prop + ': ' + obj.value + ';');
//								}
								//alert(obj.currentObj.nodeName+"::"+prop+"::"+obj.value);
								//eval('obj.currentObj.style.' + prop + ' = "' + obj.value.replace(/\!important/gi, '') + '";');
								//if ( obj.value.indexOf('!important') != -1 )
									if ( $(obj.currentObj).css('cssText') ) {
										var re = new RegExp(prop + ":\s.*[;]", 'gi');
										var cssText = $(obj.currentObj).css('cssText').toLowerCase().replace(re, prop + ': ' + obj.value + ';');
										$(obj.currentObj).css('cssText', cssText);
									} else
										$(obj.currentObj).css('cssText', prop + ': ' + obj.value + ';');
								//else
								//	eval( 'obj.currentObj.style.' + prop + ' = \'' + obj.value + '\';' );
							}
							obj.style.border = 'none';
						}
						if ( obj.style.border.indexOf('none') != -1 || obj.style.border == '' ) {
							var wrap = document.getElementById(obj.parentWrapID);
							if ( wrap.lastChild.id == obj.parentID )
								this.createPropertyValueSet(wrap, obj, true, '', '', '', '', '', '', '', '', obj.objToCheck);
						}
						break;
					}
				}
				$(obj).css('width', 8 *  obj.value.length + 'px');
			},
			changeProperty: function ( obj ) {
				if ( obj.currentObj ) {
					if ( obj.value != '' && obj.sibling.value != '' ) {
						var prop = obj.sibling.value.replace(/\s/g, '');
						if ( prop.indexOf('-') != -1 ) {
							var pos = prop.indexOf('-');
							prop = prop.substring(0, pos) + prop.substring(pos + 1, pos + 2).toUpperCase() + prop.substring(pos + 2, prop.length);
						}
						if ( obj.value.indexOf('url(') != -1 ) {
							if ( $(obj.currentObj).css('cssText') ) {
								var re = new RegExp(prop + ":\s.*[;]", 'gi');
								var cssText = $(obj.currentObj).css('cssText').toLowerCase().replace(re, prop + ': ' + obj.img + ';');
								$(obj.currentObj).css('cssText', cssText);
							} else
								$(obj.currentObj).css('cssText', prop + ': ' + obj.img + ';');
							//$(obj.currentObj).css(prop, obj.img);
						} else {
							if ( $(obj.currentObj).css('cssText') ) {
								var re = new RegExp(prop + ":\s.*[;]", 'gi');
								var cssText = $(obj.currentObj).css('cssText').toLowerCase().replace(re, prop + ': ' + obj.value + ';');
								$(obj.currentObj).css('cssText', cssText);
							} else
								$(obj.currentObj).css('cssText', prop + ': ' + obj.value + ';');
							//$(obj.currentObj).css(prop, obj.value);
						}
					}
					obj.style.border = 'none';
				}
			},
			/* method: checkProperty( obj ) */
			checkProperty: function ( obj ) {
				obj.style.border = 'none';
				if ( obj.value == '' ) {
					$('#' + obj.parentID).remove();
					if ( this.ruleSet ) {
						for ( var h=0; h<this.ruleSet.length; h++ ) {
							if ( this.ruleSet[h] == undefined ) {
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
			checkValue: function ( obj ) {
				if ( obj.value != '' ) {
					var prop = obj.sibling.value.replace(/\s/g, '');
					if ( prop.indexOf('-') != -1 ) {
						var pos = prop.indexOf('-');
						prop = prop.substring(0, pos) + prop.substring(pos + 1, pos + 2).toUpperCase() + prop.substring(pos + 2, prop.length);
					}
					obj.style.border = 'none';
					if ( this.ruleSet ) {
						for ( var h=0; h<this.ruleSet.length; h++ ) {
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
			selectRange: function ( textbox, start, len ) {
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
			typeAhead: function ( textbox, str ) {
				if (textbox.createTextRange || textbox.setSelectionRange) {
					var iLen = textbox.value.length;
					textbox.value = str;
					this.selectRange(textbox, iLen, str.length);
				}
			},
			/* method: changeRuleProp( obj, e ) */
			changeRuleProp: function ( obj, e ) {
				var keyID = document.all ? window.event.keyCode : e.keyCode;
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
									this.typeAhead(obj, aryProps[i]);
									break;
								}
							}
						}
						break;
					}
				}
				$(obj).css('width', 6 * obj.value.length + 'px');
			},
			/* method: highlightMultiple( action, obj ) */
			highlightMultiple: function ( action, objs ) {
				var jsFirebug = this;
				switch ( action ) {
					case 'set': {
						$.each($(objs, opener.document), function () {
							this.bt = $(this).css('borderTop');
							this.br = $(this).css('borderRight');
							this.bb = $(this).css('borderBottom');
							this.bl = $(this).css('borderLeft');
							$(this).css('border', '1px solid #F00');
						});
						break;
					}
					case 'undo': {
						$.each($(objs, opener.document), function () {
 							$(this).css({
								borderTop: this.bt != undefined ? this.bt : 'none',
								borderRight: this.br != undefined ? this.br : 'none',
								borderBottom: this.bb != undefined ? this.bb : 'none',
								borderLeft: this.bl != undefined ? this.bl : 'none'
							});
						});
						break;
					}
				}
			},
			/* method: highlight( action, obj ) */
			highlight: function ( action, obj ) {
				switch ( action ) {
					case 'add': {
						var zi = this.getHighestZIndex() + 1;
						if ( zi <= 0 )
							zi = 10;
						$(this.highlightWrap).css({
							display	: 'block',
							width	: obj.offsetWidth + 'px',
							height	: obj.offsetHeight + 'px',
							zIndex	: zi
						});
						this.positionObjectToElement(obj, this.highlightWrap, 0, 0);
						break;
					}
					case 'remove': {
						$(this.highlightWrap).css('display', 'none');
						break;
					}
				}
			},
			/* method: disable( event, obj ) */
			disable: function ( event, obj ) {
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
									eval("obj.prop.currentObj.style.backgroundAttachment = '" + this.getDefaults(obj.prop.currentObj, 'background-attachment') + "';");
									eval("obj.prop.currentObj.style.backgroundColor = '" + this.getDefaults(obj.prop.currentObj, 'background-color') + "';");
									eval("obj.prop.currentObj.style.backgroundImage = '" + this.getDefaults(obj.prop.currentObj, 'background-image') + "';");
									eval("obj.prop.currentObj.style.backgroundPosition = '" + this.getDefaults(obj.prop.currentObj, 'background-position') + "';");
									eval("obj.prop.currentObj.style.backgroundRepeat = '" + this.getDefaults(obj.prop.currentObj, 'background-repeat') + "';");
									break;
								}
								case 'border': {
									eval("obj.prop.currentObj.style.borderBottomColor = '" + this.getDefaults(obj.prop.currentObj, 'border-bottom-color') + "';");
									eval("obj.prop.currentObj.style.borderBottomStyle = '" + this.getDefaults(obj.prop.currentObj, 'border-bottom-style') + "';");
									eval("obj.prop.currentObj.style.borderBottomWidth = '" + this.getDefaults(obj.prop.currentObj, 'border-bottom-width') + "';");
									eval("obj.prop.currentObj.style.borderCollapse = '" + this.getDefaults(obj.prop.currentObj, 'border-collapse') + "';");
									eval("obj.prop.currentObj.style.borderLeftColor = '" + this.getDefaults(obj.prop.currentObj, 'border-left-color') + "';");
									eval("obj.prop.currentObj.style.borderLeftStyle = '" + this.getDefaults(obj.prop.currentObj, 'border-left-style') + "';");
									eval("obj.prop.currentObj.style.borderLeftWidth = '" + this.getDefaults(obj.prop.currentObj, 'border-left-width') + "';");
									eval("obj.prop.currentObj.style.borderRightColor = '" + this.getDefaults(obj.prop.currentObj, 'border-right-color') + "';");
									eval("obj.prop.currentObj.style.borderRightStyle = '" + this.getDefaults(obj.prop.currentObj, 'border-right-style') + "';");
									eval("obj.prop.currentObj.style.borderRightWidth = '" + this.getDefaults(obj.prop.currentObj, 'border-right-width') + "';");
									eval("obj.prop.currentObj.style.borderSpacing = '" + this.getDefaults(obj.prop.currentObj, 'border-spacing') + "';");
									eval("obj.prop.currentObj.style.borderTopColor = '" + this.getDefaults(obj.prop.currentObj, 'border-top-color') + "';");
									eval("obj.prop.currentObj.style.borderTopStyle = '" + this.getDefaults(obj.prop.currentObj, 'border-top-style') + "';");
									eval("obj.prop.currentObj.style.borderTopWidth = '" + this.getDefaults(obj.prop.currentObj, 'border-top-width') + "';");
									break;
								}
								case 'border-bottom': {
									eval("obj.prop.currentObj.style.borderBottomColor = '" + this.getDefaults(obj.prop.currentObj, 'border-bottom-color') + "';");
									eval("obj.prop.currentObj.style.borderBottomStyle = '" + this.getDefaults(obj.prop.currentObj, 'border-bottom-style') + "';");
									eval("obj.prop.currentObj.style.borderBottomWidth = '" + this.getDefaults(obj.prop.currentObj, 'border-bottom-width') + "';");
									break;
								}
								case 'border-color': {
									eval("obj.prop.currentObj.style.borderBottomColor = '" + this.getDefaults(obj.prop.currentObj, 'border-bottom-color') + "';");
									eval("obj.prop.currentObj.style.borderLeftColor = '" + this.getDefaults(obj.prop.currentObj, 'border-left-color') + "';");
									eval("obj.prop.currentObj.style.borderRightColor = '" + this.getDefaults(obj.prop.currentObj, 'border-right-color') + "';");
									eval("obj.prop.currentObj.style.borderTopColor = '" + this.getDefaults(obj.prop.currentObj, 'border-top-color') + "';");
									break;
								}
								case 'border-left': {
									eval("obj.prop.currentObj.style.borderLeftColor = '" + this.getDefaults(obj.prop.currentObj, 'border-left-color') + "';");
									eval("obj.prop.currentObj.style.borderLeftStyle = '" + this.getDefaults(obj.prop.currentObj, 'border-left-style') + "';");
									eval("obj.prop.currentObj.style.borderLeftWidth = '" + this.getDefaults(obj.prop.currentObj, 'border-left-width') + "';");
									break;
								}
								case 'border-right': {
									eval("obj.prop.currentObj.style.borderRightColor = '" + this.getDefaults(obj.prop.currentObj, 'border-right-color') + "';");
									eval("obj.prop.currentObj.style.borderRightStyle = '" + this.getDefaults(obj.prop.currentObj, 'border-right-style') + "';");
									eval("obj.prop.currentObj.style.borderRightWidth = '" + this.getDefaults(obj.prop.currentObj, 'border-right-width') + "';");
									break;
								}
								case 'border-style': {
									eval("obj.prop.currentObj.style.borderBottomStyle = '" + this.getDefaults(obj.prop.currentObj, 'border-bottom-style') + "';");
									eval("obj.prop.currentObj.style.borderLeftStyle = '" + this.getDefaults(obj.prop.currentObj, 'border-left-style') + "';");
									eval("obj.prop.currentObj.style.borderRightStyle = '" + this.getDefaults(obj.prop.currentObj, 'border-right-style') + "';");
									eval("obj.prop.currentObj.style.borderTopStyle = '" + this.getDefaults(obj.prop.currentObj, 'border-top-style') + "';");
									break;
								}
								case 'border-top': {
									eval("obj.prop.currentObj.style.borderTopColor = '" + this.getDefaults(obj.prop.currentObj, 'border-top-color') + "';");
									eval("obj.prop.currentObj.style.borderTopStyle = '" + this.getDefaults(obj.prop.currentObj, 'border-top-style') + "';");
									eval("obj.prop.currentObj.style.borderTopWidth = '" + this.getDefaults(obj.prop.currentObj, 'border-top-width') + "';");
									break;
								}
								case 'border-width': {
									eval("obj.prop.currentObj.style.borderBottomWidth = '" + this.getDefaults(obj.prop.currentObj, 'border-bottom-width') + "';");
									eval("obj.prop.currentObj.style.borderLeftWidth = '" + this.getDefaults(obj.prop.currentObj, 'border-left-width') + "';");
									eval("obj.prop.currentObj.style.borderRightWidth = '" + this.getDefaults(obj.prop.currentObj, 'border-right-width') + "';");
									eval("obj.prop.currentObj.style.borderTopWidth = '" + this.getDefaults(obj.prop.currentObj, 'border-top-width') + "';");
									break;
								}
								case 'list-style': {
									eval("obj.prop.currentObj.style.listStyleImage = '" + this.getDefaults(obj.prop.currentObj, 'list-style-image') + "';");
									eval("obj.prop.currentObj.style.listStylePosition = '" + this.getDefaults(obj.prop.currentObj, 'list-style-position') + "';");
									eval("obj.prop.currentObj.style.listStyleType = '" + this.getDefaults(obj.prop.currentObj, 'list-style-type') + "';");
									break;
								}
								case 'font': {
									eval("obj.prop.currentObj.style.fontFamily = '" + this.getDefaults(obj.prop.currentObj, 'font-family') + "';");
									eval("obj.prop.currentObj.style.fontSize = '" + this.getDefaults(obj.prop.currentObj, 'font-size') + "';");
									eval("obj.prop.currentObj.style.fontSizeAdjust = '" + this.getDefaults(obj.prop.currentObj, 'font-size-adjust') + "';");
									eval("obj.prop.currentObj.style.fontStretch = '" + this.getDefaults(obj.prop.currentObj, 'font-stretch') + "';");
									eval("obj.prop.currentObj.style.fontStyle = '" + this.getDefaults(obj.prop.currentObj, 'font-style') + "';");
									eval("obj.prop.currentObj.style.fontVariant = '" + this.getDefaults(obj.prop.currentObj, 'font-variant') + "';");
									eval("obj.prop.currentObj.style.fontWeight = '" + this.getDefaults(obj.prop.currentObj, 'font-weight') + "';");
									break;
								}
								default:
									eval("obj.prop.currentObj.style." + this.convertCssProp(obj.prop.value) + " = '" + this.getDefaults(obj.prop.currentObj, obj.prop.value) + "';");
									break;
							}
							obj.prop.disabled = true;
							obj.prop.className = 'oPropertyDisabled';
							obj._value.disabled = true;
							obj._value.className = 'oValueDisabled';
						} else {
							obj.on = false;
							obj.className = 'disabled';
							eval("obj.prop.currentObj.style." + this.convertCssProp(obj.prop.value) + " = '" + obj.holdValue + "';");
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
			getDefaults: function ( obj, val ) {
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
			convertCssProp: function ( str ) {
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
			previewPopup: function ( obj, action, e ) {
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
						if ( obj.sibling.value.toString().indexOf('color') != -1 ) {
							$('#colorPreview', document.body)
								.css({
									background	: obj.value,
									left		: posx + 'px',
									top			: (posy + 20) + 'px',
									display		: 'block'
								});
						}
						switch ( obj.previewObj ) {
							case 'color': {
								$('#colorPreview', document.body)
									.css({
										background	: obj.value,
										left		: posx + 'px',
										top			: (posy + 20) + 'px',
										display		: 'block'
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
								$('#imagePreview', document.body)
									.css({
										display		: 'block',
										background	: '#FFF',
										width		: 'auto',
										height		: 'auto',
										left		: posx + 'px',
										top			: (posy + 20) + 'px'
									})
									.html('<p>' + ow + ' x ' + oh + '</p>')
									.prepend(img);
								break;
							}
						}
						break;
					}
					case 'remove': {
						$('#colorPreview, #imagePreview', document.body)
							.css('display', 'none')
							.html('');
						break;
					}
				}
			},
			/* method: positionObjectToElement( obj, element, offX, offY ) */
			positionObjectToElement: function ( obj, element, offX, offY ) {
				var coords = this.findPos(obj);
				element.style.left = coords[0] + offX + 'px';
				element.style.top = coords[1] + offY + 'px';
			},
			/* method: findPos( obj ) */
			findPos: function ( obj ) {
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
			compareNums: function (a, b) {
				return a - b;
			},
			/*
				function getHighestZIndex() - Returns the element on the page with the highest z-index
				Return Type: (int)
				Usage:
					var highZIndex = this.getHighestZIndex();
					document.getElementById('myID').style.zIndex = this.getHighestZindex() + 1;
			*/
			getHighestZIndex: function () {
				var allElements = document.getElementsByTagName('*');
				var mZindices = new Array();
				mZindices[0] = 0;
				for (var i=0; i<allElements.length; i++) {
					if (allElements[i].nodeType == 1) {
						if (document.all) { if (allElements[i].currentStyle) { mZIndex = allElements[i].currentStyle['zIndex']; if (!isNaN(mZIndex)) { mZindices.push(mZIndex); } } else if (window.getComputedStyle) { mZIndex = document.defaultView.getComputedStyle(allElements[i], null).getPropertyValue('zIndex'); if (!isNaN(mZIndex)) { mZindices.push(mZIndex); } }
						} else { if (allElements[i].currentStyle) { mZIndex = allElements[i].currentStyle['z-index']; if (!isNaN(mZIndex)) { mZindices.push(mZIndex); } } else if (window.getComputedStyle) { mZIndex = document.defaultView.getComputedStyle(allElements[i], null).getPropertyValue('z-index'); if (!isNaN(mZIndex)) { mZindices.push(mZIndex); } } }
					}
				}
				mZindices = mZindices.sort(this.compareNums);
				var highest = parseInt(mZindices[mZindices.length - 1]);
				if ( highest == 0 )
					highest = 100;
				return highest;
			},
			copy: function ( copyObj ) {
				eval("$.copy($('#htmlContext', document).get(0).obj." + copyObj + ");");
			}
		}
	});
	/* Object: jsFirebugWindow() */
	$.jsFirebugWindow = function () {
		this.init();
	};
	$.extend($.jsFirebugWindow, {
		prototype: {
			init: function () {
				var self = this;
				this.version = '2.0.3';
				this.title = 'JS Firebug v ' + this.version;
				this.windows = [];
				this.curScreen = null;
				$(document.body).json2HTML([{
					nodeName: 'div',
					attr: {id: 'jsfWrap'},
					append: [{
						nodeName: 'div',
						attr: {id: 'menuWrap'},
						append: [
							{ nodeName: 'span', addClass: 'menuBtn', id: 'btnStyle', html: 'Style', bind: "'mouseover mouseout', function () { $(this).toggleClass('menuBtnHi');}", click: function () { jsfbW.show('Style'); } },
							{ nodeName: 'span', addClass: 'menuBtn', id: 'btnCss', html: 'CSS', bind: "'mouseover mouseout', function () { $(this).toggleClass('menuBtnHi');}", click: function () { jsfbW.show('CSS'); } },
							{ nodeName: 'span', addClass: 'menuBtn', id: 'btnHtml', html: 'HTML', bind: "'mouseover mouseout', function () { $(this).toggleClass('menuBtnHi');}", click: function () { jsfbW.show('HTML'); } },
							{ nodeName: 'span', addClass: 'menuBtn', id: 'btnInfo', html: 'Info', bind: "'mouseover mouseout', function () { $(this).toggleClass('menuBtnHi');}", click: function () { jsfbW.show('Info'); } },
							{ nodeName: 'span', addClass: 'menuBtn', id: 'btnScript', html: 'Script', bind: "'mouseover mouseout', function () { $(this).toggleClass('menuBtnHi');}", click: function () { jsfbW.show('Script'); } },
							{ nodeName: 'span', addClass: 'menuBtn', id: 'btnColorCode', html: 'Visual', bind: "'mouseover mouseout', function () { $(this).toggleClass('menuBtnHi');}", click: function () { jsfbW.show('Visual'); } }
						]
					},
						{ nodeName: 'div', id: 'styleScreen', props: ['name="Style"'] },
						{ nodeName: 'div', id: 'cssScreen', props: ['name="CSS"'] },
						{ nodeName: 'div', id: 'htmlScreen', props: ['name="HTML"'] },
						{ nodeName: 'div', id: 'infoScreen', props: ['name="Info"'] },
						{ nodeName: 'div', id: 'scriptScreen', props: ['name="Script"'] },
						{ nodeName: 'div', id: 'colorCodeScreen', props: ['name="Visual"'] }
					]
				}
				]);
				this.jsfb = $('#jsfWrap').get(0);
				this.jsfbMenuWrap = $('#menuWrap').get(0);
				this.windows = [$('#styleScreen').get(0), $('#cssScreen').get(0), $('#htmlScreen').get(0), $('#infoScreen').get(0), $('#scriptScreen').get(0), $('#colorCodeScreen').get(0)];
				/* create the color preview wrap */
				$(this.jsfb).json2HTML([ { nodeName: 'div', id: 'colorPreview' } ]);
				/* create the image preview wrap */
				$(this.jsfb).json2HTML([ { nodeName: 'div', id: 'imagePreview' } ]);
				/* create the context menu for the CSS tab */
				$(this.jsfb).json2HTML([{
					nodeName: 'div',
					id: 'cssContext',
					append: [{
						nodeName: 'ul',
						append: [{
							nodeName: 'li',
							css: {textAlign: 'center'},
							append: [{ nodeName: 'a', attr: {href: 'javascript: $("#cssContext").css("display", "none"); void(0);'}, html: 'close' }]
						},{
							nodeName: 'li',
							append: [{ nodeName: 'a', attr: {href: 'javascript: $("#cssContext").css("display", "none"); void(0);'}, html: 'Formatted', click: function () { $.jsFirebug.getCSS(); } }]
						},{
							nodeName: 'li',
							append: [{ nodeName: 'a', attr: {href: 'javascript: $("#cssContext").css("display", "none"); void(0);'}, html: 'Compressed', click: function () { $.jsFirebug.getCSS(true); } }]
						}]
					}]
				}]);
				$('#cssScreen').showMenu({ query: '#cssContext' });
				/* create the context menu for the HTML tab */
				$(this.jsfb).json2HTML([{
					nodeName: 'div',
					id: 'htmlContext',
					append: [{
						nodeName: 'ul',
						append: [{
							nodeName: 'li',
							css: {textAlign: 'center'},
							append: [{ nodeName: 'a', attr: {href: 'javascript: document.getElementById("htmlContext").style.display="none"; void(0);'}, html: 'close' }]
						},{
							nodeName: 'li',
							append: [{ nodeName: 'a', attr: {href: 'javascript: document.getElementById("htmlContext").style.display="none"; void(0);'}, html: 'copy HTML', click: function () { $.jsFirebug.copy('htmlCB'); } }]
						},{
							nodeName: 'li',
							append: [{ nodeName: 'a', attr: {href: 'javascript: document.getElementById("htmlContext").style.display="none"; void(0);'}, html: 'copy innerHTML', click: function () { $.jsFirebug.copy('innerHTMLCB'); } }]
						}]
					}]
				}]);
				/* create the context menu for the Visual tab */
				$(this.jsfb).json2HTML([{
					nodeName: 'div',
					id: 'ccContext',
					append: [{
						nodeName: 'ul',
						append: [{
							nodeName: 'li',
							css: {textAlign: 'center'},
							append: [{ nodeName: 'a', attr: {href: 'javascript: document.getElementById("ccContext").style.display="none"; void(0);'}, html: 'close' }]
						},{
							nodeName: 'li',
							css: {textAlign: 'center'},
							append: [{ nodeName: 'a', id: 'btnShowCCKey', props: ['method="nodeName"'], attr: {href: 'javascript: document.getElementById("ccContext").style.display="none"; void(0);'}, html: 'show key/sub menu', click: function () { $.jsFirebug.showCCKey(this.method); } }]
						},{
							nodeName: 'li',
							css: {textAlign: 'center'},
							append: [{ nodeName: 'a', attr: {href: 'javascript: document.getElementById("ccContext").style.display="none"; void(0);'}, html: 'Color By Node Name (default)', click: function () { $.jsFirebug.getVisual('all[i].nodeName.toLowerCase()'); $('#btnShowCCKey').get(0).method = 'nodeName'; } }]
						},{
							nodeName: 'li',
							css: {textAlign: 'center'},
							append: [{ nodeName: 'a', attr: {href: 'javascript: document.getElementById("ccContext").style.display="none"; void(0);'}, html: 'Color By Display', click: function () { $.jsFirebug.getVisual('$(all[i]).css(\'display\')'); $('#btnShowCCKey').get(0).method = 'display'; } }]
						},{
							nodeName: 'li',
							css: {textAlign: 'center'},
							append: [{ nodeName: 'a', attr: {href: 'javascript: document.getElementById("ccContext").style.display="none"; void(0);'}, html: 'Color By Font Family', click: function () { $.jsFirebug.getVisual('$(all[i]).css(\'font-family\')'); $('#btnShowCCKey').get(0).method = 'font-family'; } }]
						},{
							nodeName: 'li',
							css: {textAlign: 'center'},
							append: [{ nodeName: 'a', attr: {href: 'javascript: document.getElementById("ccContext").style.display="none"; void(0);'}, html: 'Color By Class Name', click: function () { $.jsFirebug.getVisual('$(all[i]).attr(\'className\')'); $('#btnShowCCKey').get(0).method = 'className'; } }]
						}]
					}]
				}]);

				/* set the current output widow */
				this.curScreen = this.windows[0];
				this.adjustWindow();
			},
			createScreen: function ( btnText, btnID, screenID ) {
				$('#menuWrap').json2HTML( [{ nodeName: 'span', addClass: 'menuBtn', id: btnID, props: ['title="' + btnText + '"'], html: btnText, bind: "'mouseover mouseout', function () { $(this).toggleClass('menuBtnHi');}", click: function () { jsfbW.show(this.title); } }] );
				$('#jsfWrap').json2HTML( [{ nodeName: 'div', id: screenID ,props: ['name="' + btnText + '"'] }] );
				this.windows.push($('#' + screenID).get(0));
			},
			show: function ( scr ) {
				for ( var i=0; i<this.windows.length; i++ )
					$(this.windows[i]).hide();
				$(this.getWin(scr)).show();
			},
			changeTitle: function ( str ) {
				//$(this.jsfbTitle).html(this.title + str);
			},
			getWin: function ( scr ) {
				var win = null;
				$.each(this.windows, function (i) {
					if ( this.name == scr ) {
						win = this;
					}
				});
				this.curScreen = win;
				return win;
			},
			write: function (scr, str) {
				if ( !scr )
					return;
				$(this.getWin(scr))
					.html(str + '<br />')
					.get(0).scrollTop = $(this.getWin(scr)).get(0).scrollHeight;
			},
			json2HTML: function ( scr, obj ) {
				if ( !scr || !obj )
					return;
				$(this.getWin(scr)).json2HTML(obj);
			},
			append: function ( scr, obj ) {
				if ( !scr || !obj )
					return;
				$(this.getWin(scr)).append(obj);
			},
			clear: function (scr) {
				if (!scr)
					return;
				$(this.getWin(scr)).empty();
			},
			getWindowSize: function () {
				var w = 0, h = 0;
				if ( typeof( window.innerWidth ) == 'number' ) {
					/* Non-IE */
					w = window.innerWidth;
					h = window.innerHeight;
				} else if ( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
					/* IE 6+ in 'standards compliant mode' */
					w = document.documentElement.clientWidth;
					h = document.documentElement.clientHeight;
				} else if ( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
					/* IE 4 compatible */
					w = document.body.clientWidth;
					h = document.body.clientHeight - 18;
				}
				return [w, h];
			},
			adjustWindow: function () {
				var w = this.getWindowSize()[0];
				var h = this.getWindowSize()[1];
				$('#jsfWrap', document.body).css({
					width	: w + 'px',
					height	: h + 'px'
				});
				$.each(this.windows, function () {
					$(this).css({
						width	: (w - 5) + 'px',
						height	: h + 'px'
					});
				});
			}
		}
	});
	/* startup MAIN: */
//	/* create a "loading... please wait" screen */
//	var pleaseWait = document.createElement('div');
//	$(pleaseWait)
//		.attr('id', 'pleaseWait')
//		.html('<p class="appTitle">jsFirebug 2.0</p>loading... please wait');
//	$(document.body).append(pleaseWait);
	var jsfbW = new $.jsFirebugWindow();
	$.data(document.body, 'jsFirebugWindow', jsfbW);
	$(window).bind('resize', function () {
		jsfbW.adjustWindow();
	});
	$(window).bind('unload', function () {
		try {
			if ( opener.document.body )
				opener.location.reload(true);
		} catch(e) {}
	});
	/* now that the window has been created, let's startup jsFirebug */
	$.jsFirebug = new $.jsFirebug();
};

function getJSFirebug() {
	var jsFirebug = $.data(document.body, 'jsFirebug');
	jsFirebug.window = $.data(document.body, 'jsFirebugWindow');
	return jsFirebug;
};
