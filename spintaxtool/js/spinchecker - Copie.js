
function SpincheckerV2() {
	
	/** PRIVATE PROPERTIES ***********************************************************************/

//	var $textarea;
//	var $infoMessage;
//	var spintax;
	var that = this;
	
	/** PUBLIC PROPERTIES ************************************************************************/
	
	this.ERROR_MESSAGE = {
		SPINTAX_IS_EMPTY: "Le paragraphe est vide",
		UNNECESSARY_OPENING_BRACKET: "Accolade ouvrante superflue",
		UNNECESSARY_CLOSING_BRACKET: "Accolade fermante superflue",
		UNNECESSARY_OPENING_BRACKET_OR_MISSING_PIPE: "Accolade ouvrante superflue ou pipeline manquant",
		UNNECESSARY_CLOSING_BRACKET_OR_MISSING_PIPE: "Accolade fermante superflue ou pipeline manquant",
		MISSING_MATCHING_OPENING_BRACKET_FOR_BRACKET: "Aucune accolade ouvrante correspondant à cette accolade fermante",
		MISSING_MATCHING_CLOSING_BRACKET_FOR_BRACKET: "Aucune accolade fermante correspondant à cette accolade ouvrante",
		MISSING_MATCHING_OPENING_BRACKET_FOR_PIPE: "Aucune accolade ouvrante correspondant à ce pipeline",
		MISSING_MATCHING_CLOSING_BRACKET_FOR_PIPE: "Aucune accolade fermante correspondant à ce pipeline"
	};
	
	/** PRIVATE METHODS **************************************************************************/
	
	/**
	 * @param	{string} spintax
	 * @param	{integer} index : index of an opening bracket
	 * @return	{integer} index of the matching closing bracket or error message
	 */
	function findIndexOfMatchingClosingBracketForOpeningBracket(spintax, index) {
		var depth = 0,
			pipeHavingSameDepthFound = false;
		for (var i=index+1; i<spintax.length; i++) {
			switch(spintax[i]) {
				case '{': depth++; break;
				case '}': if ( !depth-- ) { return ( pipeHavingSameDepthFound ? i : that.ERROR_MESSAGE.UNNECESSARY_OPENING_BRACKET_OR_MISSING_PIPE ) } break;
				case '|': if ( !depth ) { pipeHavingSameDepthFound = true; } break;
			}
		}
		return ( pipeHavingSameDepthFound ? that.ERROR_MESSAGE.MISSING_MATCHING_CLOSING_BRACKET_FOR_BRACKET : that.ERROR_MESSAGE.UNNECESSARY_OPENING_BRACKET );
	}
	
	/**
	 * @param	{string} spintax
	 * @param	{integer} index : index of a pipe
	 * @return	{integer} index of the matching closing bracket or error message 
	 */
	function findIndexOfMatchingClosingBracketForPipe(spintax, index) {
		var depth = 0;
		for (var i=index+1; i<spintax.length; i++) {
			switch(spintax[i]) {
				case '{': depth++; break;
				case '}': if ( !depth-- ) { return i; } break;
			}
		}
		return that.ERROR_MESSAGE.MISSING_MATCHING_CLOSING_BRACKET_FOR_PIPE;
	}
	
	/**
	 * @param	{string} spintax
	 * @param	{integer} index : index of a closing bracket
	 * @return	{integer} index of the matching closing bracket or error message
	 */
	function findIndexOfMatchingOpeningBracketForClosingBracket(spintax, index) {
		var depth = 0,
			pipeHavingSameDepthFound = false;
		for (var i=index-1; i>=0; i--) {
			switch(spintax[i]) {
				case '{': if ( !depth-- ) { return ( pipeHavingSameDepthFound ? i : that.ERROR_MESSAGE.UNNECESSARY_CLOSING_BRACKET_OR_MISSING_PIPE ); } break;
				case '}': depth++; break;
				case '|': if ( !depth ) { pipeHavingSameDepthFound = true; } break;
			}
		}
		return ( pipeHavingSameDepthFound ? that.ERROR_MESSAGE.MISSING_MATCHING_OPENING_BRACKET_FOR_BRACKET : that.ERROR_MESSAGE.UNNECESSARY_CLOSING_BRACKET );
	}
	
	/**
	 * @param	{string} spintax
	 * @param	{integer} index : index of a pipe
	 * @return	{integer} index of the matching opening bracket or error message
	 */
	function findIndexOfMatchingOpeningBracketForPipe(spintax, index) {
		var depth = 0;
		for (var i=index-1; i>=0; i--) {
			switch(spintax[i]) {
				case '{': if ( !depth-- ) { return i; } break;
				case '}': depth++; break;
			}
		}
		return that.ERROR_MESSAGE.MISSING_MATCHING_OPENING_BRACKET_FOR_PIPE;
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
	
	function displayCurrentBracketsBlock(e) {
		if ( $('#show-current-brackets-block').is(':checked') ) {
			var $paragraphContent = $(e.currentTarget),
			spintax = $paragraphContent.html().replace(/<span class="spintax-highlight">|<\/span>/g, ""),
			caretPosition = getCaretPosition($paragraphContent[0]),
			oIndexes = findIndexesOfCurrentBracketsBlock(spintax, caretPosition),
			newParagraphContent;
			if ( oIndexes.indexOpeningBracket != -1 && oIndexes.indexClosingBracket != -1 ) {
				newParagraphContent = spintax.replaceCharByString(oIndexes.indexOpeningBracket, '<span class="spintax-highlight">{');
				newParagraphContent = newParagraphContent.replaceCharByString(oIndexes.indexClosingBracket + newParagraphContent.length - spintax.length, "}</span>");
			}
			else {
				newParagraphContent = $paragraphContent.html().replace(/<span class="spintax-highlight">|<\/span>/g, "");
			}
			$paragraphContent.html(newParagraphContent);
		}
	}
	
	function getCaretPosition(editableDiv) {
		var caretOffset = 0,
			additionalOffset = 0;
		if (typeof window.getSelection != "undefined") {
			var range = window.getSelection().getRangeAt(0);
			var preCaretRange = range.cloneRange();
			preCaretRange.selectNodeContents(editableDiv);
			preCaretRange.setEnd(range.endContainer, range.endOffset);
			caretOffset = preCaretRange.toString().length;
		} else if (typeof document.selection != "undefined" && document.selection.type != "Control") {
			var textRange = document.selection.createRange();
			var preCaretTextRange = document.body.createTextRange();
			preCaretTextRange.moveToElementText(editableDiv);
			preCaretTextRange.setEndPoint("EndToEnd", textRange);
			caretOffset = preCaretTextRange.text.length;
		}
		
		// take into account <div> and </div>
		var $elt = $(editableDiv),
			html = $elt.html().replace(/<span class="spintax-highlight">|<\/span>/g,''),
			text = html.replace(/<\/?div>/g, '');
		if ( html.slice(0, caretOffset) != text.slice(0, caretOffset) ) {
			while ( html.slice(0, caretOffset) != text.slice(0, caretOffset) ) {
				if ( html.indexOf("<div>") >= 0 && html.indexOf("<div>") < caretOffset ) {
					html = html.replace("<div>", "");
					additionalOffset += 5;
				}
				if ( html.indexOf("</div>") >= 0 && html.indexOf("</div>") < caretOffset ) {
					html = html.replace("</div>", "");
					additionalOffset += 6;
				}
			}
			caretOffset += additionalOffset;
		}
		return caretOffset;
	}
//	function displayCurrentBracketsBlock(e) {
//		var $textarea = e.data,
//			indexCursor = $textarea.prop('selectionStart'),
//			textareaSpintax = $textarea.val(),
//			message,
//			oIndexes = findIndexesOfCurrentBracketsBlock(textareaSpintax, indexCursor);
//		if ( oIndexes.indexOpeningBracket != -1 && oIndexes.indexClosingBracket != -1 ) {
//			$textarea.textareaHighlighter(
//				'updateMatches',
//				[{
//					matchClass: 'highlighter', 
//					match: [textareaSpintax.substring(oIndexes.indexOpeningBracket, oIndexes.indexClosingBracket)]
//				}]);
//		}
//		else {
//			$textarea.textareaHighlighter( 'updateMatches', [] );
//		}
//	}
	
	/**
	 * @param	{integer} noParagraph
	 * @param	{string} paragraphContent
	 * @return	{object} paragraph content nested into the paragraph zone
	 */
	function createParagraphZone(noParagraph, paragraphContent) {
		$('#spintax-article').after('' +
			'<div class="paragraph-zone-container">' +
				'<div class="grid collapse-with-following">' +
					'<div class="unit half">' +
						'<label>Paragraphe ' + noParagraph + '</label>' +
					'</div>' +
					'<div class="unit half align-right">' +
						'<select id="permutation-mode-' + noParagraph + '" class="permutation-mode">' +
							'<option value="ALL_PERMUTABLE">Unités sémantiques toutes permutables' +
							'<option value="ALL_NOT_PERMUTABLE">Aucune unité sémantique permutable' +
							'<option value="ALL_PERMUTABLE_EXCEPT_FIRST">Unités sémantiques toutes permutables sauf la première' +
						'</select>' +
						'<button class="action mini" onclick="SpincheckerV2.analyzeParagraph($(\'#spintax-paragraph-' + noParagraph + '\'))">Actualiser</button>' +
					'</div>' +
				'</div>' +
				'<div class="grid">' +
					'<div class="unit whole">' +
						'<div id="spintax-paragraph-' + noParagraph + '" name="spintax-paragraph-' + noParagraph + '" class="spintax">' + paragraphContent + '</div>' +
						'<div class="info-message justify" style="display:none"></div>' +
					'</div>' +
				'</div>' +
			'</div>');
		
		var $paragraphContent = $('#spintax-paragraph-' + noParagraph).on('keyup click', displayCurrentBracketsBlock);
		$paragraphContent[0].contentEditable = true;
		return $paragraphContent;
	}
	
	/**
	 * @param	{object} $infoMessage
	 * @param	{string} messageClass : "success" / "error"
	 * @param	{string} message
	 * @return
	 */
	function displayParagraphInfoMessage($infoMessage, messageClass, message) {
		$infoMessage.html(message);
		if ( !$infoMessage.hasClass(messageClass) ) {
			$infoMessage.removeClass('error').removeClass('success').addClass(messageClass);
		}
		if ( !$infoMessage.is(':visible') ) {
			$infoMessage.slideDown(400);
		}
	}

	/**
	 * @param	{object} $paragraphContent
	 * @return
	 */
	function displayParagraphStats($paragraphContent) {
		var noParagraph = $paragraphContent.prop('id').replace('spintax-paragraph-', ''),
			paragraphSpintax = calculateParagraphSpintaxAfterPermutation( getParagraphHtmlContent($paragraphContent), $('#permutation-mode-' + noParagraph ).val() ),
			paragraphStats;
		
		console.log(paragraphSpintax)
		paragraphStats = '' +
			'Taux de spin : ' + 
			new String(getSpinRate(getParagraphHtmlContent($paragraphContent))).replace('.',',') + ' %' +
			'<br>Nb de variations : ' +
			getNbVariations(paragraphSpintax, true);
		displayParagraphInfoMessage($paragraphContent.next('.info-message'), 'success', paragraphStats);
	}
	
	function getParagraphHtmlContent($paragraphContent) {
		return $paragraphContent.html().replace(/&lt;/g,'<').replace(/&gt;/g,'>');
	}
	
	/**
	 * @param	{string} spintax
	 * @return	{integer} spin rate in percents
	 */
	function getSpinRate(spintax) {
		var tree = SpinerMan.buildTree(spintax);
		return ((tree.s.w > 0 && tree.r > 0) ? (100 * tree.s.r / (tree.s.w / tree.r)).toFixed(1) : 0);
	}
	
	/**
	 * @param	{string} spintaxWithDivs
	 * @return	{string} 
	 */
	function calculateParagraphSpintaxBeforePermutation(spintaxWithDivs) {
		var spintax = '',
			aSemanticUnits = spintaxWithDivs.replace(/<\/div>/g,'').split('<div>').clean('');
		
		$.each(aSemanticUnits, function(i,v) {
			spintax += ( !i ? '' : ' ') + v;
		});
		return spintax;
	}
	
	/**
	 * @param	{string} spintaxWithDivs
	 * @param	{stringr} permutationMode : ALL_PERMUTABLE / ALL_NOT_PERMUTABLE / ALL_PERMUTABLE_EXCEPT_FIRST
	 * @return	{string} 
	 */
	function calculateParagraphSpintaxAfterPermutation(spintaxWithDivs, permutationMode) { // JSSI
		var spintax = '',
			aSemanticUnits = spintaxWithDivs.replace(/<\/div>/g,'').split('<div>').clean('');
		
		switch(permutationMode) {
			case 'ALL_PERMUTABLE':
				if ( aSemanticUnits.length == 1 ) {
					spintax = aSemanticUnits[0];
				}
				else {
					var aCombinations = Combinatorics.permutation(aSemanticUnits).toArray();
					spintax += '{';
					$.each(aCombinations, function(i,v) {
						spintax += ( !i ? '' : '|') + v.join(' ');
					});
					spintax += '}';
				}
				break;
			case 'ALL_NOT_PERMUTABLE':
				$.each(aSemanticUnits, function(i,v) {
					spintax += ( !i ? '' : ' ') + v;
				});
				break;
			case 'ALL_PERMUTABLE_EXCEPT_FIRST':
				spintax += aSemanticUnits.shift() + ' ';
				if ( aSemanticUnits.length >= 2 ) {
					var aCombinations = Combinatorics.permutation(aSemanticUnits).toArray();
					spintax += '{';
					$.each(aCombinations, function(i,v) {
						spintax += ( !i ? '' : '|') + v.join(' ');
					});
					spintax += '}';
				}
				else {
					spintax += aSemanticUnits.shift();
				}
				break;
			default: alert("Function calculateParagraphSpintaxAfterPermutation() : ERROR !!");
		}
		
		return spintax;
	}
	
	/**
	 * @param	{string} spintax
	 * @param	{boolean} formatBigNumber
	 * @return	{integer} nb of permutations
	 */
	function getNbVariations(spintax, formatBigNumber) {
		var tree = SpinerMan.buildTree(spintax);
		return ( formatBigNumber ? new String(tree.r).formatBigNumber() : tree.r );
	}
	
	/**
	 * @param	{string} spintax
	 * @return	{object} of type { minWords:3, maxWords:50, avgWords:22.6 }
	 */
	function getWordsStats(spintax) {
		var tree = SpinerMan.buildTree(spintax),
			stats = SpinerMan.getStats(tree);
		return { minWords:stats.minWords, maxWords:stats.maxWords, avgWords:stats.avgWords };
	}
	
	/**
	 * @param	none
	 * @return	none
	 */
	function displayGlobalStats() {
		var globalStats = '',
			globalSpintaxBeforeSemanticUnitsPermutations = '',
			globalSpintaxAfterSemanticUnitsPermutations = '',
			$infoMessage = $('<div id="global-stats" class="info-message info justify"></div>'),
			$aSpintaxParagraphs = $('div[id^=spintax-paragraph-]'),
			wordsStats;
		
		if ( $aSpintaxParagraphs.length == 1 ) {
			globalSpintaxBeforeSemanticUnitsPermutations = calculateParagraphSpintaxBeforePermutation($aSpintaxParagraphs.text());
			globalSpintaxAfterSemanticUnitsPermutations = calculateParagraphSpintaxAfterPermutation($aSpintaxParagraphs.text(), $('#permutation-mode-1').val() );
		}
		else {
			globalSpintaxBeforeSemanticUnitsPermutations += '{';
			globalSpintaxAfterSemanticUnitsPermutations += '{';
			$.each($aSpintaxParagraphs, function(i,v) {
				globalSpintaxBeforeSemanticUnitsPermutations += ( !i ? '' : '|') + calculateParagraphSpintaxBeforePermutation($(this).text());
				globalSpintaxAfterSemanticUnitsPermutations += ( !i ? '' : '|') + calculateParagraphSpintaxAfterPermutation( $(this).text(), $('#permutation-mode-' + parseInt(i+1)).val() );
			});
			globalSpintaxBeforeSemanticUnitsPermutations += '}';
			globalSpintaxAfterSemanticUnitsPermutations += '}';
		}
		
		// Global stats result
		globalStats += 'Taux de spin global : ' + new String(getSpinRate(globalSpintaxBeforeSemanticUnitsPermutations)).replace('.',',') + ' %';
		
		globalStats += '<br>Nb de variations : ' +  getNbVariations(globalSpintaxAfterSemanticUnitsPermutations, true);
		
		wordsStats = getWordsStats(globalSpintaxBeforeSemanticUnitsPermutations);
		globalStats += '<br>Nb de mots : ' +
			'minimum ' + wordsStats.minWords + ' / ' +
			'maximum ' + wordsStats.maxWords + ' / ' +
			'moyenne ' + new String(wordsStats.avgWords).replace('.', ',');
		
		$('.paragraph-zone-container').last().after($infoMessage);
		$infoMessage.html(globalStats);
		
		// Action button deactivation
		$('#submitButton').removeClass('action').addClass('disabled').off('click');
	}
	
	/** PUBLIC METHODS ***************************************************************************/
	
//	/**
//	 * @param	{object} $textarea : textarea of the spintax for which the current brackets block displaying should be turned on
//	 * @return	none
//	 */
//	this.turnOnCurrentBracketsBlockDisplaying = function($textarea) {
//		$textarea.textareaHighlighter( { matches: [] } );
//		$textarea.on('keyup click', $textarea, displayCurrentBracketsBlock);
//		$textarea.trigger('keyup');
//	}
//	
//	/**
//	 * @param	{object} $textarea : textarea of the spintax for which the current brackets block displaying should be turned off
//	 * @return	none
//	 */
//	this.turnOffCurrentBracketsBlockDisplaying = function($textarea) {
//		$textarea.off('keyup click', displayCurrentBracketsBlock);
//		$textarea.textareaHighlighter( 'updateMatches', [] );
//	}
	
//	/**
//	 * @param	{object} $textarea : textarea of the spintax for which the current brackets block displaying should be turned on
//	 * @return	none
//	 */
//	this.turnOnCurrentBracketsBlockDisplaying = function($textarea) {
//		$('#div-current-brackets-block').slideDown(400);
//		$textarea.on('keyup click', $textarea, displayCurrentBracketsBlock);
//		$textarea.trigger('keyup');
//	}
//	
//	/**
//	 * @param	{object} $textarea : textarea of the spintax for which the current brackets block displaying should be turned off
//	 * @return	none
//	 */
//	this.turnOffCurrentBracketsBlockDisplaying = function($textarea) {
//		$('#div-current-brackets-block').slideUp(400);
//		$textarea.off('keyup click', displayCurrentBracketsBlock);
//	}
	
	
	/**
	 * @param	{string} spintax
	 * @return	{array of objects} each object looks like { index:12, message:"..." }. Empty array if no errors where found 
	 */
	this.searchSpintaxErrors = function(spintax) {
		var aErrors = [],
			result;
		if ( !spintax.length ) {
			aErrors.push({ index:0, message:this.ERROR_MESSAGE.SPINTAX_IS_EMPTY });
		}
		for (var i=0; i<spintax.length; i++) {
			switch(spintax[i]) {
				case '{':
					result = findIndexOfMatchingClosingBracketForOpeningBracket(spintax, i);
					if ( typeof result == "string" ) {
						aErrors.push({ index:i, message:result });
					}
					break;
				case '}':
					result = findIndexOfMatchingOpeningBracketForClosingBracket(spintax, i);
					if ( typeof result == "string" ) {
						aErrors.push({ index:i, message:result });
					}
					break;
				case '|':
					result = findIndexOfMatchingOpeningBracketForPipe(spintax, i);
					if ( typeof result == "string" ) {
						aErrors.push({ index:i, message:result });
					}
					result = findIndexOfMatchingClosingBracketForPipe(spintax, i);
					if ( typeof result == "string" ) {
						aErrors.push({ index:i, message:result });
					}
					break;
			}
		}
		return aErrors;
	}
	
	this.analyzeSpintaxArticle = function() {
		var $paragraphContent,
			aParagraphsContents,
			noErrorForAllParagraphs = true;
		
		$('.paragraph-zone-container').remove();
		
		if ( !$('#spintax-article').html() ) {
			MyUtils.displayInfoMessage('error', "Veuillez saisir un article Spintax à analyser.");
			$('#spintax-article').focus();
			return;
		}
		
		/**
		 * JSI : LE CAS ECHEANT faire un sanitize du contenu de $('#spintax-article') en n'insérant pour séparateur de lignes qu'un <br>
		 * Suivre le code pour réadapter tous les traitements
		 * Ne pas oublier de vérifier la fonction de highlighting
		 * Travailler sur l'exemple suivant :
		 * 
		 * {a|b}
		 * 
		 * {|sp1n.me is a {{beautiful |}{{content |}text |}{spinner|generator}|{wonderful |}{service|tool}} which {allows you to|can} {easily|recursively} {spin|rotate|generate} {text|text content|content}.}
		 */
		
		aParagraphsContents = $('#spintax-article').html().split('<div><br></div>');
		for ( var i=aParagraphsContents.length-1; i>=0; i-- ) {
			$paragraphContent = createParagraphZone(i+1, aParagraphsContents[i]);
			that.analyzeParagraph($paragraphContent); // JSSI
		}
		
		if ( noErrorForAllParagraphs ) {
			$('#submitButton').html("Métriques globales").off('click').on('click', displayGlobalStats);
		}
	}
	
	/**
	 * @param	{object} $paragraphContent
	 * @return	{boolean} true (at least one error) / false (no error)
	 */
	this.analyzeParagraph = function($paragraphContent) {
		var spintax = $paragraphContent.html(),
			aErrors = this.searchSpintaxErrors(spintax);
		
		if ( aErrors.length ) {
			var message = '', char;
			for (var i=0; i<aErrors.length; i++) {
				message += "<p style='text-align:justify; padding: 10px 0 0 0; margin:0 0 5px 0;'>";
				message += aErrors[i].message;
				if ( aErrors[i].message != that.ERROR_MESSAGE.SPINTAX_IS_EMPTY ) {
					char = spintax[aErrors[i].index];
					message += "<div class='spintax'>" + spintax.replaceCharByString(aErrors[i].index, "<span class='spintax-error'>" + char + "</span>") + "</div>";
				}
				message += "</p>";
			}
			displayParagraphInfoMessage($paragraphContent.next('.info-message'), 'error', message);
		}
		else {
			displayParagraphStats($paragraphContent);
		}
		
		return ( aErrors.length > 0 );
	}
}

var SpincheckerV2 = new SpincheckerV2();

/*************************************************************************************************/

function initForm() {
	$('#spintax-article')[0].contentEditable = true;
	resetForm();
}

function resetForm() {
	hideHelp();
	$('#spintax-article').html('').focus();
	$('.paragraph-zone-container').remove();
	MyUtils.hideInfoMessage();
	$('#submitButton').removeClass('disabled').addClass('action').html("Analyse de l'article").on('click', SpincheckerV2.analyzeSpintaxArticle);
	$('#global-stats').remove();
}

function showHelp() {
	$('.info-message[class~=help]').slideUp(400, function() {
		$(this).find('.help-content').html('' +
			"<p>Cet outil permet d'analyser la syntaxe d'un article au format Spintax et d'en calculer les métriques.</p>" +
			"<p>" +
				"Utilisation :" +
				"<ul>" +
					"<li>RAF</li>" +
				"</ul>" +
			"</p>" +
			"<p>" +
				"Conventions de nommage :" +
				"<ul>" +
					"<li>un <u><i>article</i></u> contient un ou plusieurs paragraphes, séparés par deux retours chariot</li>" +
					"<li>un <u><i>paragraphe</i></u> contient plusieurs unités sémantiques, séparées par un seul retour chariot</li>" +
					"<li>une <u><i>unité sémantique</i></u> contient une ou plusieurs phrases écrites au format Spintax</li>" +
				"</ul>" +
			"</p>");
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

function clickOnCheckboxShowCurrentBracketsBlock() {
	if ( !$('#show-current-brackets-block').is(':checked') ) {
		$.each($('div[id^=spintax-paragraph-]'), function(i,v) {
			$(this).html($(this).html().replace(/<span class="spintax-highlight">|<\/span>/g, ''));
		});
	}
}












//function testTurnOffTextareaHighlighting() {
//	var $textarea = $("<textarea class='autofit'>fafa</textarea>");
//	$('body').append("<form class='db-form' id='myform'></form>");
//	$('#myform').append($textarea);
//	
//	return;
//	$textarea.css('position', 'relative');
//	
//	var $highlighterContainer = $("<div class='highlighter-container'></div>");
//	$highlighterContainer.insertBefore($textarea);
//	var aCssToDuplicate = ['font-family', 'font-size', 'marging', 'padding', 'width', 'height'];
//	$.each(aCssToDuplicate, function(i,v) {
//		$highlighterContainer.css(v, $textarea.css(v));
//	});
//} 










