(function(jsFirebug) {
	$.fn.objSniffer = function( obj, name, container ) {
		switch ( typeof obj ) {
			case 'object': {
				if ( $.isFunction(obj) ) {
					var func = obj.toString();
					var str_funcName = func.substring(0, func.indexOf('{') - 1);
					var str_return = func.match(/return.*?;/gi) != null ? func.match(/return.*?;/gi) : '';
					$(container).json2HTML( [{
						nodeName: 'div',
						css: { 'margin-left': '15px' },
						html: '<span class="OBJ_function-value-name">' + str_funcName + '</span>&nbsp;<span class="OBJ_function-value-return">' + str_return + '</span>'
					}] );
					break;
				}
				for ( x in obj ) {
					switch ( typeof obj[x] ) {
						case 'object': {
							if ( $.isFunction(obj[x]) ) {
								var func = obj[x].toString();
								var str_funcName = func.substring(0, func.indexOf('{') - 1);
								var str_return = func.match(/return.*?;/gi) != null ? func.match(/return.*?;/gi) : '';
								$(container).json2HTML( [{
									nodeName: 'div',
									css: { 'margin-left': '15px' },
									html: '<span class="OBJ_function-name">' + x + '</span>: <span class="OBJ_function-value-name">' + str_funcName + '</span>&nbsp;<span class="OBJ_function-value-return">' + str_return + '</span>'
								}] );
								break;
							}
							$(container).json2HTML( [{
								nodeName: 'div',
								addClass: 'OBJ-object',
								id: name.replace(/\./gi, '-') + '-' + x,
								css: { 'margin-left': '15px' },
								props: ['htmlText="' + x + '"'],
								html: '<span id="ES_' + name.replace(/\./gi, '-') + '-' + x + '" style="padding-left: 7px;" class="expandSign">-&nbsp;' + x + '</span>'
							}] );
							$('#ES_' + name.replace(/\./gi, '-') + '-' + x)
								.click(function() {
									for ( var i=0; i<this.parentNode.childNodes.length; i++ ) {
										if ( this.parentNode.childNodes[i].nodeType == 1 ) {
											if ( this.parentNode.childNodes[i].tagName.toLowerCase() == 'div' ) {
												$(this.parentNode.childNodes[i]).toggle();
											}
										}
									}
									if ( $(this).html().toString().indexOf('+') != -1 )
										$(this).html('-' + $(this).html().substring(1, $(this).html().length));
									else
										$(this).html('+' + $(this).html().substring(1, $(this).html().length));
								});
							if ( $(eval(name)).get(0) )
								if ( $(eval(name)).get(0).nodeType != 1 )
									$.fn.objSniffer(eval(name + '.' + x), name + '.' + x, '#' + name.replace(/\./gi, '-') + '-' + x);
							break;
						}
						case 'function': {
							var func = obj[x].toString();
							var str_funcName = func.substring(0, func.indexOf('{') - 1);
							var str_return = func.match(/return.*?;/gi) != null ? func.match(/return.*?;/gi) : '';
							$(container).json2HTML( [{
								nodeName: 'div',
								css: { 'margin-left': '15px' },
								html: '<span class="OBJ_function-name">' + x + '</span>: <span class="OBJ_function-value-name">' + str_funcName + '</span>&nbsp;<span class="OBJ_function-value-return">' + str_return + '</span>'
							}] );
							break;
						}
						case 'number': { $(container).json2HTML( [{ nodeName: 'div', css: { 'margin-left': '15px' }, html: '<span class="OBJ_num-name">' + x + '</span>: <span class="OBJ_num-value">' + obj[x] + '</span>' }] ); break; }
						case 'string': { $(container).json2HTML( [{ nodeName: 'div', css: { 'margin-left': '15px' }, html: '<span class="OBJ_string-name">' + x + '</span>: <span class="OBJ_string-value">' + obj[x] + '</span>' }] ); break; }
						case 'boolean': { $(container).json2HTML( [{ nodeName: 'div', css: { 'margin-left': '15px' }, html: '<span class="OBJ_boolean-name">' + x + '</span>: <span class="OBJ_boolean-value">' + obj[x] + '</span>' }] ); break; }
						default: { $(container).json2HTML( [{ nodeName: 'div', css: { 'margin-left': '15px' }, html: typeof x }] ); break; }
					}
				}
				break;
			}
			case 'function': {
				var func = obj.toString();
				var str_funcName = func.substring(0, func.indexOf('{') - 1);
				var str_return = func.match(/return.*?;/gi) != null ? func.match(/return.*?;/gi) : '';
				$(container).json2HTML( [{
					nodeName: 'div',
					css: { 'margin-left': '15px' },
					html: '<span class="OBJ_function-value-name">' + str_funcName + '</span>&nbsp;<span class="OBJ_function-value-return">' + str_return + '</span>'
				}] );
				break;
			}
			case 'number': { $(container).json2HTML( [{ nodeName: 'div', css: { 'margin-left': '15px' }, html: '<span class="OBJ_num-name">' + obj + '[' + typeof obj + ']' + '</span>: <span class="OBJ_num-value">' + obj + '</span>' }] ); break; }
			case 'string': { $(container).json2HTML( [{ nodeName: 'div', css: { 'margin-left': '15px' }, html: '<span class="OBJ_string-name">' + obj + '[' + typeof obj + ']' + '</span>: <span class="OBJ_string-value">' + obj + '</span>' }] ); break; }
			case 'boolean': { $(container).json2HTML( [{ nodeName: 'div', css: { 'margin-left': '15px' }, html: '<span class="OBJ_boolean-name">' + obj + '[' + typeof obj + ']' + '</span>: <span class="OBJ_boolean-value">' + obj + '</span>' }] ); break; }
			default: { $(container).json2HTML( [{ nodeName: 'div', css: { 'margin-left': '15px' }, html: typeof obj }] ); break; }
		}
	};
	$.fn.getObject = function( obj, name, container, wrapID, startText ) {
		var wrap = [{ nodeName: 'div', addClass: 'OBJ-object', id: container, html: '<span id="ES_' + wrapID + '" style="padding-left: 7px;" class="expandSign">-&nbsp;' + startText + '</span>' }];
		$('#' + wrapID).json2HTML( wrap );
		this.objSniffer( obj, name, '#' + container );
	};
	/* START */
	jsFirebug.window.createScreen('SNI Tools', 'btnSNITools', 'sniToolsScreen');
	/* see if we can get the mdManager stuff */
	if ( opener.mdManager ) {
		jsFirebug.window.json2HTML('SNI Tools', [{ nodeName: 'div', id: 'mdmWrap' }]);
		var str = '', aryMdManager = ['Url', 'Title', 'Keywords', 'Site', 'DetailId', 'SctnId', 'CategoryDspName', 'Classification', 'SctnDspName', 'Sponsorship', 'Type', 'UniqueId'];
		for ( var i=0; i<aryMdManager.length; i++ ) {
			var val = opener.mdManager.getParameter(aryMdManager[i]);
			$('#mdmWrap').json2HTML( [{ nodeName: 'h2', html: '<strong>' + aryMdManager[i] + '</strong>: <span class="' + aryMdManager[i] + '">' + val + '</span>'}] );
		}
		$('#mdmWrap').json2HTML( [{ nodeName: 'h2', html: 'mdManager [Object] detected: listing mdManager' }] );
		$.fn.getObject(opener.mdManager, 'opener.mdManager', 'jsfb_mdmWrapLibWrap', 'mdmWrap', 'mdManager [Object]');
	}
	/* look for deconcept overall */
	if ( opener.deconcept ) {
		jsFirebug.window.json2HTML('SNI Tools', [{ nodeName: 'div', id: 'deconceptWrap' }]);
		$('#deconceptWrap').json2HTML( [{ nodeName: 'h2', html: 'deconcept [Object] detected: listing deconcept' }] );
		$.fn.getObject(opener.deconcept, 'opener.deconcept', 'jsfb_deconceptLibWrap', 'deconceptWrap', 'deconcept [Object]');
	}
	/* see if swfObject exists */
	if ( opener.SWFObject ) {
		jsFirebug.window.json2HTML('SNI Tools', [{ nodeName: 'div', id: 'SWFObjectWrap' }]);
		$('#SWFObjectWrap').json2HTML( [{ nodeName: 'h2', html: 'SWFObject [Object] detected: listing SWFObject' }] );
		$.fn.getObject(opener.SWFObject, 'opener.SWFObject', 'jsfb_SWFObjectLibWrap', 'SWFObjectWrap', 'SWFObject [function]');
	}
	/* looking for swfobject [function] */
	if ( opener.swfobject ) {
		jsFirebug.window.json2HTML('SNI Tools', [{ nodeName: 'div', id: 'swfobjectWrap' }]);
		var flashVersion = opener.swfobject.getFlashPlayerVersion();
		flashVersion = flashVersion.major + '.' + flashVersion.minor + '.' + flashVersion.release;
		$('#swfobjectWrap').json2HTML( [{ nodeName: 'p', html: '<strong>Flash Version</strong>: ' + flashVersion }] );
		$('#swfobjectWrap').json2HTML( [{ nodeName: 'h2', html: 'swfobject [function] detected: listing swfobject' }] );
		$.fn.getObject(opener.swfobject, 'opener.swfobject', 'jsfb_swfobjectLibWrap', 'swfobjectWrap', 'swfobject [function]');
	}
	/* see if jQuery is on board */
	if ( opener.jQuery ) {
		jsFirebug.window.json2HTML('SNI Tools', [{ nodeName: 'div', id: 'jQueryWrap' }]);
		$('#jQueryWrap').json2HTML( [{ nodeName: 'h2', html: 'jQuery [function] detected: listing jQuery.fn' }] );
		$('#jQueryWrap').json2HTML( [{ nodeName: 'p', html: '<strong>jQuery Version: </strong>' + opener.jQuery.prototype.jquery }] );
		$.fn.getObject(opener.jQuery.fn, 'opener.jQuery.fn', 'jsfb_jQueryLibWrap', 'jQueryWrap', 'jQuery [function]');
	}	
	/* does SNI [Object] exists (?) */
	if ( opener.SNI ) {
		jsFirebug.window.json2HTML('SNI Tools', [{ nodeName: 'div', id: 'SNIWrap' }]);
		$('#SNIWrap').json2HTML( [{ nodeName: 'h2', html: 'SNI [Object] detected: listing SNI' }] );
		$.fn.getObject(opener.SNI, 'opener.SNI', 'jsfb_SNILibWrap', 'SNIWrap', 'SNI [Object]');
	}
	/* toolsWrap */
	/*
	jsFirebug.window.json2HTML('SNI Tools', [{ nodeName: 'div', id: 'toolsWrap' }]);
	$('#toolsWrap').json2HTML( [{ nodeName: 'h2', html: 'Right click on Full Page Preview in Jitterbug, copy the shortcut and paste into here and click on Get URL from Jitterbug.' }] );
	$('#toolsWrap').json2HTML( [{ nodeName: 'input', attr: { type: 'text', id: 'txtURLFromJitterbug' } }] );
	$('#toolsWrap').json2HTML( [{
		nodeName: 'input',
		attr: { type: 'button', id: 'btnGetURLFromJitterbug', value: 'Get URL from Jitterbug' },
		click: function() {
			function getP( p, s ) {
				var q = document.location.search || document.location.hash;
				if ( s )
					q = s;
				if ( q.indexOf('?') != -1 )
					q = q.split('?')[1];
				if ( p == null )
					return q;
				if ( q ) {
					if ( q.indexOf('&') != -1 ) {
						var nv = q.split('&');
						for ( var i=0; i<nv.length; i++ )
							if ( nv[i].indexOf('=') != -1 )
								if ( nv[i].split('=')[0] == p )
									return unescape(nv[i].split('=')[1]);
					}
				}
				return '';
			};
			var s = $('#txtURLFromJitterbug').val();
			if ( s != '' ) {
				if ( s.indexOf('full_page_preview') != -1 )
					s = s.substring(s.indexOf('full_page_preview') + 19, s.length - 2);
				var site = 'hgtv';
				var url = s.split('?')[0];
				site = s.indexOf('hgtv') != -1 ? 'hgtv' : 'foodnetwork';
				var t = url.indexOf('HGTV_') != -1 ? url.substring(url.lastIndexOf('/') + 1, url.indexOf('HGTV_')) : url.substring(url.lastIndexOf('/') + 1, url.indexOf('FOOD_'));
				var newURL = 'http://www.' + site + '.com' + url.replace('preview', getP('PathSctnName', s).toLowerCase() + '/' + getP('PathCtntType', s).toLowerCase()).replace(t,'0,,');
				$('#URLFromJitterbugResult')
					.html(newURL)
					.click(function() {
						opener.open(newURL);
						return false;
					});
			}
		}
	}]);
	$('#toolsWrap').json2HTML( [{ nodeName: 'h2', html: 'live url below, click to open in parent browser - new window &raquo;' }] );
	$('#toolsWrap').json2HTML( [{ nodeName: 'p', attr: { id: 'URLFromJitterbugResult' } }] );
	*/
	/* handle click for parent [Object] expand signs */
	$('#ES_mdmWrap, #ES_deconceptWrap, #ES_SWFObjectWrap, #ES_swfobjectWrap, #ES_jQueryWrap, #ES_SNIWrap')
		.click(function() {
			for ( var i=0; i<this.parentNode.childNodes.length; i++ ) {
				if ( this.parentNode.childNodes[i].nodeType == 1 ) {
					if ( this.parentNode.childNodes[i].tagName.toLowerCase() == 'div' ) {
						$(this.parentNode.childNodes[i]).toggle();
					}
				}
			}
			if ( $(this).html().toString().indexOf('+') != -1 )
				$(this).html('-' + $(this).html().substring(1, $(this).html().length));
			else
				$(this).html('+' + $(this).html().substring(1, $(this).html().length));
		});
	/* collapse all expand/unexpand signs */
	$('.expandSign').click();
	$(window).resize();
})(getJSFirebug());