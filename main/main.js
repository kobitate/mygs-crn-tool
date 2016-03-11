/* global chrome,Clipboard,console */
function getSetting(name, callback) {
	chrome.storage.sync.get(name, function(data) {
		callback(data);
	});
}

function setSetting(setting, callback) {
	chrome.storage.sync.set(setting, callback);
}

function loadWindow(show) {
	if ($("#crn-tool").length > 0) {
		$("#crn-tool").remove();
	}
	$.ajax({
		url: chrome.extension.getURL('main/main.html'),
		success: function(data) {
			$("body").append(data);
			$("#crn-tool").draggable({
				handle: "#crn-navbar"
			});
			
			$("#crn-options-launch").click(function() {
				$(this).toggleClass("active");
				$("#crn-options").toggleClass("active");
			});
			
			$("#crn-opt-clearall").click(function() {
				chrome.storage.sync.clear(function() {
					loadWindow(true);
				});
			});
			
			if (show) {
				$("#crn-tool").addClass("show");
			}
			
			getSetting("crns", function(data) {
				if (data.crns !== undefined) {
					var crns = data.crns.split(",");
					crns.forEach(function(crn) {
						var htmlString = '' +
							'<span class="btn crn-item" data-clipboard-text="'+ crn +'">' +
								'<i class="zmdi zmdi-copy"></i>&nbsp;' +
								'<span class="crn-num">'+ crn +'</span>' +
							'</span>';
						$("#crn-list").append(htmlString);
					});
					
					var clipboard = new Clipboard('.crn-item:not(#crn-add)');
					
					clipboard.on("success", function(e){
						$(e.trigger).addClass("copied");
						window.setTimeout(function() {
							$(e.trigger).removeClass("copied");
						}, 550);
					});
				}
			});
			
			$("#add-submit").click(function(){
				if ($("#crn-add input").val() === "") {
					return false;
				}
				
				getSetting("crns", function(data) {
					var newCRNString;
					if (data.crns !== undefined) {
						newCRNString = data.crns + "," + $("#crn-add input").val();
						newCRNString = newCRNString.replace(/(^\s*,)|(,\s*$)/g, '');
					}
					else {
						newCRNString = $("#crn-add input").val();
					}
					setSetting({
						crns: newCRNString
					}, function() {
						loadWindow(true);
					});
				});
			});
		}
	});
	getSetting("crns",function(data) {
		console.log(data);
	});
}

$(document).ready(function() {
	loadWindow(false);
});

