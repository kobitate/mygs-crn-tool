/* global chrome */

function getSetting(name, callback) {
	chrome.storage.sync.get(name, function(data) {
		callback(data);
	});
}

function setSetting(setting, callback) {
	chrome.storage.sync.set(setting, callback);
}

function makeCRNButton(crn) {
	if (crn === "") {
		return false;
	}
	var htmlString = '' +
		'<span class="btn crn-item" data-crn="'+ crn +'">' +
			'<i class="zmdi zmdi-delete"></i>&nbsp;' +
			'<span class="crn-num">'+ crn +'</span>' +
		'</span>';
	$("#crn-list").append(htmlString);
}

function crnItemClick() {
	$(".crn-item").unbind("click");
	$(".crn-item").click(function() {
		var removeCRN = $(this).data("crn");
		var theButton = $(this);
		getSetting("crns", function(data) {
			if (data.crns !== undefined) {
				var currentCRNs = data.crns.split(",");
				var itemIndex = currentCRNs.indexOf(removeCRN + "");
				if (itemIndex > -1) {
					currentCRNs.splice(itemIndex, 1);
				}
				var newCRNs = currentCRNs.join();
				setSetting({
					crns: newCRNs
				}, function() {
					crnItemClick();
					theButton.remove();
				});
			}
		});
	});
}

$(document).ready(function() {
	getSetting("crns", function(data) {
		if (data.crns !== undefined) {
			var crns = data.crns.split(",");
			crns.forEach(function(crn) {
				makeCRNButton(crn);
			});
			crnItemClick();
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
				makeCRNButton($("#crn-add input").val());
				$("#crn-add input").val('');
				crnItemClick();
			});
		});
	});
	$("#clear-all").click(function() {
		$("#dialog-confirm-crn-clear").addClass("show");
	});
	$("#dialog-confirm-crn-clear .dialog-yes").click(function() {
		chrome.storage.sync.clear(function(){
			$("#crn-list").empty();
			$("#dialog-confirm-crn-clear").removeClass("show");
		});
	});
	$("#dialog-confirm-crn-clear .dialog-no").click(function() {
		$("#dialog-confirm-crn-clear").removeClass("show");
	});
});