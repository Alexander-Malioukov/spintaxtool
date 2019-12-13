
function SpincheckerV2() {

	/** PUBLIC PROPERTIES ************************************************************************/
	
	this.REFERENCE_RATE = { VARIATION: 2.35, PERFORATION: 0.8 };
	this.NB_MAX_CONSECUTIVE_WORDS_WITHOUT_VARIATIONS = 3;
	this.aStopWords = [
		'à',
		'a',
		'a-t-elle',
		'a-t-il',
		'a-t-on',
		'au',
		'aux',
		'car',
		'ce',
		'cela',
		'celle',
		'celui',
		'ces',
		'cette',
		'ceux',
		'ci',
		"d'à","d’à",
		'de',
		'des',
		'du',
		"d'un","d’un",
		"d'une","d’une",
		'elle',
		'elles',
		'en',
		'et',
		'eux',
		'il',
		'ils',
		'la',
		'là',
		"l'a","l’a",
		'le',
		'les',
		'leur',
		"l'on","l’on",
		'ma',
		'mes',
		'mon',
		'ne',
		'ni',
		'notre',
		'nous',
		'ont-elles',
		'ont-ils',
		'ou',
		'où',
		'par',
		'pas',
		"qu'avec","qu’avec",
		'que',
		'quel',
		'quelle',
		'quelles',
		"qu'elle","qu’elle",
		"qu'elles","qu’elles",
		'quels',
		"qu'est-ce","qu’est-ce",
		"qu'est-il","qu’est-il",
		"qu'eux","qu’eux",
		'qui',
		"qu'il","qu’il",
		"qu'ils","qu’ils",
		"qu'un","qu’un",
		"qu'une","qu’une",
		"qu'on","qu’on",
		"qu'y","qu’y",
		'sa',
		'se',
		'ses',
		'si',
		'sien',
		'son',
		'sur',
		'ta',
		'tes',
		'tels',
		'ton',
		'tous',
		'tout',
		'très',
		'tu',
		'un',
		'une',
		'votre',
		'vous',
		'y'
	];
	this.aUploadedFileNames = [];
	
	/** PRIVATE PROPERTIES ***********************************************************************/

	var _this = this,
		ERROR_MESSAGE = {
			UNNECESSARY_OPENING_BRACKET_OR_MISSING_PIPE: { type:'WARNING', message:"Accolade ouvrante superflue ou pipeline manquant" },
			UNNECESSARY_CLOSING_BRACKET_OR_MISSING_PIPE: { type:'WARNING', message:"Accolade fermante superflue ou pipeline manquant" },
			CONSECUTIVE_WORDS_WITHOUT_VARIATIONS: { type:'WARNING', message:"Au moins " + this.NB_MAX_CONSECUTIVE_WORDS_WITHOUT_VARIATIONS + " mots consécutifs sans variations" },
			SPINTAX_IS_EMPTY: { type:'ERROR', message:"Le paragraphe est vide" },
			UNNECESSARY_OPENING_BRACKET: { type:'ERROR', message:"Accolade ouvrante superflue" },
			UNNECESSARY_CLOSING_BRACKET: { type:'ERROR', message:"Accolade fermante superflue" },
			MISSING_MATCHING_OPENING_BRACKET_FOR_BRACKET: { type:'ERROR', message:"Aucune accolade ouvrante correspondant à cette accolade fermante" },
			MISSING_MATCHING_CLOSING_BRACKET_FOR_BRACKET: { type:'ERROR', message:"Aucune accolade fermante correspondant à cette accolade ouvrante" },
			MISSING_MATCHING_OPENING_BRACKET_FOR_PIPE: { type:'ERROR', message:"Aucune accolade ouvrante correspondant à ce pipeline" },
			MISSING_MATCHING_CLOSING_BRACKET_FOR_PIPE: { type:'ERROR', message:"Aucune accolade fermante correspondant à ce pipeline" }
		},
		justGageUniqueId = 1;
	
	/** PRIVATE METHODS **************************************************************************/
	
	/**
	 * @param	{string} spintax
	 * @return	{array of objects} each object looks like { type:"ERROR|WARNING", index:12, message:"..." }. Empty array if no errors where found 
	 */
	function searchSpintaxErrors(spintax) {
		var aErrors = [],
			oResult;
		if ( !spintax.length ) {
			aErrors.push($.extend({index:0}, ERROR_MESSAGE.SPINTAX_IS_EMPTY));
		}
		for (var i=0; i<spintax.length; i++) {
			switch(spintax[i]) {
				case '{':
					oResult = findIndexOfMatchingClosingBracketForOpeningBracket(spintax, i);
					if ( typeof oResult == "object" ) {
						aErrors.push($.extend({index:i}, oResult));
					}
					break;
				case '}':
					oResult = findIndexOfMatchingOpeningBracketForClosingBracket(spintax, i);
					if ( typeof oResult == "object" ) {
						aErrors.push($.extend({index:i}, oResult));
					}
					break;
				case '|':
					oResult = findIndexOfMatchingOpeningBracketForPipe(spintax, i);
					if ( typeof oResult == "object" ) {
						aErrors.push($.extend({index:i}, oResult));
					}
					oResult = findIndexOfMatchingClosingBracketForPipe(spintax, i);
					if ( typeof oResult == "object" ) {
						aErrors.push($.extend({index:i}, oResult));
					}
					break;
			}
		}
		
		$.merge(aErrors, findConsecutiveWordsUnspined(spintax));
		
		return aErrors;
	}
	
	/**
	 * @param	{string} spintax
	 * @param	{integer} index : index of an opening bracket
	 * @return	{object} if an error was found, {integer} otherwise
	 */
	function findIndexOfMatchingClosingBracketForOpeningBracket(spintax, index) {
		var depth = 0,
			pipeHavingSameDepthFound = false;
		for (var i=index+1; i<spintax.length; i++) {
			switch(spintax[i]) {
				case '{': depth++; break;
				case '}': if ( !depth-- ) { return ( pipeHavingSameDepthFound ? i : ERROR_MESSAGE.UNNECESSARY_OPENING_BRACKET_OR_MISSING_PIPE ) } break;
				case '|': if ( !depth ) { pipeHavingSameDepthFound = true; } break;
			}
		}
		return ( pipeHavingSameDepthFound ? ERROR_MESSAGE.MISSING_MATCHING_CLOSING_BRACKET_FOR_BRACKET : ERROR_MESSAGE.UNNECESSARY_OPENING_BRACKET );
	}
	
	/**
	 * @param	{string} spintax
	 * @param	{integer} index : index of a pipe
	 * @return	{object} if an error was found, {integer} otherwise 
	 */
	function findIndexOfMatchingClosingBracketForPipe(spintax, index) {
		var depth = 0;
		for (var i=index+1; i<spintax.length; i++) {
			switch(spintax[i]) {
				case '{': depth++; break;
				case '}': if ( !depth-- ) { return i; } break;
			}
		}
		return ERROR_MESSAGE.MISSING_MATCHING_CLOSING_BRACKET_FOR_PIPE;
	}
	
	/**
	 * @param	{string} spintax
	 * @param	{integer} index : index of a closing bracket
	 * @return	{object} if an error was found, {integer} otherwise
	 */
	function findIndexOfMatchingOpeningBracketForClosingBracket(spintax, index) {
		var depth = 0,
			pipeHavingSameDepthFound = false;
		for (var i=index-1; i>=0; i--) {
			switch(spintax[i]) {
				case '{': if ( !depth-- ) { return ( pipeHavingSameDepthFound ? i : ERROR_MESSAGE.UNNECESSARY_CLOSING_BRACKET_OR_MISSING_PIPE ); } break;
				case '}': depth++; break;
				case '|': if ( !depth ) { pipeHavingSameDepthFound = true; } break;
			}
		}
		return ( pipeHavingSameDepthFound ? ERROR_MESSAGE.MISSING_MATCHING_OPENING_BRACKET_FOR_BRACKET : ERROR_MESSAGE.UNNECESSARY_CLOSING_BRACKET );
	}
	
	/**
	 * @param	{string} spintax
	 * @param	{integer} index : index of a pipe
	 * @return	{object} if an error was found, {integer} otherwise
	 */
	function findIndexOfMatchingOpeningBracketForPipe(spintax, index) {
		var depth = 0;
		for (var i=index-1; i>=0; i--) {
			switch(spintax[i]) {
				case '{': if ( !depth-- ) { return i; } break;
				case '}': depth++; break;
			}
		}
		return ERROR_MESSAGE.MISSING_MATCHING_OPENING_BRACKET_FOR_PIPE;
	}
	
	/**
	 * @param	{string} spintax
	 * @return	{array of objects} each object looks like { index:45, type'WARNING', }
	 */
	function findConsecutiveWordsUnspined(spintax) {
		var aResult = [],
			searchingForConsecutiveWords = false,
			indexStartConsecutiveWords,
			currentWord = '',
			aReadWords = [],
			mayPushCurrentWordIntoArrayReadWords = function() {
				if (currentWord) {
					if ( isStopWord(currentWord) || isProperName(currentWord) ) {
						mayAddElementToResult();
						searchingForConsecutiveWords = false;
						aReadWords = [];
					}
					else {
//						console.log('*' + currentWord + '*');
						aReadWords.push(currentWord);
					}
				}
			},
			mayAddElementToResult = function() {
				if ( aReadWords.length >= _this.NB_MAX_CONSECUTIVE_WORDS_WITHOUT_VARIATIONS ) {
//					console.log(aReadWords);
					aResult.push($.extend({ index:indexStartConsecutiveWords }, ERROR_MESSAGE.CONSECUTIVE_WORDS_WITHOUT_VARIATIONS ));
				}
			};

		for (var i=0; i<spintax.length; i++) {
			switch(spintax[i]) {
				case '{':
				case '|':
				case '}': 
				case '.':
				case '!':
				case '?':
				case '…':
					mayPushCurrentWordIntoArrayReadWords();
					if ( searchingForConsecutiveWords ) {
						searchingForConsecutiveWords = false;
						mayAddElementToResult();
						aReadWords = [];
					}
					currentWord = '';
					break;
					
				case ' ':
				case ';':
				case ',':
				case ':':
				case '+':
				case '/':
				case '"':
					mayPushCurrentWordIntoArrayReadWords();
					currentWord = '';
					break;
					
				default :
					currentWord += spintax[i];
					if ( !searchingForConsecutiveWords ) {
						searchingForConsecutiveWords = true;
						indexStartConsecutiveWords = i;
					}
				
					if ( i == spintax.length - 1 ) {
						mayPushCurrentWordIntoArrayReadWords();
						mayAddElementToResult();
					}
			}
		}
		return aResult;
	}
	
	/**
	 * @param {string} word
	 * @return {boolean}
	 */
	function isStopWord(word) {
		return ( $.inArray(word.toLowerCase(), _this.aStopWords) != -1 );
	}
	
	/**
	 * @param {string} word
	 * @return {boolean}
	 */
	function isProperName(word) {
		return ( /[a-z]/i.test(word[0]) && word.ucFirst() == word );
	}
	
	this.isProperName = function(w) {
		return isProperName(w);
	}
	
	/**
	 * @param	{integer} caretPosition : cursor's index in the current brackets block
	 * @return	{object} JSON looking like { indexOpeningBracket:21, indexOpeningBracket:32 } ; indexes values are set to -1 if no brackets are found 
	 */
	function findIndexesOfCurrentBracketsBlock(spintax, caretPosition) {
		var result = { indexOpeningBracket: -1, indexOpeningBracket: -1 },
			stopLooping,
			depth;
		
		// Index of the opening bracket
		depth = 0;
		stopLooping = false;
		for (var i=caretPosition-1; i>=0; i--) {
			if ( stopLooping ) {
				break;
			}
			switch(spintax[i]) {
				case '{': 
					if ( !depth-- ) { 
						result.indexOpeningBracket = i;
						stopLooping = true;
					} 
					break;
				case '}': depth++; break;
			}
		}
		if ( result.indexOpeningBracket == null ) {
			result.indexOpeningBracket = -1;
		}
		
		// Index of the closing bracket
		depth = 0;
		stopLooping = false;
		for (var i=caretPosition; i<spintax.length; i++) {
			if ( stopLooping ) {
				break;
			}
			switch(spintax[i]) {
				case '{': depth++; break;
				case '}': if ( !depth-- ) { 
					result.indexClosingBracket = i;
					stopLooping = true; 
				}
				break;
			}
		}
		if ( result.indexClosingBracket == null ) {
			result.indexClosingBracket = -1;
		}
		
		return result;
	}
	
//	/**
//	 * @param	{string} spintax : private property
//	 * @param	{integer} indexOpeningBracket
//	 * @return	{boolean} true if at least one pipe having the bracket's depth exist
//	 */
//	function isOpeningBracketUnnecessary(indexOpeningBracket) {
//		var depth = 0;
//		for (var i=indexOpeningBracket+1; i<spintax.length; i++) {
//			switch(spintax[i]) {
//				case '{': depth++; break;
//				case '}': if ( !depth-- ) { return true }; break;
//				case '|': if ( !depth ) { return false }
//			}
//		}
//		return false;
//	}
//	
//	/**
//	 * @param	{string} spintax : private property
//	 * @param	{integer} indexClosingBracket
//	 * @return	{boolean} true if at least one pipe having the bracket's depth exist 
//	 */
//	function isClosingBracketUnnecessary(indexClosingBracket) {
//		var depth = 0;
//		for (var i=indexClosingBracket-1; i>=0; i--) {
//			switch(spintax[i]) {
//				case '{': if (!depth--) { return true }; break;
//				case '}': depth++; break;
//				case '|': if ( !depth ) { return false }
//			}
//		}
//		return false;
//	}
	
	/**
	 * @param	{integer} noParagraph
	 * @param	{string} paragraphTitle
	 * @param	{string} paragraphContent
	 * @return	{object} paragraph content nested into the paragraph zone
	 */
	function createParagraphZone(noParagraph, paragraphTitle, paragraphContent) {
		var defaultPermutationMode = $('#default-permutation-mode').val();
		var $paragraphZone = $('' +
			'<div class="paragraph-container" data-title="' + paragraphTitle + '">' +
				'<div class="grid collapse-with-following">' +
					'<div class="unit half">' +
						'<label>' + paragraphTitle + '</label>' +
					'</div>' +
					'<div class="unit half align-right">' +
						'<select id="permutation-mode-' + noParagraph + '" class="permutation-mode">' +
							'<option value="ALL_NOT_PERMUTABLE">Aucun élément permutable</option>' +
							'<option value="ALL_PERMUTABLE">Éléments tous permutables</option>' +
							'<option value="ALL_PERMUTABLE_EXCEPT_FIRST">Éléments tous permutables sauf le premier</option>' +
						'</select>' +
						'<button class="action mini" onclick="var $paragraphContent = $(\'#spintax-paragraph-' + noParagraph + '\'); SpincheckerV2.analyzeParagraph($paragraphContent, true); scrollToElement($paragraphContent.next(\'.info-message-wrapper\'));">Actualiser</button>' +
					'</div>' +
				'</div>' +
				'<div class="grid">' +
					'<div class="unit whole">' +
						'<div class="highlighter-container"></div>' +
						'<textarea id="spintax-paragraph-' + noParagraph + '" name="spintax-paragraph-' + noParagraph + '" class="spintax autosize" rows="1"></textarea>' +
						'<div class="info-message-wrapper">' +
							'<div class="db-toggle" data-title="">' +
								'<div class="info-message justify"></div>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>');
		$paragraphZone.find('select.permutation-mode option[value="' + defaultPermutationMode + '"]').prop('selected', true);
		$('#main-zone').after($paragraphZone);
		
		return $('#spintax-paragraph-' + noParagraph).css('height', '1em').val(paragraphContent).textareaAutoSize();
	}
	
	/**
	 * @param	{object} $infoMessageWrapper
	 * @param	{string} messageClass : "success" / "error"
	 * @param	{String} message
	 * @param	{boolean} openToggle
	 * @return
	 */
	function displayParagraphInfoMessage($infoMessageWrapper, messageClass, message, openToggle) {
		var $infoMessage = $infoMessageWrapper.find('.info-message');
		
		// Update info message style
		// -------------------------
		if ( !$infoMessage.hasClass(messageClass) ) {
			$infoMessage.removeClass('error').removeClass('success').addClass(messageClass);
		}
		
		// Render info message
		// -------------------
		$infoMessage.html(message);
		if ( /success/.test(messageClass) ) {
			updateToggleTitle($infoMessageWrapper, 'Statistiques du paragraphe');
			renderThreeGauges($infoMessage);
		}
		if ( /error/.test(messageClass) ) {
			var nbWarnings = $infoMessage.find('p.warning').length,
				nbErrors = $infoMessage.find('p.error').length,
				toggleTitle = 'Ce paragraphe génère ' + nbErrors + ' erreur' + (nbErrors>1 ? 's' : '') + ' et ' + nbWarnings + ' avertissement' + (nbWarnings>1 ? 's' : '');
			updateToggleTitle($infoMessageWrapper, toggleTitle);
		}
		
		// Focus on info message
		// ---------------------
		if (openToggle) {
			openToggleIfClosed($infoMessageWrapper);
		}
	}
	
	/**
	 * @param	{object} $paragraphContent
	 * @return
	 */
	function displayParagraphStats($paragraphContent) {
		var $infoMessageWrapper = $paragraphContent.next('.info-message-wrapper'),
			noParagraph = $paragraphContent.prop('id').replace('spintax-paragraph-', ''),
			spintax = $paragraphContent.val().trim(),
			oWordsStats = getWordsStats(spintax),
			nbParagraphElements = spintax.split('\n').length,
			nbResults = getNbResultsForParagraph(spintax, $('#permutation-mode-' + noParagraph ).val(), true),
			paragraphStats = '' +
				'<div class="grid">' +
					'<div class="unit three-fifths">' +
						'<div class="stats-resume">' +
							"Le <span>paragraphe n° " + noParagraph + "</span> comporte <span>" + nbParagraphElements + " élément" + (nbParagraphElements > 1 ? 's' : '') + "</span>, dont le mode de permutation est <span>«&nbsp;" + $('#permutation-mode-' + noParagraph + ' option:selected').text().lcFirst() + "&nbsp;»</span>. " +
							( nbResults == 'plus de 1000 milliards' ? '' : "Le nombre de résultats générés s'élève à <span>" + nbResults + " résultats</span>. " ) +
							"Le paragraphe offre un taux de variation de <span>" + new String(oWordsStats.variationRate).replace('.',',') + " %</span> et un taux de perforation de <span>" + new String(oWordsStats.perforationRate).replace('.',',') + '&nbsp;%</span>.' +
						'</div>' +
					'</div>' +
					'<div class="unit two-fifths align-right">' +
						'<div class="gauge spincheckerV2" data-gauge-value="' + oWordsStats.variationIndex + '"></div>' +
						'<div class="gauge spincheckerV2" data-gauge-value="' + oWordsStats.perforationIndex + '"></div>' +
						'<div class="gauge spincheckerV2" data-gauge-value="' + oWordsStats.qualityIndex + '"></div>' +
					'</div>' +
				'</div>';
		
		displayParagraphInfoMessage($infoMessageWrapper, 'success no-background', paragraphStats, true);
	}
	
	/**
	 * @deprecated
	 * @param	{string} spintax
	 * @return	{integer} spin rate in percents
	 */
	function getSpinRate(spintax) {
		var tree = SpinerMan.buildTree(spintax);
		return ((tree.s.w > 0 && tree.r > 0) ? (100 * tree.s.r / (tree.s.w / tree.r)).toFixed(1) : 0);
	}
	
	/**
	 * @deprecated
	 * @param	{string} paragraphSpintax
	 * @param	{stringr} permutationMode : ALL_PERMUTABLE / ALL_NOT_PERMUTABLE / ALL_PERMUTABLE_EXCEPT_FIRST
	 * @return	{string} 
	 */
	function getParagraphSpintaxWithParagraphElementsPermutations(paragraphSpintax, permutationMode) {
		switch(permutationMode) {
			case 'ALL_PERMUTABLE':
				var aParagraphElements = paragraphSpintax.split('\n');
				return generateSpintaxCombination(aParagraphElements);
			case 'ALL_NOT_PERMUTABLE':
				return paragraphSpintax;
			case 'ALL_PERMUTABLE_EXCEPT_FIRST':
				var aParagraphElements = paragraphSpintax.split('\n');
				return aParagraphElements.shift() + ' ' + generateSpintaxCombination(aParagraphElements);
			default:
				alert("Function getParagraphSpintaxWithParagraphElementsPermutations() : ERROR !! permutationMode : " + permutationMode);
		}
	}
	
	/**
	 * @deprecated
	 * @param	{string} aSpintaxSentences
	 * @return	{string}
	 */
	function generateSpintaxCombination(aSpintaxSentences) { 
		switch (aSpintaxSentences.length) {
			case 0: return '';
			case 1: return aSpintaxSentences[0];
			default:
				var aCombinations = Combinatorics.permutation(aSpintaxSentences).toArray(),
					spintaxResult = '';
				$.each(aCombinations, function(i,v) {
					spintaxResult += ( !i ? '' : '|') + v.join(' ');
				});
				return '{' + spintaxResult + '}';
		}
	}
	
//	/**
//	 * @param	{string} aSpintaxSentences
//	 * @param	{objet, optional} $clickedButton
//	 * @return	{string}
//	 */
//	function AJAX_generateSpintaxCombination(aSpintaxSentences, $clickedButton) {
//		var clickedButtonLabel = ( $clickedButton != undefined ? $clickedButton.html() : null );
//		return $.ajax({
//			type: 'POST',
//			url: 'php/ajax/generate-spintax-combination.php',
//			async: false,
//			data: { aSpintaxSentences: aSpintaxSentences },
//			beforeSend: function(jqXHR, settings) {
//				if ( $clickedButton != undefined ) {
//					$clickedButton.html('<img src="images/ajax-loader.gif" style="padding-right:10px">Traitement en cours&hellip;').removeClass('action').addClass('disabled');
//				}
//			},
//			success: function(jsonResponse) {
//				if ( $clickedButton != undefined ) {
//					$clickedButton.html(clickedButtonLabel).removeClass('disabled').addClass('action');
//				}
//			},
//			error: function(request, error) {
//				showServerErrorNotification(request);
//			}
//		}).responseJSON;
//	}
	
	/**
	 * @param	{string} spintax
	 * @param	{boolean, optional} formatBigNumber
	 * @return	{integer} nb of permutations
	 */
	function getNbResults(spintax, formatBigNumber) {
		var tree = SpinerMan.buildTree(spintax);
		return ( formatBigNumber !== undefined && formatBigNumber ? new String(tree.r).formatBigNumber() : tree.r );
	}
	
	/**
	 * @param	{string} paragraphSpintax
	 * @param	{stringr} permutationMode : ALL_NOT_PERMUTABLE / ALL_PERMUTABLE / ALL_PERMUTABLE_EXCEPT_FIRST
	 * @param	{boolean, optional} formatBigNumber
	 * @return	{integer} 
	 */
	function getNbResultsForParagraph(paragraphSpintax, permutationMode, formatBigNumber) {
		var result;
		
		paragraphSpintax = paragraphSpintax.trim();
		switch(permutationMode) {
			case 'ALL_NOT_PERMUTABLE':
				result = getNbResults(paragraphSpintax);
				break;
			case 'ALL_PERMUTABLE':
			case 'ALL_PERMUTABLE_EXCEPT_FIRST':
				var aParagraphElements = paragraphSpintax.split('\n'), result;
				switch (aParagraphElements.length) {
					case 0: result = 0; break;
					case 1: result = getNbResults(aParagraphElements[0]); break;
					default:
						if ( permutationMode == 'ALL_PERMUTABLE_EXCEPT_FIRST' ) {
							result = getNbResults(aParagraphElements[0]); 
							aParagraphElements.shift();
						}
						else {
							result = 1;
						}
						result *= factorial(aParagraphElements.length);
						$.each(aParagraphElements, function(i,v) {
							result *= getNbResults(v);
						});
				}
				break;
			default:
				result = 0;
				alert("Function getNbResultsForParagraph() : ERROR !! Bad permutationMode : " + permutationMode);
		}
		return ( formatBigNumber !== undefined && formatBigNumber ? new String(result).formatBigNumber() : result );
	}
	
	/**
	 * @param	{string} articleSpintax
	 * @param	{boolean} formatBigNumber
	 * @return	{integer} 
	 */
	function getNbResultsForArticle(articleSpintax, formatBigNumber) {
		var aParagraphsContents, 
			result,
			resultLimit = Math.pow(10,12);
		
		articleSpintax = articleSpintax.trim();
		aParagraphsContents = articleSpintax.split('\n\n');
		switch (aParagraphsContents.length) {
		case 0: result = 0; break;
		case 1: result = getNbResults(aParagraphsContents[0]); break;
		default:
			var noParagraph;
			result = factorial(aParagraphsContents.length);
			$.each(aParagraphsContents, function(i,v) {
				noParagraph = i+1;
				result *= getNbResultsForParagraph(v, $('#permutation-mode-' + noParagraph ).val());
				if ( result > resultLimit ) {
					return false;
				}
			});
		}
		return ( formatBigNumber !== undefined && formatBigNumber ? new String(result).formatBigNumber() : result );
	}
	
	/**
	 * @param	{string} spintax
	 * @return	{object} of type { minWords:3, maxWords:50, avgWords:22.6 }
	 */
	function getWordsStats(spintax) {
		var result = SpinerMan.getStats(SpinerMan.buildTree(spintax));
		
		result.variationRate = parseFloat((( result.totalVariations / result.avgWords ) * 100 ).toFixed(1));
		result.variationIndex = parseFloat((( result.totalVariations / result.avgWords ) / _this.REFERENCE_RATE.VARIATION ).toFixed(1));
		
		result.perforationRate = parseFloat((( result.totalHoles / result.avgWords ) * 100 ).toFixed(1));
		result.perforationIndex = parseFloat((( result.totalHoles / result.avgWords ) / _this.REFERENCE_RATE.PERFORATION ).toFixed(1));
		
		result.qualityIndex = ( !result.totalHoles ? 0 : parseFloat((( result.totalVariations / result.totalHoles ) / ( _this.REFERENCE_RATE.VARIATION / _this.REFERENCE_RATE.PERFORATION )).toFixed(1)) );
		
		return result;
	}
	
	/**
	 * @param	none
	 * @return	none
	 */
	function displayArticleStats() {
		var articleStats,
			articleSpintaxWithoutPermutation = '', // i.e. without paragraph permutations or paragraph elements permutations
			$infoMessage = $('<div id="article-stats" class="info-message info justify"></div>'),
			$aParagraphContents = $('textarea[id^=spintax-paragraph-]'),
			nbParagraphs = $aParagraphContents.length,
			nbResults,
			oWordsStats;
		
		// Should the process continue ?
		if ( $('.paragraph-container .info-message p').hasClass('error') ) { // true if at least 1 <p> element contains the 'error' class
			MyUtils.displayInfoMessage('warning', "Traitement impossible tant que des erreurs Spintax subsistent.");
			return;
		}
		
		// Calculation of the article's Spintax without any permutation
//		articleSpintaxWithoutPermutation = $('#spintax-article').val().trim();
		$.each($('textarea[id^=spintax-paragraph-]'), function() {
			articleSpintaxWithoutPermutation += ( articleSpintaxWithoutPermutation ? '\n\n' : '' ) + $(this).val().trim();
		});
		oWordsStats = getWordsStats(articleSpintaxWithoutPermutation);
				
		// Writing of the article stats
		nbResults = getNbResultsForArticle(articleSpintaxWithoutPermutation, true);
		articleStats = '' +
			'<div class="grid">' +
				'<div class="unit three-fifths">' +
					'<div class="stats-resume">' +
						"L'article comporte <span>" + nbParagraphs + " paragraphe" + (nbParagraphs > 1 ? 's' : '') + "</span>. " +
						( nbResults == 'plus de 1000 milliards' ? '' : "Le nombre de résultats générés s'élève à <span>" + nbResults + "</span>. ") +
						"Le nombre de mots se situe entre <span>" + oWordsStats.minWords + "</span> et <span>" + oWordsStats.maxWords + "</span>, avec une moyenne de <span>" + new String(parseFloat(oWordsStats.avgWords.toFixed(1))).replace('.', ',') + "</span> mots. " +
						"L'article offre un taux de variation de <span>" + new String(oWordsStats.variationRate).replace('.',',') + " %</span> et un taux de perforation de <span>" + new String(oWordsStats.perforationRate).replace('.',',') + " %</span>." +
					'</div>' +
				'</div>' +
				'<div class="unit two-fifths align-right">' +
					'<div class="gauge spincheckerV2" data-gauge-value="' + oWordsStats.variationIndex + '"></div>' +
					'<div class="gauge spincheckerV2" data-gauge-value="' + oWordsStats.perforationIndex + '"></div>' +
					'<div class="gauge spincheckerV2" data-gauge-value="' + oWordsStats.qualityIndex + '"></div>' +
				'</div>' +
			'</div>';
		
		// Displaying of the article stats
		$('.paragraph-container').last().after($infoMessage);
		$infoMessage.html(articleStats);
		
		// Rendering gauges
		renderThreeGauges($infoMessage);
		
		// Display comparative table
		if ( $('#compare-paragraphs').is(":checked") ) {
			displayComparativeTableForParagraphs($infoMessage);
		}
		
		// ParagraphNavigator content update
		ParagraphNavigator.addLinkToArticleStats();
		
		// Let's scroll !
		scrollToElement($infoMessage);
		
		// Deactivation of the action button
		$('#submitButton').removeClass('action').addClass('disabled').off('click');
		
		// In case of calculation overflow (Infinity) in words stats, display notification
		if ( oWordsStats.calculationOverflow ) {
			MyUtils.displayInfoMessage('warning', "À cause d'un dépassement de capacité interne, les statistiques de l'article comportent des approximations mineures.");
		}
	}
	
	/**
	 * @param	{Object} $infoMessage
	 * @return	none 
	 */
	function renderThreeGauges($infoMessage) {
		var maxValue = 0;
		
		$infoMessage.find('.gauge').each(function() {
			if ( parseFloat($(this).attr('data-gauge-value')) > maxValue ) {
				maxValue = parseFloat($(this).attr('data-gauge-value'));
			}
		});
		renderGauge($infoMessage.find('.gauge').eq(0), "Indice de variation", maxValue);
		renderGauge($infoMessage.find('.gauge').eq(1), "Indice de perforation", maxValue);
		renderGauge($infoMessage.find('.gauge').eq(2), "Indice qualité", maxValue);
	}
	
	/**
	 * @param	{Object} $infoMessageWrapper
	 * @return	none
	 */
	function openToggleIfClosed($infoMessageWrapper) {
		var $toggle = $infoMessageWrapper.find('.db-toggle');
		if ( $toggle.hasClass('closed') ) {
			openToggle($toggle, $.noop);
		}
	}
	
	this.openToggleIfClosed = function($infoMessageWrapper) {
		openToggleIfClosed($infoMessageWrapper);
	}

	/**
	 * @param	{Object} $gaugeContainer
	 * @param	{string} title : gauge title
	 * @param	{float} maxValue : max gauge value
	 */
	function renderGauge($gaugeContainer, title, maxValue) {
		$gaugeContainer.attr('id', 'gauge-' + justGageUniqueId++);
		new JustGage({
			id: $gaugeContainer.attr('id'),
			value: parseFloat($gaugeContainer.attr('data-gauge-value')),
			title: title,
			decimals: 1,
			min: 0,
			max: maxValue,
			gaugeWidthScale: 0.25,
			customSectors: [{
				color: "#ce4844",
				lo: 0,
				hi: 0.89
			},{
				color: "#ffbf00",
				lo: 0.89,
				hi: 0.99
			},{
				color: "#5cb85c",
				lo: 0.99,
				hi: 1000
			}]
		});
	}
	
	function displayComparativeTableForParagraphs($infoMessage) {
		var spintax, oWordsStats, aParagraphsData = [];
		
		// Stats calculation for all paragraphs
		$.each($('textarea[id^=spintax-paragraph-]'), function() {
			spintax = $(this).val().trim(),
			oWordsStats = getWordsStats(spintax),
			aParagraphsData.push({
				variationRate: oWordsStats.variationRate,
				perforationRate: oWordsStats.perforationRate,
				variationIndex: oWordsStats.variationIndex,
				perforationIndex: oWordsStats.perforationIndex,
				qualityIndex: oWordsStats.qualityIndex
			});
		});
		
		// Table building
		$infoMessage.append('' +
			'<div class="grid my-table header">' +
				'<div class="unit one-sixth align-center">Paragraphe</div>' +
				'<div class="unit one-sixth align-center">Taux de variation</div>' +
				'<div class="unit one-sixth align-center">Taux de perforation</div>' +
				'<div class="unit one-sixth align-center">Indice de variation</div>' +
				'<div class="unit one-sixth align-center">Indice de perforation</div>' +
				'<div class="unit one-sixth align-center">Indice qualité</div>' +
			'</div>'
		);
		$.each($('textarea[id^=spintax-paragraph-]'), function(i,v) {
			$infoMessage.append('' +
				'<div class="grid my-table row">' +
					'<div class="unit one-sixth align-center">' + parseInt(i+1) +'</div>' +
					'<div class="unit one-sixth align-center">' + new String(aParagraphsData[i].variationRate).replace('.',',') +' %</div>' +
					'<div class="unit one-sixth align-center">' + new String(aParagraphsData[i].perforationRate).replace('.',',') +' %</div>' +
					'<div class="unit one-sixth align-center">' + new String(aParagraphsData[i].variationIndex).replace('.',',') +'</div>' +
					'<div class="unit one-sixth align-center">' + new String(aParagraphsData[i].perforationIndex).replace('.',',') +'</div>' +
					'<div class="unit one-sixth align-center">' + new String(aParagraphsData[i].qualityIndex).replace('.',',') +'</div>' +
				'</div>'
			);
		});
		
		// Marking extreme values in the table
		for ( var i=2; i<=6; i++ ) {
			markExtremeValueIntoTable($('.my-table.row .unit:nth-child(' + i + ')'), 'MIN_VALUE')
			markExtremeValueIntoTable($('.my-table.row .unit:nth-child(' + i + ')'), 'MAX_VALUE')
		}
	}

	/**
	 * @param	{object} $textarea : textarea of the spintax for which the current brackets block displaying should be turned on
	 * @return	none
	 */
	function turnOnCurrentBracketsBlockDisplaying() {
		$.each($('textarea[id^=spintax-paragraph-]'), function(i,v) {
			$(this).removeClass('highlighting-off').addClass('highlighting-on').on('keyup click', displayCurrentBracketsBlock).trigger('keyup');
		});
	}
	
	/**
	 * @param	{object} $textarea : textarea of the spintax for which the current brackets block displaying should be turned off
	 * @return	none
	 */
	function turnOffCurrentBracketsBlockDisplaying() {
		$('textarea[id^=spintax-paragraph-]').removeClass('highlighting-on').addClass('highlighting-off').off('keyup click');
		$('.highlighter-container').html('');
	}
	
	function displayCurrentBracketsBlock(e) {
		var $textarea = $(e.target),
			highlightBeginTag = '<span class="spintax-highlight">{',
			highlightEndTag = '}</span>',
			oIndexes = findIndexesOfCurrentBracketsBlock($textarea.val(), $textarea.prop('selectionStart')),
			$highlighterContainer = $textarea.prev('.highlighter-container'),
			highlighterContainerHtml = $textarea.val().replace(/\n/g, '<br>');
		
		if ( oIndexes.indexOpeningBracket != -1 && oIndexes.indexClosingBracket != -1 ) {
			highlighterContainerHtml = highlighterContainerHtml.replaceCharByString(oIndexes.indexClosingBracket, highlightEndTag); // start by the end tag !
			highlighterContainerHtml = highlighterContainerHtml.replaceCharByString(oIndexes.indexOpeningBracket, highlightBeginTag);
		}
		$highlighterContainer.html(highlighterContainerHtml);
	}
	
	function sortParagraphContainersAlphabetically() {
		$('.paragraph-container').sortElements(function(a, b){
			return $(a).data('title').localeCompare($(b).data('title'));
		});
	}
	
	/**
	 * @param
	 * @return
	 */
	function resizeHighlighterContainersWidth() {
		$.each($('textarea[id^=spintax-paragraph-]'), function(i,v) {
			$(this).prev('.highlighter-container').width($(this).width());
		});
	}
	
	/**
	 * @param	{spintax} string
	 * @param	{integer} errorIndex
	 * @param	{integer} noParagraph
	 * @return	{string} spintax formated
	 */
	function formatSpintaxShownInErrorMessages(spintax, errorIndex, noParagraph) {
		var nbCharsAroundErrorIndex = 50;
		return "" +
			spintax.substring(errorIndex - nbCharsAroundErrorIndex, errorIndex) +
			"<a class='spintax-error' href='#' onclick='SpincheckerV2.selectSpintaxErrorIntoParagraphContent(" + noParagraph + ", " + errorIndex + ")'>" + spintax[errorIndex] + "</a>" + 
			spintax.substr(errorIndex + 1, nbCharsAroundErrorIndex);
	}

	/**
	 * @param	{integer} noParagraph
	 * @param	{integer} errorIndex
	 * @return
	 */
	this.selectSpintaxErrorIntoParagraphContent = function(noParagraph, errorIndex) {
		var $paragraphContent =  $('#spintax-paragraph-' + noParagraph);
		
		scrollToElement($paragraphContent, function() {
			$paragraphContent.focus();
			$paragraphContent.prop('selectionStart', errorIndex).prop('selectionEnd', errorIndex+1);
		});
	}
	
	/**
	 * @deprecated
	 * @param	{integer} noParagraph
	 * @param	{integer} errorIndex
	 * @return
	 */
	this.OLD_selectSpintaxErrorIntoParagraphContent = function(noParagraph, errorIndex) { // déplacer avec les fonctions publiques
		var $paragraphContent =  $('#spintax-paragraph-' + noParagraph),
			oCaretPosition = getCaretCoordinates($paragraphContent.get(0), errorIndex);

		$paragraphContent.focus();
		$('html, body').animate(
			{ scrollTop: oCaretPosition.top }, 
			700, 
			function() { $paragraphContent.prop('selectionStart', errorIndex).prop('selectionEnd', errorIndex); }
		);
	}
		
	/**
	 * @deprecated
	 * @param	{string} spintax
	 * @param	{integer} errorIndex
	 * @return	{string} spintax formated
	 */
	function OLD_formatSpintaxShownInErrorMessages(spintax, errorIndex) {
		return "" +
			buildFadingString(spintax.substring(0, errorIndex), 'IN') + 
			"<span class='spintax-error'>" + spintax[errorIndex] + "</span>" + 
			buildFadingString(spintax.substr(errorIndex + 1), 'OUT');
	}
	
	/**
	 * @deprecated
	 * @param	{string} string
	 * @param	{string} fadingMode : 'IN' / 'OUT'
	 * @return	{string} 
	 */
	function buildFadingString(string, fadingMode) {
		var nbFadingStringBlocks = 5,
			fadingStringBlockSize = 10,
			result = "",
			indexBeginBlock,
			indexEndBlock;
		switch (fadingMode) {
			case 'IN':
				if ( string ) {
					var countBlocks = 1;
					indexEndBlock = string.length;
					while ( indexEndBlock > 0 && countBlocks <= nbFadingStringBlocks ) {
						indexBeginBlock = indexEndBlock - fadingStringBlockSize;
						result = "<span class='fading-in-block-" + countBlocks + "'>" + string.substring(indexBeginBlock, indexEndBlock) + "</span>" + result;
						indexEndBlock -= fadingStringBlockSize;
						countBlocks++;
					}
				}
				break;
			case 'OUT':
				if ( string ) {
					var countBlocks = nbFadingStringBlocks;
					indexBeginBlock = 0;
					while ( indexBeginBlock < string.length && countBlocks ) {
						indexEndBlock = indexBeginBlock + fadingStringBlockSize;
						result = "<span class='fading-out-block-" + countBlocks + "'>" + string.substring(indexBeginBlock, indexEndBlock) + "</span>" + result;
						indexBeginBlock += fadingStringBlockSize;
						countBlocks--;
					}
				}
				break;
			default:
				alert("Function buildFadingString() : ERROR !! Bad fadingMode : " + fadingMode);
		}
		return result;
	}

	/** PUBLIC METHODS ***************************************************************************/
	
	/**
	 * @param
	 * @return
	 */
	this.clickOnCheckboxShowCurrentBracketsBlock = function() {
		if ( $('#show-current-brackets-block').is(':checked') ) {
			turnOnCurrentBracketsBlockDisplaying();
		}
		else {
			turnOffCurrentBracketsBlockDisplaying();
		}
	}
	
	this.analyzeArticle = function() {
		var $paragraphContent,
			aParagraphsContents,
			noParagraph,
			paragraphTitle,
			isUploadMode = (_this.aUploadedFileNames.length ? true : false );;
		
		$('.paragraph-container').remove();
		
		if ( !$('#spintax-article').val().trim() ) {
			MyUtils.displayInfoMessage('warning', "Veuillez saisir un article au format Spintax.");
			$('#spintax-article').val('').focus();
			return;
		}
		
		$('#spintax-article-container').slideUp(400);
		$('#show-current-brackets-block-container').slideDown(400);
		
		aParagraphsContents = $('#spintax-article').val().trim().split('\n\n').reverse();
		$.each(aParagraphsContents, function (i,v) {
			noParagraph = aParagraphsContents.length - i;
			paragraphTitle = ( isUploadMode ? 'Fichier ' + _this.aUploadedFileNames[aParagraphsContents.length - i - 1] : 'Paragraphe n° ' + noParagraph );
			$paragraphContent = createParagraphZone(noParagraph, paragraphTitle, v);
			createToggles($paragraphContent.next('.info-message-wrapper'), false);
			_this.analyzeParagraph($paragraphContent, false); 
		});
		
		if ( isUploadMode ) {
			sortParagraphContainersAlphabetically();
		}
		
		resizeHighlighterContainersWidth();
		
		ParagraphNavigator.fillAndShow($('textarea[id^=spintax-paragraph-]').length);
		
		$('#uploadButton').removeClass('action').addClass('disabled').off('click');
		$('#submitButton').html("Statistiques de l'article").off('click').on('click', displayArticleStats);
	}
	
	/**
	 * @param	{object} $paragraphContent
	 * @param	{boolean} openToggle : open if closed and scroll to it
	 * @return	
	 */
	this.analyzeParagraph = function($paragraphContent, openToggle) {
		var spintax = $paragraphContent.val().trim(),
			aErrors = searchSpintaxErrors(spintax),
			errorsFound = false,
			noParagraph = $paragraphContent.prop('id').replace('spintax-paragraph-', ''),
			$infoMessageWrapper = $paragraphContent.next('.info-message-wrapper'),
			$infoMessage = $infoMessageWrapper.find('.info-message');
		
		$infoMessage.next('.display-stats').remove();
		if ( aErrors.length ) {
			var message = '';
			for (var i=0; i<aErrors.length; i++) {
				if ( aErrors[i].type == 'ERROR') {
					errorsFound = true;
				}
				
				if ( aErrors[i] != ERROR_MESSAGE.SPINTAX_IS_EMPTY ) {
					message += "<p class='" + aErrors[i].type.toLowerCase() + "'>";
					message += ( aErrors[i].type == 'ERROR' ? "<i title='Erreur' class='fa fa-fw fa-exclamation-circle''></i>" : "<i title='Avertissement' class='fa fa-fw fa-exclamation-circle''></i>");
					message += aErrors[i].message;
					message += "</p>";
					message += "<div class='spintax'>" + formatSpintaxShownInErrorMessages(spintax, aErrors[i].index, noParagraph) + "</div>";
				}
			}
			displayParagraphInfoMessage($infoMessageWrapper, 'error', message, openToggle);

			if ( !errorsFound ) {
				var $a = $("<a class='display-stats'><i class='fa fa-fw fa-bar-chart'></i>&nbsp;Statistiques du paragraphe</a>").one('click', function() {
					$(this).remove();
					displayParagraphStats($paragraphContent);
				});
				$infoMessage.after($a);
			}
		}
		else {
			displayParagraphStats($paragraphContent);
		}
	}
}

var SpincheckerV2 = new SpincheckerV2();

/*************************************************************************************************/

function initForm() {
	resetForm();
	ParagraphNavigator.create();
}

function resetForm() {
	hideHelp();
	ParagraphNavigator.hide();
	SpincheckerV2.aUploadedFileNames = [];
	$('#default-permutation-mode option').eq(0).prop('selected', true)
	$('#compare-paragraphs').prop('checked', false);
	$('#show-current-brackets-block-container').slideUp(400);
	$('#spintax-article-container').slideDown(400, function() { $('#spintax-article').val('').focus() } );
	$('.paragraph-container').remove();
	$('#article-stats').remove();
	$('#uploadButton').removeClass('disabled').addClass('action');
	$('#submitButton').removeClass('disabled').addClass('action').html("Analyse de l'article").off('click').on('click', SpincheckerV2.analyzeArticle);
}

function showHelp() {
	$('.info-message[class~=help]').slideUp(400, function() {
		$(this).find('.help-content').html('' +
			"<p>Cet outil permet d'analyser la syntaxe d'un article au format Spintax et d'en calculer des statistiques.</p>" +
			"<p class='title'<i style='margin-right:10px' class='fa fa-book'></i>Conventions de nommage" +
				"<ol>" +
					"<li>un <u><i>article</i></u> contient un ou plusieurs <u><i>paragraphes</i></u>, séparés par deux retours chariot</li>" +
					"<li>un <u><i>paragraphe</i></u> contient plusieurs <u><i>éléments</i></u>, séparées par un seul retour chariot</li>" +
					"<li>un <u><i>élément</i></u> contient une ou plusieurs phrases écrites au format Spintax</li>" +
				"</ol>" +
			"</p>" +
			"<p class='title'><i style='margin-right:10px' class='fa fa-wrench'></i>Utilisation" +
				"<ol>" +
					"<li>Saisissez un article au format Spintax.</li>" +
					"<li>Cliquez sur le bouton vert « Analyse de l'article ».</li>" +
					"<li>" +
						"L'article disparaît, remplacé par ses paragraphes. Pour chaque paragraphe, les erreurs (en rouge) ou avertissements (en orange) éventuels sont signalés. Cliquer dessus positionne le curseur à l'endroit du paragraphe concerné." +
						"<br>Si seuls des avertissements sont détectés, un lien « Statistiques du paragraphe » permet de faire apparaître les statistiques suivantes ; si aucune erreur ni avertissement ne sot détectés, celles-ci apparaissent directement :" +
					"</li>" +
					"<ul>" +
						"<li>nombre d'éléments</li>" +
						"<li>nombre de résultats générés</li>" +
						"<li>taux de variation (idéalement &#8805; <span id='reference-variation-rate'></span>%) : représente la quantité de variations introduites par des <b>|</b>, augmentant les possibilités de tirage du spin</li>" +
						"<li>taux de perforation (idéalement &#8805; <span id='reference-perforation-rate'></span>%) : représente le nombre de blocs d'accolades</li>" +
						"<li>indice de variation (idéalement &#8805; 1) : rapport entre le taux de variation et un taux de variation de référence</li>" +
						"<li>indice de perforation (idéalement &#8805; 1) : rapport entre le taux de perforation et un taux de perforation de référence</li>" +
						"<li>indice qualité (idéalement &#8805; 1) : représente une proportion jugée idéale entre les taux de variation et de perforation</li>" +
					"</ul>" +
					"À noter : même si les avertissements n'empêchent pas de générer les statistiques de l'article, ils doivent être corrigés au même titre que les erreurs." +
					"<li>" +
						"À ce stade, pour chaque paragraphe vous pouvez éditer son contenu et modifier le mode de permutation de ses éléments. " +
						"Dans les 2 cas, pensez à cliquer sur le bouton vert « Actualiser »." +
					"</li>" +
					"<li>Cliquez sur le bouton vert « Statistiques de l'article ». Les statistiques suivantes apparaissent :</li>" +
					"<ul>" +
						"<li>nombre de paragraphes</li>" +
						"<li>nombre de résultats générés</li>" +
						"<li>nombre de mots minimum / maximum/ moyen</li>" +
						"<li>taux de variation / de perforation (voir plus haut)</li>" +
						"<li>indice de variation / de perforation / qualité (voir plus haut)</li>" +
					"</ul>" +
					"<li>À tout moment, vous êtes libre de cliquer sur le bouton rouge « Recommencer » et saisir ainsi un nouvel article au format Spintax.</li>" +
				"</ol>" +
			"</p>" +
			"<p class='title'><i style='margin-right:10px' class='fa fa-lightbulb-o'></i>À noter" +
				"<ul>" +
					"<li>Les avertissements concernant <span id='max-consecutive-words-without-variations'></span> mots consécutifs sans variation ne tiennent pas compte d'une <a href='#' onclick='$(\"#stop-words-list\").slideToggle(700)'>liste de stop-words</a>.</li>" +
					"<div id='stop-words-list'></div>" +
					"<li>En cas de téléchargement de fichiers, ceux-ci sont ajoutés par ordre alphabétique de nom de fichier.</li>" +
					"<li>L'affichage du bloc d'accolades courant est en version <i>Beta</i> et n'est pas garanti pour des textes comportant du code HTML.</li>" +
				"</ul>" +
			"</p>"
			);
		$(this).find('span#reference-variation-rate').html(SpincheckerV2.REFERENCE_RATE.VARIATION * 100);
		$(this).find('span#reference-perforation-rate').html(SpincheckerV2.REFERENCE_RATE.PERFORATION * 100);
		$(this).find('span#max-consecutive-words-without-variations').html(SpincheckerV2.NB_MAX_CONSECUTIVE_WORDS_WITHOUT_VARIATIONS);
		$(this).find('div#stop-words-list').html(SpincheckerV2.aStopWords.sort().join(', '));
		$(this).find('.close-button a').html("<i class='fa fa-fw fa-chevron-up'></i> Masquer l'aide").off('click').on('click', hideHelp);
		$(this).slideDown(400);
	});
	
}

function hideHelp() {
	$('.info-message[class~=help]').slideUp(400, function() {
		$(this).find('.help-content').html('');
		$(this).find('.close-button a').html("<i class='fa fa-fw fa-chevron-down'></i> Afficher l'aide").off('click').on('click', showHelp);
		$(this).slideDown(400);
	});
}
