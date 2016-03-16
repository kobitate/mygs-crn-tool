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
			'<input type="checkbox" name="select-crn" id="select-crn-'+crn+'" />&nbsp;' +
			'<label for="select-crn-'+crn+'"><span class="crn-num">'+ crn +'</span></label>' +
		'</span>';
	$("#crn-list").append(htmlString);
}

function deleteCRNs(toDelete) {
	if (!(toDelete instanceof Array)) {
		toDelete = toDelete.split(",");
	}
	getSetting("crns", function(data) {
		if (data.crns !== undefined) {
		var currentCRNs = data.crns.split(",");
		var buttonsToRemove = [];
			toDelete.forEach(function(deleteCRN){
				var itemIndex = currentCRNs.indexOf(deleteCRN + "");
				if (itemIndex > -1) {
					currentCRNs.splice(itemIndex, 1);
					buttonsToRemove.push($(".crn-item[data-crn=" + deleteCRN + "]"));
				}
				var newCRNs = currentCRNs.join();
				setSetting({
					crns: newCRNs
				},function(){
					buttonsToRemove.forEach(function(btn) {
						btn.remove();
					});
				});
			});
		}
	});
}

$(document).ready(function() {
	getSetting("crns", function(data) {
		if (data.crns !== undefined) {
			var crns = data.crns.split(",");
			crns.forEach(function(crn) {
				makeCRNButton(crn);
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
				makeCRNButton($("#crn-add input").val());
				$("#crn-add input").val('');
			});
		});
	});
	$("#delete-selected").click(function(){
		var toDelete = [];
		$("#add-crns input:checked").each(function(){
			toDelete.push($(this).closest(".crn-item").data("crn") + "");
		});
		deleteCRNs(toDelete);
	});
	$("#select-all").click(function() {
		$("#add-crns input").not(":checked").each(function(){
			$(this).prop('checked', true);
		});
	});
});