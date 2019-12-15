

function Spinchecker() {



	/** PUBLIC PROPERTIES ************************************************************************/

	

	this.REFERENCE_RATE = { VARIATION: 1.85, PERFORATION: 0.8 };

	this.NB_MAX_CONSECUTIVE_WORDS_WITHOUT_VARIATIONS = 3;

	this.aStopWords = [];

	this.aUploadedFileNames = [];

	

	/** PRIVATE PROPERTIES ***********************************************************************/



	var _this = this,

		ERROR_MESSAGE = {

			CONSECUTIVE_WORDS_WITHOUT_VARIATIONS: { type:'WARNING', message:null },
			
			END_PUNCTUTAION_SIGN: { type:'WARNING', message:null },
			
			START_LOWER_CASE: { type:'WARNING', message:null },
			
			START_BLANK: { type:'WARNING', message:null },
			
			LINE_NUMBER: { type:'WARNING', message:null },

			SPINTAX_IS_EMPTY: { type:'ERROR', message:null },

			UNNECESSARY_OPENING_BRACKET_OR_MISSING_PIPE: { type:'ERROR', message:null },

			UNNECESSARY_CLOSING_BRACKET_OR_MISSING_PIPE: { type:'ERROR', message:null },

//			UNNECESSARY_OPENING_BRACKET: { type:'ERROR', message:null },

//			UNNECESSARY_CLOSING_BRACKET: { type:'ERROR', message:null },

			MISSING_MATCHING_OPENING_BRACKET_FOR_BRACKET: { type:'ERROR', message:null },

			MISSING_MATCHING_CLOSING_BRACKET_FOR_BRACKET: { type:'ERROR', message:null },

			MISSING_MATCHING_OPENING_BRACKET_FOR_PIPE: { type:'ERROR', message:null },

			MISSING_MATCHING_CLOSING_BRACKET_FOR_PIPE: { type:'ERROR', message:null }

		},

		HTML_TAG_STATUS = { OPENED: 1, ALMOST_CLOSED: 2, CLOSED: 3},

		justGageUniqueId = 1,

		PUBLIC_SITE_VERSION = false;

	

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

		var example = spintax;
			var coordinates = example.split( "\n" );
			var resultsValidation = [];
			var sum=0;
			var k=0;
			var increm=0;
			for( var i = 0; i < coordinates.length; ++i ) {
			
				var strings = coordinates[i];
				var index_count = coordinates[i].length;
				k=i-1;
				increm++;
				sum += parseInt(coordinates[i].length);	
				//alert(sum);
				resultsValidation.push(sum);
						if(i !=0){
									var error_place=i;
									}else{
									var error_place=0;	
										}

					if (coordinates[i].charAt(0) == coordinates[i].charAt(0).toLowerCase() && coordinates[i].charAt(0) != "{" && coordinates[i].charAt(0) != " " && coordinates[i].charAt(0) != "<" && coordinates[i].charAt(1) != "<"){
						//alert(coordinates[i].charAt(0));
									if(i !=0){
									var error_place=i-1;
									var count_place=resultsValidation[error_place];	
									}else{
									var error_place=0;
									var count_place=0;
										}
										
										//alert(resultsValidation[error_place]);
										ERROR_MESSAGE.START_LOWER_CASE.message=ERROR_MESSAGE.LINE_NUMBER.message+increm+"&nbsp;:&nbsp;"+ERROR_MESSAGE.START_LOWER_CASE.message.toLowerCase();
									aErrors.push($.extend({index:count_place+i}, ERROR_MESSAGE.START_LOWER_CASE));
									ERROR_MESSAGE.START_LOWER_CASE.message=ERROR_MESSAGE.START_LOWER_CASE.message.replace(ERROR_MESSAGE.LINE_NUMBER.message+increm+"&nbsp;:&nbsp;","");
								}
					if (coordinates[i].charAt(0) == " " && coordinates[i].charAt(1) == "{"){
						
						//alert('yes');
						//alert(i);
									if(i !=0){
									var error_place=i-1;
									}else{
									var error_place=0;	
										}
										
									ERROR_MESSAGE.START_BLANK.message=ERROR_MESSAGE.LINE_NUMBER.message+increm+"&nbsp;:&nbsp;"+ERROR_MESSAGE.START_BLANK.message.toLowerCase();
									
									aErrors.push($.extend({index:resultsValidation[error_place]+i}, ERROR_MESSAGE.START_BLANK));
									
									ERROR_MESSAGE.START_BLANK.message=ERROR_MESSAGE.START_BLANK.message.replace(ERROR_MESSAGE.LINE_NUMBER.message+increm+"&nbsp;:&nbsp;","");
						}	
								var total_letters=coordinates[i].trim();
								var lastChar = total_letters.substr(total_letters.length - 1);
									
								if(lastChar != '}' && lastChar != '.' && lastChar != '!' && lastChar != '?' && lastChar != ':' && lastChar != '>'){
									//alert(lastChar);
									ERROR_MESSAGE.END_PUNCTUTAION_SIGN.message=ERROR_MESSAGE.LINE_NUMBER.message+increm+"&nbsp;:&nbsp;"+ERROR_MESSAGE.END_PUNCTUTAION_SIGN.message.toLowerCase();
									//alert(resultsValidation[error_place]);
									//alert(i);
									aErrors.push($.extend({index:resultsValidation[i]+i}, ERROR_MESSAGE.END_PUNCTUTAION_SIGN));
									
									ERROR_MESSAGE.END_PUNCTUTAION_SIGN.message=ERROR_MESSAGE.END_PUNCTUTAION_SIGN.message.replace(ERROR_MESSAGE.LINE_NUMBER.message+increm+"&nbsp;:&nbsp;","");
									
									}
				var count =0;					
				for (var l=0; l<strings.length; l++) {	

						if(i !=0){
									var error_place=i;
									}else{
									var error_place=0;	
										}
				switch(strings[l]) {

				case '{':

					oResult = findIndexOfMatchingClosingBracketForOpeningBracket(strings, l);

					if ( typeof oResult == "object" ) {
						var count =0;	
						if(i !=0){
							
							count = resultsValidation[error_place-1]+l+i;
							
							}else{
								
							count = l;	
							
								}
						//alert(increm);
						oResult.message=ERROR_MESSAGE.LINE_NUMBER.message+increm+"&nbsp;:&nbsp;"+oResult.message.toLowerCase();
						aErrors.push($.extend({index:count}, oResult));
						oResult.message=oResult.message.replace(ERROR_MESSAGE.LINE_NUMBER.message+increm+"&nbsp;:&nbsp;","");

					}

					break;

				case '}':

					oResult = findIndexOfMatchingOpeningBracketForClosingBracket(strings, l);

					if ( typeof oResult == "object" ) {
						var count =0;	
								if(i !=0){
							
							count = resultsValidation[error_place-1]+l+i;
							
							}else{
								
							count = l;	
							
								}
						oResult.message=ERROR_MESSAGE.LINE_NUMBER.message+increm+"&nbsp;:&nbsp;"+oResult.message.toLowerCase();
						aErrors.push($.extend({index:count}, oResult));
						oResult.message=oResult.message.replace(ERROR_MESSAGE.LINE_NUMBER.message+increm+"&nbsp;:&nbsp;","")

					}

					break;

				case '|':

					oResult = findIndexOfMatchingOpeningBracketForPipe(strings, l);

					if ( typeof oResult == "object" ) {
						var count =0;	
								if(i !=0){
									//alert(i);
									//alert(coordinates[0].length);
							//alert(resultsValidation[error_place-1]+l);
							count = resultsValidation[error_place-1]+l+i;
							//alert(resultsValidation[error_place-1]+l+i);
							}else{
								
							count = l;	
							
								}
//alert(l);
//alert(i);
						oResult.message=ERROR_MESSAGE.LINE_NUMBER.message+increm+"&nbsp;:&nbsp;"+oResult.message.toLowerCase();
						aErrors.push($.extend({index:count}, oResult));
						oResult.message=oResult.message.replace(ERROR_MESSAGE.LINE_NUMBER.message+increm+"&nbsp;:&nbsp;","")

					}

					oResult = findIndexOfMatchingClosingBracketForPipe(strings, l);

					if ( typeof oResult == "object" ) {
						var count =0;	
								if(i !=0){
							
							count = resultsValidation[error_place-1]+l+i;
							
							}else{
								
							count = l;	
							
								}
								
						oResult.message=ERROR_MESSAGE.LINE_NUMBER.message+increm+"&nbsp;:&nbsp;"+oResult.message.toLowerCase();
						
						aErrors.push($.extend({index:count}, oResult));
						
						oResult.message=oResult.message.replace(ERROR_MESSAGE.LINE_NUMBER.message+increm+"&nbsp;:&nbsp;","")

					}

					break;

			}
				}
   
			}
			
		/*for (var i=0; i<spintax.length; i++) {

			switch(spintax[i]) {

				case '{':
					oResult = findIndexOfMatchingClosingBracketForOpeningBracket(spintax, i);

					if ( typeof oResult == "object" ) {
alert(i);

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

		}*/

		

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

		//return ( pipeHavingSameDepthFound ? ERROR_MESSAGE.MISSING_MATCHING_CLOSING_BRACKET_FOR_BRACKET : ERROR_MESSAGE.UNNECESSARY_OPENING_BRACKET );

		return ( pipeHavingSameDepthFound ? ERROR_MESSAGE.MISSING_MATCHING_CLOSING_BRACKET_FOR_BRACKET : ERROR_MESSAGE.UNNECESSARY_OPENING_BRACKET_OR_MISSING_PIPE );

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

//		return ( pipeHavingSameDepthFound ? ERROR_MESSAGE.MISSING_MATCHING_OPENING_BRACKET_FOR_BRACKET : ERROR_MESSAGE.UNNECESSARY_CLOSING_BRACKET );

		return ( pipeHavingSameDepthFound ? ERROR_MESSAGE.MISSING_MATCHING_OPENING_BRACKET_FOR_BRACKET : ERROR_MESSAGE.UNNECESSARY_CLOSING_BRACKET_OR_MISSING_PIPE );

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

			isCurrentWordBetweenChevrons = false,

			htmlTagStatus = HTML_TAG_STATUS.CLOSED,

			mayPushCurrentWordIntoArrayReadWords = function() {

//			console.log('*' + currentWord + '*', htmlTagStatus);

				if ( currentWord && !isCurrentWordBetweenChevrons && htmlTagStatus == HTML_TAG_STATUS.CLOSED ) {

					if ( isStopWord(currentWord) || isProperName(currentWord) || isVariable(currentWord) ) {

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

				case '«':

				case '»':

				case '<':

				case '>':

					mayPushCurrentWordIntoArrayReadWords();

					if ( searchingForConsecutiveWords ) {

						searchingForConsecutiveWords = false;

						mayAddElementToResult();

						aReadWords = [];

					}

					switch ( spintax[i] ) {

						case "«": isCurrentWordBetweenChevrons = true; break;

						case "»": isCurrentWordBetweenChevrons = false; break;

						case "<":

							htmlTagStatus = HTML_TAG_STATUS.OPENED;

							break;

						case ">":

							if ( htmlTagStatus == HTML_TAG_STATUS.ALMOST_CLOSED ) {

								htmlTagStatus = HTML_TAG_STATUS.CLOSED;

							}

							break;

					}

					currentWord = '';

					break;

				

				case ' ':

				case ';':

				case ',':

				case ':':

				case '+':

				case '/':

				case "'":

				case "’":

				case '"':

					mayPushCurrentWordIntoArrayReadWords();

					currentWord = '';

					if ( spintax[i] == '/' && htmlTagStatus == HTML_TAG_STATUS.OPENED ) {

						htmlTagStatus = HTML_TAG_STATUS.ALMOST_CLOSED;

					}

					break;

					

				default :

					currentWord += spintax[i];

					if ( !searchingForConsecutiveWords ) {

						searchingForConsecutiveWords = true;

						indexStartConsecutiveWords = i;

					}

			}

		}

		mayPushCurrentWordIntoArrayReadWords();

		mayAddElementToResult();

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

	

	/**

	 * @param {string} word

	 * @return {boolean}

	 */

	function isVariable(word) {

		return ( word[0] == "$" || word[0] == "#" );

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

		var defaultPermutationMode = $('#default-permutation-mode').val(),

			$paragraphZone = $('' +

				'<div class="paragraph-container" data-title="' + paragraphTitle + '">' +

					'<div class="grid collapse-with-following">' +

						'<div class="unit half">' +

							'<label>' + paragraphTitle + '</label>' +

						'</div>' +

						'<div class="unit half align-right">' +

							'<select id="permutation-mode-' + noParagraph + '" class="mini">' +

								'<option value="ALL_NOT_PERMUTABLE">' + MySpeech.get("form.select.permutation_mode_none") + '</option>' +

								'<option value="ALL_PERMUTABLE">' + MySpeech.get("form.select.permutation_mode_all") + '</option>' +

								'<option value="ALL_PERMUTABLE_EXCEPT_FIRST">' + MySpeech.get("form.select.permutation_mode_all_except_first")+ '</option>' +

							'</select>' +

							'<button class="action mini" onclick="var $paragraphContent = $(\'#spintax-paragraph-' + noParagraph + '\'); Spinchecker.analyzeParagraph($paragraphContent, true); scrollToElement($paragraphContent.parents(\'.paragraph-container\').find(\'.info-message-wrapper\'));">' + MySpeech.get("form.button.refresh") + '</button>' +

						'</div>' +

					'</div>' +

					

					'<div class="grid">' +

						'<div class="unit whole">' +

							'<div class="spintax-paragraph-wrapper">' +

								'<div class="db-toggle" data-title="' + MySpeech.get("message.spintax_paragraph") + '">' +

									'<div class="highlighter-container"></div>' +

									'<textarea id="spintax-paragraph-' + noParagraph + '" name="spintax-paragraph-' + noParagraph + '" class="spintax autosize" rows="1"></textarea>' +

								'</div>' +

							'</div>' +

						'</div>' +

					'</div>' +

							

					'<div class="grid">' +

						'<div class="unit whole">' +

//							'<div class="highlighter-container"></div>' +

//							'<textarea id="spintax-paragraph-' + noParagraph + '" name="spintax-paragraph-' + noParagraph + '" class="spintax autosize" rows="1"></textarea>' +

							'<div class="info-message-wrapper">' +

								'<div class="db-toggle" data-title="">' +

									'<div class="info-message error" style="padding: 0 !important;"></div>' + // for warnings/errors message

//									'<div class="info-message" style="margin-top: 10px"></div>' + // for stats

								'</div>' +

							'</div>' +

							'<div class="info-message" style="margin-top: 10px"></div>' + // for stats

						'</div>' +

					'</div>' +

				'</div>');

		

		$paragraphZone.find('select.mini option[value="' + defaultPermutationMode + '"]').prop('selected', true);

		$('#main-zone').after($paragraphZone);

		

		return $('#spintax-paragraph-' + noParagraph).css('height', '1em').val(paragraphContent).textareaAutoSize();

	}

	

	function prepareWarningsErrorsMessage(aErrors, spintax, noParagraph) {

		var message = '';

		$.each(aErrors, function(i, error) {

			if ( error != ERROR_MESSAGE.SPINTAX_IS_EMPTY ) {

				message += "<p class='" + error.type.toLowerCase() + "'>";

				message += ( error.type == 'ERROR' ? "<i title='" + MySpeech.get("message.error_uppercase") + "' class='fa fa-fw fa-exclamation-circle'></i>" : "<i title='" + MySpeech.get("message.warning_uppercase") + "' class='fa fa-fw fa-exclamation-circle'></i>");

				message += error.message;

				message += "</p>";

				message += "<div class='spintax'>" + formatSpintaxShownInErrorMessages(spintax, error.index, noParagraph, error) + "</div>";

			}

		});

		return message;

	}

	

	/**

	 * @param	{object} $paragraphContent

	 * @return

	 */

	function prepareParagraphStatsMessage($paragraphContent, noParagraph) {

		var spintax = $paragraphContent.val().trim(),

			oWordsStats = getWordsStats(spintax),

			nbParagraphElements = spintax.split('\n').length,

			nbResults = getNbResultsForParagraph(spintax, $('#permutation-mode-' + noParagraph ).val(), true);



		return '' +

			'<div class="grid">' +

				'<div class="unit three-fifths">' +

					'<div class="stats-resume">' +

						MySpeech.get("message.paragraph_number") + " " + noParagraph + " " + MySpeech.get("message.contains") + " " + nbParagraphElements + " " + MySpeech.get("message.element") + (nbParagraphElements > 1 ? 's' : '') + " " + MySpeech.get("message.having_permutation_mode") + MySpeech.get("message.having_quote_arrow_pre") +"" + $('#permutation-mode-' + noParagraph + ' option:selected').text().lcFirst() + MySpeech.get("message.having_quote_arrow_nex")+". " +

						MySpeech.get("message.results_total_is") + " " + ( nbResults == Infinity || isNaN(nbResults) ? MySpeech.get("message.close_to_infinity") :  nbResults ) + ". " +

						MySpeech.get("message.paragraph_has_replacement_rate") + " " + ( isNaN(oWordsStats.variationRate) ? MySpeech.get("message.close_to_infinity") : MySpeech.get("message.of") + " " + new String(oWordsStats.variationRate).replace('.', MySpeech.get("message.having_seprator_avg")) + "% " ) + " " +

						MySpeech.get("message.and_hole_rate") + " " + ( isNaN(oWordsStats.perforationRate) ? MySpeech.get("message.close_to_infinity") : MySpeech.get("message.of") + " " + new String(oWordsStats.perforationRate).replace('.', MySpeech.get("message.having_seprator_avg")) + "%" ) + "." +

					'</div>' +

				'</div>' +

				'<div class="unit two-fifths align-right">' +

					'<div class="gauge spinchecker" data-gauge-value="' + (isNaN(oWordsStats.variationIndex) ? 0 : oWordsStats.variationIndex) + '"></div>' +

					'<div class="gauge spinchecker" data-gauge-value="' + (isNaN(oWordsStats.perforationIndex) ? 0 : oWordsStats.perforationIndex) + '"></div>' +

					'<div class="gauge spinchecker" data-gauge-value="' + (isNaN(oWordsStats.qualityIndex) ? 0 : oWordsStats.qualityIndex) + '"></div>' +

				'</div>' +

			'</div>';

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

		

//		result.qualityIndex = ( !result.totalHoles ? 0 : parseFloat((( result.totalVariations / result.totalHoles ) / ( _this.REFERENCE_RATE.VARIATION / _this.REFERENCE_RATE.PERFORATION )).toFixed(1)) );

		result.qualityIndex = ( !result.totalHoles ? 0 : parseFloat( (result.perforationIndex * ((result.totalHoles/result.totalVariations) / (_this.REFERENCE_RATE.PERFORATION/_this.REFERENCE_RATE.VARIATION))).toFixed(1) ) );

		

		return result;

	}

	

	/**

	 * @param	none

	 * @return	none

	 */

	function displayArticleStats() {

		var articleStats,

			articleSpintaxWithoutPermutation = '', // i.e. without paragraph permutations or paragraph elements permutations

			$infoMessage = $('<div id="article-stats" class="info-message info justify" style="margin:20px 0 10px 0"></div>'),

			$aParagraphContents = $('textarea[id^=spintax-paragraph-]'),

			nbParagraphs = $aParagraphContents.length,

			nbResults,

			oWordsStats;

		

		// Should the process continue ?

		if ( $('.paragraph-container .info-message p').hasClass('error') ) {

			MyUtils.displayInfoMessage('warning', MySpeech.get("message.warning.unable_to_process_spintax_errors_remain"));

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

						MySpeech.get("message.this_article_has") + " " + nbParagraphs + " " + MySpeech.get("message.paragraph_lowercase") + (nbParagraphs > 1 ? 's' : '') + ". " +

						MySpeech.get("message.results_total_is") + " " + ( nbResults == Infinity || isNaN(nbResults)  ? MySpeech.get("message.close_to_infinity") : nbResults) + ". " +

						MySpeech.get("message.word_count_between") + " " + addThousandsSeparator(oWordsStats.minWords) + " " + MySpeech.get("message.and") + " " + addThousandsSeparator(oWordsStats.maxWords) + " " + 

						MySpeech.get("message.with_average") + " " + new String(parseFloat(oWordsStats.avgWords.toFixed(1))).replace('.', MySpeech.get("message.having_seprator_avg")) + " " + MySpeech.get("message.word") + "s. " +

						MySpeech.get("message.article_has_replacement_rate") + " " + ( isNaN(oWordsStats.variationRate) ? MySpeech.get("message.close_to_infinity") : MySpeech.get("message.of") + " " + new String(oWordsStats.variationRate).replace('.', MySpeech.get("message.having_seprator_avg")) + "%" ) + " " +

						MySpeech.get("message.and_hole_rate") + " " + ( isNaN(oWordsStats.perforationRate) ? MySpeech.get("message.close_to_infinity") : MySpeech.get("message.of") + " " + new String(oWordsStats.perforationRate).replace('.', MySpeech.get("message.having_seprator_avg")) + "%" ) + "." +

					'</div>' +

				'</div>' +

				'<div class="unit two-fifths align-right">' +

					'<div class="gauge spinchecker" data-gauge-value="' + ( isNaN(oWordsStats.variationIndex) ? 0 : oWordsStats.variationIndex ) + '"></div>' +

					'<div class="gauge spinchecker" data-gauge-value="' + ( isNaN(oWordsStats.perforationIndex) ? 0 : oWordsStats.perforationIndex ) + '"></div>' +

					'<div class="gauge spinchecker" data-gauge-value="' + ( isNaN(oWordsStats.qualityIndex) ? 0 : oWordsStats.qualityIndex ) + '"></div>' +

				'</div>' +

			'</div>';

		

		// Displaying of the article stats

		$('.paragraph-container').last().after($infoMessage);

		$infoMessage.html(articleStats);



		// Handle Spinchecker public version

		if ( PUBLIC_SITE_VERSION ) {

			$infoMessage.after("" +

				"<div class='grid radiance-public-message'>" +

					"<div class='unit whole'>" + MySpeech.get("message.public_site_advertisement") + " <a href='http://www.radianceconseil.com/' target='_blank'>" + MySpeech.get("message.click_here") + "</a>.</div>" +

				"</div>");

		}

		

		// Rendering gauges

		renderThreeGauges($infoMessage);

		

		// Display comparative table

		if ( $('#compare-paragraphs').is(":checked") ) {

			displayComparativeTableForParagraphs($infoMessage);

		}

		

		// ParagraphNavigator content update

//		ParagraphNavigator.addLinkToArticleStats();

		

		// Let's scroll !

		scrollToElement($infoMessage);

		

		// Deactivation of the action button

		$('#submitButton').removeClass('action').addClass('disabled').off('click');

		

		// In case of calculation overflow (Infinity) in words stats, display notification

		if ( oWordsStats.calculationOverflow ) {

			MyUtils.displayInfoMessage('warning', MySpeech.get("message.warning.stack_overflow"));

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

		renderGauge($infoMessage.find('.gauge').eq(0), MySpeech.get("message.replacement_index"), maxValue);

		renderGauge($infoMessage.find('.gauge').eq(1), MySpeech.get("message.hole_index"), maxValue);

		renderGauge($infoMessage.find('.gauge').eq(2), MySpeech.get("message.quality_index"), maxValue);

	}

	

	/**

	 * @param	{Object} $toggleWrapper

	 * @return	none

	 */

	function openToggleIfClosed($toggleWrapper) {

		var $toggle = $toggleWrapper.find('.db-toggle');

		if ( $toggle.hasClass('closed') ) {

			openToggle($toggle, $.noop );

		}

	}

	

	function closeToggleIfOpened($infoMessageWrapper) {

		var $toggle = $infoMessageWrapper.find('.db-toggle');

		if ( $toggle.hasClass('opened') ) {

			closeToggle($toggle);

		}

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

				'<div class="unit one-sixth align-center">' + MySpeech.get("message.paragraph") + '</div>' +

				'<div class="unit one-sixth align-center">' + MySpeech.get("message.replacement_rate") + '</div>' +

				'<div class="unit one-sixth align-center">' + MySpeech.get("message.hole_rate") + '</div>' +

				'<div class="unit one-sixth align-center">' + MySpeech.get("message.replacement_index") + '</div>' +

				'<div class="unit one-sixth align-center">' + MySpeech.get("message.hole_index") + '</div>' +

				'<div class="unit one-sixth align-center">' + MySpeech.get("message.quality_index") + '</div>' +

			'</div>'

		);

		$.each($('textarea[id^=spintax-paragraph-]'), function(i,v) {

			$infoMessage.append('' +

				'<div class="grid my-table row">' +

					'<div class="unit one-sixth align-center">' + parseInt(i+1) +'</div>' +

					'<div class="unit one-sixth align-center">' + ( isNaN(aParagraphsData[i].variationRate) ? "&infin;" : new String(aParagraphsData[i].variationRate).replace('.',MySpeech.get("message.having_seprator_avg")) + '%' ) + '</div>' +

					'<div class="unit one-sixth align-center">' + ( isNaN(aParagraphsData[i].perforationRate) ? "&infin;" : new String(aParagraphsData[i].perforationRate).replace('.',MySpeech.get("message.having_seprator_avg")) + '%' ) + '</div>' +

					'<div class="unit one-sixth align-center">' + ( isNaN(aParagraphsData[i].variationIndex) ? "&infin;" : new String(aParagraphsData[i].variationIndex).replace('.',MySpeech.get("message.having_seprator_avg")) ) + '</div>' +

					'<div class="unit one-sixth align-center">' + ( isNaN(aParagraphsData[i].perforationIndex) ? "&infin;" : new String(aParagraphsData[i].perforationIndex).replace('.',MySpeech.get("message.having_seprator_avg")) ) + '</div>' +

					'<div class="unit one-sixth align-center">' + ( isNaN(aParagraphsData[i].qualityIndex) ? "&infin;" : new String(aParagraphsData[i].qualityIndex).replace('.',MySpeech.get("message.having_seprator_avg")) ) + '</div>' +

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

	function formatSpintaxShownInErrorMessages(spintax, errorIndex, noParagraph, errorarray) {

		var nbCharsAroundErrorIndex = 75;

		var json_msg = errorarray.message;
		
		var flag_punc = json_msg.indexOf(ERROR_MESSAGE.END_PUNCTUTAION_SIGN.message);
		
		var flag_lower_case = json_msg.indexOf(ERROR_MESSAGE.START_LOWER_CASE.message);
		
		var flag_blank = json_msg.indexOf(ERROR_MESSAGE.START_BLANK.message);

		var around_text=spintax.substring(errorIndex - nbCharsAroundErrorIndex, errorIndex);
		
		var around_arr=around_text.split( "\n" );
		
		var around_text_end=spintax.substr(errorIndex + 1, nbCharsAroundErrorIndex);
		
		var around_arr_end=around_text_end.split( "\n" );
		
		//alert(around_arr.length);
		for( var i = 0; i < around_arr.length; ++i ) {
			//alert(around_text);
			//alert(i)
			}
			
		if(around_arr[around_arr.length-1]=="" && around_arr[around_arr.length-1] !='undefined'){
			var text_to_show=around_arr[around_arr.length-2];
			//alert(around_text);
			}else{
				var text_to_show=around_arr[around_arr.length-1];
				}
		
		if(flag_punc > 10){
			return "" +
			
			around_arr[around_arr.length-1] +

			"<a class='spintax-error' href='#' onclick='Spinchecker.selectSpintaxErrorIntoParagraphContent(" + noParagraph + ", " + errorIndex + ")'>" + spintax[errorIndex] + "</a>";
			
			}
			else if(flag_lower_case > 10){

		return "<a class='spintax-error' href='#' onclick='Spinchecker.selectSpintaxErrorIntoParagraphContent(" + noParagraph + ", " + errorIndex + ")'>" + spintax[errorIndex] + "</a>" + 

			around_arr_end[0];
			
			}
			else if(flag_blank > 10){

		return "<a class='spintax-error' href='#' onclick='Spinchecker.selectSpintaxErrorIntoParagraphContent(" + noParagraph + ", " + errorIndex + ")'>" + spintax[errorIndex] + "</a>" + 

			around_arr_end[0];
			
			}
			else{

		return "" +

			around_arr[around_arr.length-1] +

			"<a class='spintax-error' href='#' onclick='Spinchecker.selectSpintaxErrorIntoParagraphContent(" + noParagraph + ", " + errorIndex + ")'>" + spintax[errorIndex] + "</a>" + 

			around_arr_end[0];
			
			}

	}



	/**

	 * @param	{integer} noParagraph

	 * @param	{integer} errorIndex

	 * @return

	 */

	this.selectSpintaxErrorIntoParagraphContent = function(noParagraph, errorIndex) {

		var $paragraphContent =  $('#spintax-paragraph-' + noParagraph);



		openToggleIfClosed( $paragraphContent.parents('.db-toggles-wrapper'));

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

	

	function getErrorsNature(aErrors) {

		var oResult = { nbWarnings: 0, nbErrors: 0 };

		

		$.each(aErrors, function(i,error) {

			if ( error.type == 'ERROR' ) {

				oResult.nbErrors++;

			}

			if ( error.type == 'WARNING' ) {

				oResult.nbWarnings++;

			}

		});

		

		return oResult;

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
		debugger;

		var $paragraphContent,

			$paragraphContainer,

			aParagraphsContents,

			noParagraph,

			paragraphTitle,

			isUploadMode = (_this.aUploadedFileNames.length ? true : false );

		

		$('.paragraph-container').remove();

		

		if ( !$('#spintax-article').val().trim() ) {

			MyUtils.displayInfoMessage('warning', MySpeech.get("message.warning.please_enter_article"));

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

			$paragraphContainer = $paragraphContent.parents('.paragraph-container');

			createToggles($paragraphContainer.find('.spintax-paragraph-wrapper'), false);

			createToggles($paragraphContainer.find('.info-message-wrapper'), false);

			$paragraphContent = $('#' + $paragraphContent.prop('id')); // hack after cloning being done in createToggles function

			_this.analyzeParagraph($paragraphContent, false); 

		});

		

		if ( isUploadMode ) {

			sortParagraphContainersAlphabetically();

		}

		

		resizeHighlighterContainersWidth();

		

//		ParagraphNavigator.fillAndShow($('textarea[id^=spintax-paragraph-]').length);

		

		$('#uploadButton').removeClass('action').addClass('disabled').off('click');

		$('#submitButton').html(MySpeech.get("form.button.article_stats")).off('click').on('click', displayArticleStats);

	}

	

	/**

	 * @param	{object} $paragraphContent

	 * @param	{boolean} openToggleIfErrors : open if closed and scroll to it

	 * @return	

	 */

	this.analyzeParagraph = function($paragraphContent, openToggleIfErrors) {

		var spintax = $paragraphContent.val().trim(),

			$paragraphContainer = $paragraphContent.parents('.paragraph-container'),

			aErrors = searchSpintaxErrors(spintax),

			oErrorsNature = getErrorsNature(aErrors),

			noParagraph = $paragraphContent.prop('id').replace('spintax-paragraph-', ''),

			$infoMessageWrapper = $paragraphContainer.find('.info-message-wrapper'),

			$infoMessageErrors = $infoMessageWrapper.find('.info-message'),

			$infoMessageStats = $infoMessageWrapper.next('.info-message'),

			toggleTitle;

			

		$infoMessageErrors.html('').hide();

		$infoMessageStats.html('').hide();

		

		// Paragraph warnings & errors display

		// -----------------------------------

		if ( oErrorsNature.nbErrors || oErrorsNature.nbWarnings ) {

			$infoMessageErrors.html( prepareWarningsErrorsMessage(aErrors, spintax, noParagraph) ).show();

		}

		

		// Paragraph stats display

		// -----------------------

		if ( !oErrorsNature.nbErrors ) {

			$infoMessageStats.html( prepareParagraphStatsMessage($paragraphContent, noParagraph) ).show(function() { 

				renderThreeGauges($infoMessageStats) 

			});

		}

		

		// Toggle title

		// ------------

		if ( !oErrorsNature.nbErrors && !oErrorsNature.nbWarnings ) {

			toggleTitle = MySpeech.get("message.this_paragraph_contains_no_error_no_warning");

		}

		else {

			toggleTitle = MySpeech.get("message.this_paragraph_contains");

			if ( oErrorsNature.nbErrors ) {

				toggleTitle += " <span class='error blink'>" + oErrorsNature.nbErrors + " " + MySpeech.get("message.word_error") + (oErrorsNature.nbErrors > 1 ? "s" : "") + "</span>";

			}

			if ( oErrorsNature.nbWarnings ) {

				toggleTitle += ( oErrorsNature.nbErrors ? " " + MySpeech.get("message.and") + " " : " " ) + "<span class='warning blink'>" + oErrorsNature.nbWarnings + " " + MySpeech.get("message.word_warning") + (oErrorsNature.nbWarnings > 1 ? "s" : "") + "</span>";

			}

		}

		updateToggleTitle($infoMessageWrapper, toggleTitle);

		

		// Toggle closing / opening

		// ------------------------

		if ( !aErrors.length ) {

			closeToggleIfOpened($infoMessageWrapper);

		}

		else if (openToggleIfErrors) {

			openToggleIfClosed($infoMessageWrapper);

		}

	

		

		

//		if ( aErrors.length ) {

//			var message = '';

//			for (var i=0; i<aErrors.length; i++) {

//				if ( aErrors[i].type == 'ERROR') {

//					errorsFound = true;

//				}

//				

//				if ( aErrors[i] != ERROR_MESSAGE.SPINTAX_IS_EMPTY ) {

//					message += "<p class='" + aErrors[i].type.toLowerCase() + "'>";

//					message += ( aErrors[i].type == 'ERROR' ? "<i title='" + MySpeech.get("message.error_uppercase") + "' class='fa fa-fw fa-exclamation-circle''></i>" : "<i title='" + MySpeech.get("message.warning_uppercase") + "' class='fa fa-fw fa-exclamation-circle''></i>");

//					message += aErrors[i].message;

//					message += "</p>";

//					message += "<div class='spintax'>" + formatSpintaxShownInErrorMessages(spintax, aErrors[i].index, noParagraph) + "</div>";

//				}

//			}

//			displayParagraphInfoMessage($infoMessageWrapper, 'error', message, openToggle);

//

//			if ( !errorsFound ) {

//				var $a = $("<a class='display-stats'><i class='fa fa-fw fa-bar-chart'></i>&nbsp;" + MySpeech.get("message.paragraph_stats") + "</a>").one('click', function() {

//					$(this).remove();

//					displayParagraphStats($paragraphContent);

//				});

//				$infoMessage.after($a);

//			}

//		}

//		else {

//			displayParagraphStats($paragraphContent);

//		}

	}

	

	this.init = function() {

		_this.aStopWords = MySpeech.get("variable.stop_words");

		ERROR_MESSAGE.UNNECESSARY_OPENING_BRACKET_OR_MISSING_PIPE.message = MySpeech.get("message.error.unnecessary_opening_bracket_or_missing_pipe");

		ERROR_MESSAGE.UNNECESSARY_CLOSING_BRACKET_OR_MISSING_PIPE.message = MySpeech.get("message.error.unnecessary_closing_bracket_or_missing_pipe");
		
		ERROR_MESSAGE.END_PUNCTUTAION_SIGN.message = MySpeech.get("message.error.end_punctuation_sign");
		
		ERROR_MESSAGE.START_LOWER_CASE.message = MySpeech.get("message.error.start_lower_case");
		
		ERROR_MESSAGE.LINE_NUMBER.message = MySpeech.get("message.error.line_number");
		
		ERROR_MESSAGE.START_BLANK.message = MySpeech.get("message.error.start_blank");

		ERROR_MESSAGE.CONSECUTIVE_WORDS_WITHOUT_VARIATIONS.message = MySpeech.get("message.error.consecutive_words_without_variations_part_1") + " " + _this.NB_MAX_CONSECUTIVE_WORDS_WITHOUT_VARIATIONS + " " + MySpeech.get("message.error.consecutive_words_without_variations_part_2");

		ERROR_MESSAGE.SPINTAX_IS_EMPTY.message = MySpeech.get("message.error.spintax_is_empty");

//		ERROR_MESSAGE.UNNECESSARY_OPENING_BRACKET.message = MySpeech.get("message.error.unnecessary_opening_bracket");

//		ERROR_MESSAGE.UNNECESSARY_CLOSING_BRACKET.message = MySpeech.get("message.error.unnecessary_closing_bracket");

		ERROR_MESSAGE.MISSING_MATCHING_OPENING_BRACKET_FOR_BRACKET.message = MySpeech.get("message.error.missing_matching_opening_bracket_for_bracket");

		ERROR_MESSAGE.MISSING_MATCHING_CLOSING_BRACKET_FOR_BRACKET.message = MySpeech.get("message.error.missing_matching_closing_bracket_for_bracket");

		ERROR_MESSAGE.MISSING_MATCHING_OPENING_BRACKET_FOR_PIPE.message = MySpeech.get("message.error.missing_matching_opening_bracket_for_pipe");

		ERROR_MESSAGE.MISSING_MATCHING_CLOSING_BRACKET_FOR_PIPE.message = MySpeech.get("message.error.missing_matching_closing_bracket_for_pipe");

		

		resetForm();

//		ParagraphNavigator.create();

	}

}



var Spinchecker = new Spinchecker();



/*************************************************************************************************/



function resetForm() {

	hideHelp();

//	ParagraphNavigator.hide();

	Spinchecker.aUploadedFileNames = [];

	$('#default-permutation-mode option').eq(0).prop('selected', true)

	$('#compare-paragraphs').prop('checked', true);

	$('#show-current-brackets-block-container').slideUp(400);

	$('#spintax-article-container').slideDown(400, function() { $('#spintax-article').val('').focus() } );

	$('.paragraph-container').remove();

	$('#article-stats').remove();

	$('#uploadButton').removeClass('disabled').addClass('action');

	$('#submitButton').removeClass('disabled').addClass('action').html(MySpeech.get("form.button.article_analysis")).off('click').on('click', Spinchecker.analyzeArticle);

	$('.radiance-public-message').remove();

}



function showHelp() {

	$('.info-message[class~=help]').slideUp(400, function() {

		$(this).find('.help-content').html( MySpeech.get("application.help").join("") );

		$(this).find('span#reference-variation-rate').html(Spinchecker.REFERENCE_RATE.VARIATION * 100);

		$(this).find('span#reference-perforation-rate').html(Spinchecker.REFERENCE_RATE.PERFORATION * 100);

		$(this).find('span#max-consecutive-words-without-variations').html(Spinchecker.NB_MAX_CONSECUTIVE_WORDS_WITHOUT_VARIATIONS);

		$(this).find('div#stop-words-list').html(Spinchecker.aStopWords.sort().join(', '));

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

function addThousandsSeparator(input) {
    var output = input
    if (parseFloat(input)) {
        input = new String(input); // so you can perform string operations
        var parts = input.split("."); // remove the decimal part
        parts[0] = parts[0].split("").reverse().join("").replace(/(\d{3})(?!$)/g, "$1,").split("").reverse().join("");
        output = parts.join(".");
    }

    return output;
}
