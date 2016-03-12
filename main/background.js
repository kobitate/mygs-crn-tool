/* global chrome */
chrome.runtime.onInstalled.addListener(function () {
    chrome.tabs.create({url: chrome.extension.getURL("install/index.html")});
});