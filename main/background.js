/* global chrome,confirm */
chrome.browserAction.onClicked.addListener(function () {
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
	    var url = tabs[0].url;
		var tab = tabs[0];
		if (url.indexOf("wings.georgiasouthern.edu") > -1) {
			chrome.tabs.executeScript(tab.id, {
				code: '$("#crn-tool").toggleClass("show");'
			});
		}
		else {
			var conf = confirm(
				"CRN Tool is inteded to be run inside WINGS. Would you like to " +
				"go to MyGeorgiaSouthern now to log in?"
			);
			if (conf) {
				chrome.tabs.update(tab.id, {url: "https://my.georgiasouthern.edu"});
			}
		}
	});
});

chrome.runtime.onInstalled.addListener(function () {
    chrome.tabs.create({url: chrome.extension.getURL("install/index.html")});
});