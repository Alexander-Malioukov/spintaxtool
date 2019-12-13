
var itemsSeparator = ", ",
	minNbItems = 2,
	maxNbItems = 7;

function initForm() {
	handleCopyToClipboardEvent();
	resetForm();
}

function handleCopyToClipboardEvent() {
	$("body").on("copy", "#copy-clipboard-btn", function(e) {
		var textToCopy = $('#' + $(this).data('id-element-to-copy')).val();
		e.clipboardData.clearData();
		e.clipboardData.setData("text/plain", textToCopy);
		e.preventDefault();
		MyUtils.displayInfoMessage('success', "Votre texte a été copié dans le presse-papiers.");
	});
}

function resetForm() {
	$('#items-list').val('');
	$('#et-ou-before-last-element').prop('checked', true);
	$('#randomly-hide-elements').prop('checked', true);
	$('#div-items-permutations').hide();
	$('#div-info-message').hide();
	$('#items-list').focus();
}

function submitForm() {
	var itemsList = $('#items-list').val().trim(), 
		isFirstUpperCase = itemsList.isFirstUpperCase(),
		finalPonctuation = "",
		aItems = [], 
		aPermutedItems, 
		itemsPermutationsSpintax = "";
	
	if ( !itemsList ) {
		MyUtils.displayInfoMessage('warning', "Veuillez saisir une liste d'éléments.");
		$('#items-list').focus();
		return;
	}
	
	var itemsListLastChar = itemsList.charAt(itemsList.length - 1);
	if ( $.inArray(itemsListLastChar, [".", ";", ":", "!", "?"]) >= 0 ) {
		itemsList = itemsList.substring(0, itemsList.length - 1).trim();
		finalPonctuation = itemsListLastChar;
	}

	var etouBeforeLastElement = $('#et-ou-before-last-element').is(':checked');
	if ( etouBeforeLastElement ) {
		var i, coordinatingConjunction = "";
		if ( itemsList.lastIndexOf(" et ") != -1 ) {
			i = itemsList.lastIndexOf(" et ");
			coordinatingConjunction = "et";
		}
		else {
			i = itemsList.lastIndexOf(" ou ");
			coordinatingConjunction = "ou";
		}
		var expr1 = itemsList.substring(0, i);
		var expr2 = itemsList.substring(i+4);
		aItems = aItems.concat(expr1.split(itemsSeparator));
		if ( expr2 !== undefined && expr2 ) {
			aItems.push(expr2);
		}
	}
	else {
		aItems = itemsList.split(itemsSeparator);
	}
	
	if ( !aItems.length || aItems.length < minNbItems ) {
		MyUtils.displayInfoMessage('warning', "Veuillez saisir une liste d'au moins " + minNbItems + " éléments.");
		$('#items-list').focus();
		return;
	}
	if ( aItems.length > maxNbItems ) {
		MyUtils.displayInfoMessage('warning', "Veuillez saisir au plus " + maxNbItems + " éléments.");
		$('#items-list').focus();
		return;
	}
	
	var randomlyHideElements = $('#randomly-hide-elements').is(':checked');
	aPermutedItems = permuteItems(aItems);
	
	// JSI : BEG client code
//	$.each(aPermutedItems, function(index, aValue) {
//		if ( isFirstUpperCase ) {
//			takeFirstLetterIntoAccount(aValue);
//		}
//		itemsPermutationsSpintax += ( !itemsPermutationsSpintax ? "" : "|" ) + buildSpintaxElement(aValue, coordinatingConjunction, randomlyHideElements, finalPonctuation);
//	});
//	$('#items-permutations').val("{" + itemsPermutationsSpintax + "}");
	// JSI : END client code
	
	// JSI : BEG server code
	$('#items-permutations').val("");
	MyUtils.showProcessingMessage();
	setTimeout(function() {
		$.each(aPermutedItems, function(index, aValue) {
//			MyUtils.updateProcessingMessage("Génération de l'élément " + parseInt(index+1) + " sur " + aPermutedItems.length);
			if ( isFirstUpperCase ) {
				takeFirstLetterIntoAccount(aValue);
			}
			ajaxBuildSpintaxElement(index+1, aPermutedItems.length, aValue, coordinatingConjunction, randomlyHideElements, finalPonctuation);
		});
		$('#items-permutations').val("{" + $('#items-permutations').val() + "}");
		MyUtils.hideProcessingMessage();
	}, 400);
	// JSI : END server code
	
	$('#div-items-permutations').show(function() {
		MyUtils.displayInfoMessage('success', "La permutation a été générée.");
		$('#items-permutations').select().focus();
	});
}

function ajaxBuildSpintaxElement(noCurItem, nbTotalItems, aItems, coordinatingConjunction, randomlyHideElements, finalPonctuation) {
//	MyUtils.updateProcessingMessage("Génération de l'élément " + noCurItem + " sur " + nbTotalItems);
	$.ajax({
		url: "php/ajax/build-spintax-element.php",
		type: 'POST',
		async: false,
		data: { 
			aItems: aItems,
			coordinatingConjunction: coordinatingConjunction,
			randomlyHideElements: ( randomlyHideElements ? 1 : 0),
			finalPonctuation: finalPonctuation,
			itemsSeparator: itemsSeparator
		},
		success: function(jsonResponse) {
			if (!jsonResponse.success) {
				MyUtils.displayInfoMessage('error', "Action impossible : " + jsonResponse.message);
			}
			else {
				var itemsPermutations = $('#items-permutations').val();
				itemsPermutations += ( !itemsPermutations ? "" : "|" ) + jsonResponse.spintaxElt;
				$('#items-permutations').val(itemsPermutations);
			}
		},
		error: function(request, error) {
			showServerErrorNotification(request);
		}
	});
}

function buildSpintaxElement(aItems, coordinatingConjunction, randomlyHideElements, finalPonctuation) {
	var result = "";
	var lastElement = aItems.pop();
	if ( randomlyHideElements && aItems.length >= 2 ) {
		result += aItems.shift();
		$.each(aItems, function(index, value) {
			result += '{|||||' + itemsSeparator + value + '}';
		});
	}
	else {
		result += aItems.join(itemsSeparator);
	}
	
	result += ( coordinatingConjunction ? " " + coordinatingConjunction + " " : itemsSeparator ) + lastElement;
	
	if ( finalPonctuation ) {
		result += ( finalPonctuation != "." ? " " : "" ) + finalPonctuation;
	}
	
	return result;
}

function permuteItems(aItems, usedChars, permArr) {
	if (permArr === undefined) {
		var permArr = [];
	}
	if (usedChars === undefined) {
		var usedChars = [];
	}
	var i, ch;
	for (i = 0; i < aItems.length; i++) {
		ch = aItems.splice(i, 1)[0];
		usedChars.push(ch);
		if (aItems.length == 0) {
			permArr.push(usedChars.slice());
		}
		permuteItems(aItems, usedChars, permArr);
		aItems.splice(i, 0, ch);
		usedChars.pop();
	}
	return permArr;
};

function takeFirstLetterIntoAccount(aItems) {
	$.each(aItems, function(i,v) {
		aItems[i] = ( !i ? v.ucFirst() : v.lcFirst() );
	});
}

