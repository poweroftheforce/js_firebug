/* since firebug was just loaded, it will be the last script tag on the page */
/* let's see if there are any plugins applied */
var jsfbPlugins = '';
var jsfbTmp = document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1].src;
if ( jsfbTmp.indexOf('plugins') != -1 ) {
	jsfbPlugins = '?' + jsfbTmp.substring(jsfbTmp.indexOf('plugins'), jsfbTmp.length);
}
jsfbWindow = null;
var jsfbDomain = 'http://10.69.68.72/CDEObjects/js_firebug/';
//var jsfbDomain = 'http://common.scrippsnetworks.com/common/js/jsfirebug/';
if ( jsfbWindow != null ) { jsfbWindow.window.close(); }
jsfbWindow = window.open('', 'jsFirebugWindow', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width=800,height=600');
if ( jsfbWindow != null ) {
var x = jsfbWindow.document.body.appendChild(jsfbWindow.document.createElement('script'));
x.type = 'text/javascript';
x.language = 'javascript';
x.src = jsfbDomain + 'jsfirebug_window.js' + jsfbPlugins;
} else { alert('Failed to load jsFirebug.\nIt appears that the window has been prevented from opening.\nYou might need to enable pop-up windows for ' + jsfbDomain + ' then restart jsFirebug.'); }

/* BOOKMARK CODE */
// javascript:void(lnkJSFW=document.body.appendChild(document.createElement('script')));void(lnkJSFW.language='javascript');void(lnkJSFW.type='text/javascript');void(lnkJSFW.src='http://common.scrippsnetworks.com/common/js/jsfirebug/js_firebug_start.js?plugins=http://common.scrippsnetworks.com/common/js/jsfirebug/js_firebug/sni.js');void(lnkJSFW.id='lnkJSFW');