let http_https = "";
let subdomain = "";
let url = window.location.href.split("?")[0];
if (url.indexOf("https://") === 0) {
	http_https = "https://";
} else if (url.indexOf("http://") === 0) {
	http_https = "http://";
}
if (url.indexOf(http_https + "www.") === 0) {
	subdomain = "www.";
}

/** Solitamente è lo stesso di config.php
 * 0 = DEV
 * 1 = TEST
 * 2 = DEMO
 * 3 = PROD
 */
let fl_prod = 0;

let statusbar_backgroundcolor = "#1976D2";
let utenti_chiavi = undefined; // true | false | undefined	// usato nel login

if (fl_prod === 0) {
	http_https	= http_https	? http_https	: "http://";
	subdomain	= subdomain		? subdomain		: "";
	url = "matteo.dev104.local/mergepdf/";
} else if (fl_prod === 1) {
	
} else if (fl_prod === 2) {
	
} else if (fl_prod === 3) {

}

url = http_https + subdomain + url;