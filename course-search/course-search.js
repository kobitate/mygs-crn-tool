/* global chrome */
function getSetting(name, callback) {
	chrome.storage.sync.get(name, function(data) {
		callback(data);
	});
}

function setSetting(setting, callback) {
	chrome.storage.sync.set(setting, callback);
}


$(document).ready(function() {
	
	var savedCRNs = [];
	
	getSetting("crns", function(data) {
		if (data.crns !== undefined && data.crns !== "") {
			savedCRNs = data.crns.split(',');
		}
		$("#search_results tr").each(function() {
			var crnColumn = $(this).find("td:first");
			var thisCRN = crnColumn.text();
			var colorClass = "btn-white";
			if (savedCRNs.indexOf(thisCRN) > -1) {
				colorClass = "btn-success";
			}
			crnColumn.append('' +
				'<div class="btn '+ colorClass +' btn-sm add-btn" data-crn="'+ thisCRN +'">+</div>'
			);
		});
		
		if ($("#single_detail").length > 0) {
			var pTag = $("#single_detail p:first");
			var thisCRN = pTag.text().split(" ");
			thisCRN = thisCRN[thisCRN.length - 1];
			var colorClass = "btn-white";
			if (savedCRNs.indexOf(thisCRN) > -1) {
				colorClass = "btn-success";
			}
			pTag.append('' +
				'<br /><div class="btn '+ colorClass +' add-btn" data-crn="'+ thisCRN +'">+ Add to CRN Tool</div>'
			);
		}
		
		$(".add-btn.btn-sm").mouseover(function(){
			$(this).text("+ Add to CRN Tool");
		});
		
		$(".add-btn.btn-sm").mouseout(function(){
			$(this).text("+");
		});
		
		$(".add-btn").click(function(){
			var newCRN = $(this).data("crn");
			var btn = $(this);
			if (!btn.hasClass("btn-success")) {
				getSetting("crns", function(data) {
					var newCRNString;
					if (data.crns !== undefined) {
						newCRNString = data.crns + "," + newCRN;
						newCRNString = newCRNString.replace(/(^\s*,)|(,\s*$)/g, '');
					}
					else {
						newCRNString = newCRN;
					}
					setSetting({
						crns: newCRNString
					}, function() {
						btn.removeClass("btn-white").addClass("btn-success");
					});
				});
			}
		});
	});
	
	
	
});