
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
		MyUtils.displayInfoMessage('success', MySpeech.get("message.success.text_copied_to_clipboard"));
	});
}

function resetForm() {
	hideHelp();
	$('#items-list').val('');
	$('#et-ou-before-last-element').prop('checked', true);
	$('#elements-case-policy option').first().prop('selected', true);
	$('#randomly-hide-elements').prop('checked', true);
	$('#div-items-permutations').hide();
	enablePermuteButton();
	$('#items-list').focus();
}

function submitForm() {
	var itemsList = $('#items-list').val().trim(),
		itemsListLastChar = itemsList.charAt(itemsList.length - 1),
		finalPonctuation = "",
		aItems = [], 
		etouBeforeLastElement = $('#et-ou-before-last-element').is(':checked'),
		randomlyHideElements = $('#randomly-hide-elements').is(':checked'),
		oConjunction;
	
	if ( !itemsList ) {
		MyUtils.displayInfoMessage('warning', MySpeech.get("message.warning.please_enter_elements_list"));
		$('#items-list').focus();
		return;
	}
	
	if ( $.inArray(itemsListLastChar, [".", ";", ":", "!", "?"]) >= 0 ) {
		itemsList = itemsList.substring(0, itemsList.length - 1).trim();
		finalPonctuation = itemsListLastChar;
	}
	oConjunction = searchForConjunction(itemsList);
	
	if ( etouBeforeLastElement && !oConjunction ) {
		MyUtils.displayInfoMessage('warning', MySpeech.get("message.warning.no_conjunction_found"));
		$('#items-list').focus();
		return;
	}
	if ( !etouBeforeLastElement && oConjunction ) {
		MyUtils.displayInfoMessage('warning', MySpeech.get("message.warning.conjunction_found"));
		$('#items-list').focus();
		return;
	}
	
	aItems = getArrayElementsToBePermuted(itemsList, oConjunction);
	if ( !aItems.length || aItems.length < minNbItems) {
		MyUtils.displayInfoMessage('warning', MySpeech.get("message.warning.min_number_of_elements") + minNbItems);
		$('#items-list').focus();
		return;
	}
	if ( aItems.length > maxNbItems ) {
		MyUtils.displayInfoMessage('warning', MySpeech.get("message.warning.max_number_of_elements") + maxNbItems);
		$('#items-list').focus();
		return;
	}

	disablePermuteButton();
	ajaxBuildSpintaxElementForPermutationsList(
		aItems, 
		( oConjunction ? oConjunction.conjunction : "" ), 
		randomlyHideElements, 
		finalPonctuation
	);
}

/**
 * @deprecated
 * @param	{string} text : may contain spintax grammar (ie. { | } characters)
 * @return	{boolean}
 */
function isElementUpperCase(text, result) {
	var spintaxDetected = /[{\|}]/g.test(text),
		text = text.trim();
	
	if ( !spintaxDetected || text[0] != '{' ) {
		return text.isFirstUpperCase();
	}
	
	var oRegexp = new RegExp("[^{|}]+", "g"), // JSI : essayer plutôt avec cette regexp : [^|]+
		match,
		result = true;
	while ( match = oRegexp.exec(text) ) {
		console.log(match[0]); // JSI
		result = result && match[0].isFirstUpperCase();
	}
	
	return result
}

/**
 * @deprecated
 * @param spintax
 * @param char
 * @param charDepth
 * @returns {Array}
 */
function getCharIndexesByDepth(spintax, char, charDepth) {
	var aResult = [],
		depth = 0;
	
	for (var i=0; i<spintax.length; i++) {
		if (spintax[i] == '{' ) {
			depth++;	
		}
		if (spintax[i] == '}' ) {
			depth--;	
		}
		if ( spintax[i] == char && depth == charDepth ) {
			aResult.push(i);
		}
	}
	
	return aResult;
}

/**
 * @param	{string} itemsList
 * @return	{object} of type {conjunction:"et", index:16} if a coordinating conjunction was found, null otherwise  
 */
function searchForConjunction(itemsList) {
	var oRegexp = new RegExp(MySpeech.get("variable.regexp_conjunction"), "g"), // JSSI
//		spintaxDetected = /[{\|}]/g.test(itemsList),
		match,
		aMatches = [],
		oResult = null;
	
	if ( oRegexp.test(itemsList) ) {
		oRegexp.lastIndex = 0;
		while ( match = oRegexp.exec(itemsList) ) {
			if ( !getCharDepth(itemsList, match.index) ) {
				aMatches.push({conjunction: match[1].trim(), index: match.index + 1});
			}
		}
		if ( aMatches.length && aMatches[aMatches.length - 1].index > itemsList.lastIndexOf(itemsSeparator) ) {
			oResult = { conjunction: aMatches[aMatches.length - 1].conjunction, index: aMatches[aMatches.length - 1].index };
		}
	}
	
	return oResult;
}

function getCharDepth(spintax, indexChar) {
	var depth = 0;
	for (var i=0; i<spintax.length; i++) {
		if ( i == indexChar ) {
			return depth;
		}
		if (spintax[i] == '{' ) {
			depth++;	
		}
		if (spintax[i] == '}' ) {
			depth--;	
		}
	}
}

/**
 * @param	{string} itemsList
 * @param	{object} oConjunction : of type {conjunction:"et", index:16} or null if itemsList contains no conjunction
 * @return	{array}
 */
function getArrayElementsToBePermuted(itemsList, oConjunction) {
	var aResult = [],
		aSeparatorIndexes = [],
		regexp = new RegExp(itemsSeparator, 'g'),
		match,
		indexStart,
		indexEnd; 
	
	if ( oConjunction ) {
		itemsList = 
			itemsList.substring(0, oConjunction.index - 1) + // -1 because of the space char preceding the conjunction
			itemsSeparator + 
			itemsList.substring(oConjunction.index + oConjunction.conjunction.length + 1); // +1 because of the space char following the conjunction
	}
	
	aSeparatorIndexes.push(0);
	while ( match = regexp.exec(itemsList) ) {
		if ( !getCharDepth(itemsList, match.index) ) {
			aSeparatorIndexes.push(match.index);
		}
	}
	aSeparatorIndexes.push(itemsList.length);
	
	for (var i=0; i<aSeparatorIndexes.length - 1; i++) {
		indexStart = ( !i ? aSeparatorIndexes[i] : aSeparatorIndexes[i] + itemsSeparator.length );
		indexEnd = aSeparatorIndexes[i+1];
		aResult.push(itemsList.substring(indexStart, indexEnd));
	}
	
	return aResult;
}

function disablePermuteButton() {
	$('#button-permute').removeClass('action').addClass('disabled').off('click', submitForm);
}

function enablePermuteButton() {
	$('#button-permute').removeClass('disabled').addClass('action').on('click', submitForm);
}

/**
 * @param	{string} aItems
 * @param	{string} conjunction
 * @param	{boolean} randomlyHideElements
 * @param	{string} finalPonctuation
 */
function ajaxBuildSpintaxElementForPermutationsList(aItems, conjunction, randomlyHideElements, finalPonctuation) {
	$.ajax({
		type: 'POST',
		url: 'php/ajax/build-spintax-element-for-permutations-list.php',
		data: { 
			aItems: aItems,
			conjunction: conjunction,
			randomlyHideElements: ( randomlyHideElements ? 1 : 0),
			finalPonctuation: finalPonctuation,
			itemsSeparator: itemsSeparator,
			elementsCasePolicy: $('#elements-case-policy').val(),
			language: MySpeech.getLanguage()
		},
		beforeSend: function(jqXHR, settings) {
			disablePermuteButton();
			$('#items-permutations').val("");
		},
		success: function(jsonResponse) {
			if (!jsonResponse.success) {
				MyUtils.displayInfoMessage('warning', jsonResponse.message);
			}
			else {
				$('#items-permutations').val(jsonResponse.spintax);
				
				$('#div-items-permutations').show(function() {
					MyUtils.displayInfoMessage('success', MySpeech.get("message.success.permutation_generated"));
					enablePermuteButton();
					$('#items-permutations').select().focus();
				});
			}
		},
		error: function(request, error) {
			showServerErrorNotification(request);
		}
	});
}

/**
 * @deprecated
 * @param aItems
 * @param coordinatingConjunction
 * @param randomlyHideElements
 * @param finalPonctuation
 * @returns {String}
 */
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

function showHelp() {
	$('.info-message[class~=help]').slideUp(400, function() {
		$(this).find('.help-content').html( MySpeech.get("application.help").join("") );
		$(this).find('.close-button a').html("<i class='fa fa-fw fa-chevron-up'></i> " + MySpeech.get("hide_help", true)).off('click').on('click', hideHelp);
		$(this).slideDown(400);
	});
}

function hideHelp() {
	$('.info-message[class~=help]').slideUp(400, function() {
		$(this).find('.help-content').html('');
		$(this).find('.close-button a').html("<i class='fa fa-fw fa-chevron-down'></i> " + MySpeech.get("show_help", true)).off('click').on('click', showHelp);
		$(this).slideDown(400);
	});
}

//function OLD_ajaxBuildSpintaxElementForPermutationsList(aItems, coordinatingConjunction, randomlyHideElements, finalPonctuation) {
//	$.ajax({
//		url: "php/ajax/build-spintax-element.php",
//		type: 'POST',
//		async: false,
//		data: { 
//			aItems: aItems,
//			coordinatingConjunction: coordinatingConjunction,
//			randomlyHideElements: ( randomlyHideElements ? 1 : 0),
//			finalPonctuation: finalPonctuation,
//			itemsSeparator: itemsSeparator
//		},
//		success: function(jsonResponse) {
//			if (!jsonResponse.success) {
//				MyUtils.displayInfoMessage('error', "Action impossible : " + jsonResponse.message);
//			}
//			else {
//				var itemsPermutations = $('#items-permutations').val();
//				itemsPermutations += ( !itemsPermutations ? "" : "|" ) + jsonResponse.spintaxElt;
//				$('#items-permutations').val(itemsPermutations);
//			}
//		},
//		error: function(request, error) {
//			showServerErrorNotification(request);
//		}
//	});
//}

//function permuteItems(aItems, usedChars, permArr) {
//	if (permArr === undefined) {
//		var permArr = [];
//	}
//	if (usedChars === undefined) {
//		var usedChars = [];
//	}
//	var i, ch;
//	for (i = 0; i < aItems.length; i++) {
//		ch = aItems.splice(i, 1)[0];
//		usedChars.push(ch);
//		if (aItems.length == 0) {
//			permArr.push(usedChars.slice());
//		}
//		permuteItems(aItems, usedChars, permArr);
//		aItems.splice(i, 0, ch);
//		usedChars.pop();
//	}
//	return permArr;
//};
//
//function takeFirstLetterIntoAccount(aItems) {
//	$.each(aItems, function(i,v) {
//		aItems[i] = ( !i ? v.ucFirst() : v.lcFirst() );
//	});
//}

