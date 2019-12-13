
function Spingenerator() {

	/** PUBLIC PROPERTIES ************************************************************************/
	
	this.aUploadedFileNames = [];
	
	/** PRIVATE PROPERTIES ***********************************************************************/

	var _this = this,
		defaultMinParagraphsHandled = 3,
		defaultMinElementsHandled = 3, // ie. elements per paragraph
		defaultParagraphsSequentialTolerance = 3,
		defaultElementsSequentialTolerance = 2;
	
	/** PRIVATE METHODS **************************************************************************/
	
	/**
	 * @param	{integer} noParagraph
	 * @param	{string} paragraphTitle
	 * @param	{string} paragraphContent
	 * @return	{object} paragraph content nested into the paragraph zone
	 */
	function createParagraphZone(noParagraph, paragraphTitle, paragraphContent) {
		var $paragraphZone = $('' +
			'<div class="paragraph-container" data-title="' + paragraphTitle + '">' +
				'<div class="grid collapse-with-following">' +
					'<div class="unit one-third">' +
						'<label>' + paragraphTitle + '</label>' +
					'</div>' +
					'<div class="unit two-thirds align-right">' +
						'<select id="paragraph-permutation-mode-' + noParagraph + '" class="mini" onfocus="$(this).data(\'present-value\', $(this).val())" onchange="changeParagraphPermutationMode($(this))">' +
							"<option value='NO_RESTRICTION'>Paragraphe placé n'importe où</option>" +
							'<option value="ALWAYS_FIRST">Paragraphe toujours en première position</option>' +
							'<option value="NEVER_FIRST">Paragraphe jamais en première position</option>' +
						'</select>' +
						'<select id="elements-permutation-mode-' + noParagraph + '" class="mini">' +
							'<option value="ALL_NOT_PERMUTABLE">Aucun élément permutable</option>' +
							'<option value="ALL_PERMUTABLE">Éléments tous permutables</option>' +
							'<option value="ALL_PERMUTABLE_EXCEPT_FIRST">Éléments tous permutables sauf le premier</option>' +
						'</select>' +
					'</div>' +
				'</div>' +
				'<div class="grid" style="display:none">' +
					'<div class="unit whole">' +
						'<div class="highlighter-container"></div>' +
						'<textarea id="spintax-paragraph-' + noParagraph + '" name="spintax-paragraph-' + noParagraph + '" class="spintax autosize" rows="1"></textarea>' +
					'</div>' +
				'</div>' +
			'</div>');
		$('#main-zone').after($paragraphZone);
		
		return $('#spintax-paragraph-' + noParagraph).css('height', '1em').val(paragraphContent).textareaAutoSize();
	}
	
	function sortParagraphContainersAlphabetically() {
		$('.paragraph-container').sortElements(function(a, b){
			return $(a).data('title').localeCompare($(b).data('title'));
		});
	}
	
	function setAndShowParameters() {
		// Inform user
		// -----------
		MyUtils.displayInfoMessage('success', "Les fichiers ont été chargés&nbsp;: veuillez définir votre paramétrage.");
		
		// Set parameters
		// --------------
		setSelectOptions($('#min-paragraphs-handled'), defaultMinParagraphsHandled, $('.paragraph-container').length, null, 'FIRST_SELECT_OPTION');
		setSelectOptions($('#max-paragraphs-handled'), defaultMinParagraphsHandled, $('.paragraph-container').length, null, 'LAST_SELECT_OPTION');
		setSelectOptions($('#paragraphs-sequential-tolerance'), 2, $('.paragraph-container').length, 'non définie', defaultParagraphsSequentialTolerance, ' paragraphes');
		
		var maxElements = getMinElementsForAllParagraphs();
		setSelectOptions($('#min-elements-handled'), defaultMinElementsHandled, maxElements, null, 'FIRST_SELECT_OPTION');
		setSelectOptions($('#max-elements-handled'), defaultMinElementsHandled, maxElements, null, 'LAST_SELECT_OPTION');
		setSelectOptions($('#elements-sequential-tolerance'), 2, maxElements, 'non définie', defaultElementsSequentialTolerance, ' éléments');
		
		// Show parameters
		// ---------------
		$('#uploadButton').slideUp(400);
		$('.parameters-area, #buttons-bar').slideDown(400);
	}

	/**
	 * @param	{jquery Object} $select
	 * @param	{} minValue
	 * @param	{} maxValue
	 * @param	{string} textForZeroValue : can be null if no "zero" value is required
	 * @param	{} defaultValue : value / 'FIRST_SELECT_OPTION' / 'LAST_SELECT_OPTION'
	 * @param	{string} [prependedText]
	 */
	function setSelectOptions($select, minValue, maxValue, textForZeroValue, defaultValue, prependedText) {
		$select.find('option').remove();
		if ( textForZeroValue ) {
			$select.append($('<option>', { value: 0, text: textForZeroValue } ));
		}
		for (var i = minValue; i <= maxValue; i++) {
			$select.append($('<option>', { value: i, text: i + (prependedText != undefined ? prependedText : '') } ));
		}
		switch (defaultValue) {
			case 'FIRST_SELECT_OPTION': $select.find('option').first().prop('selected', true); break;
			case 'LAST_SELECT_OPTION': $select.find('option').last().prop('selected', true); break;
			default: $select.find('option[value="' + defaultValue + '"]').prop('selected', true);
		}
	}
	
	function getMinElementsForAllParagraphs() {
		var nbElements,
			result = Infinity;
		
		$('textarea[id^=spintax-paragraph-]').each(function() {
			nbElements = $(this).val().trim().split('\n').length;
			if ( nbElements < result ) {
				result = nbElements;
			}
		});
			
		return result;
	}

	function generateArticles() {
		generatePermutations(); // JSI
	}
	
	function generatePermutations() {
		var aParagraphPermutations = generateParagraphPermutations();
		console.log(aParagraphPermutations);
		// Final results logging // JSI 
//		$.each(aParagraphPermutations, function() { 
//			console.log(this.join());
//		})
		console.info(aParagraphPermutations.length + " paragraph permutations found");
		console.log(arrayOfArraysToArrayOfStrings(aParagraphPermutations));
	}
	
	function generateParagraphPermutations() {
		var aResult = [],
			t1, t2,
			minParagraphsHandled = parseInt($('#min-paragraphs-handled').val()),
			maxParagraphsHandled = parseInt($('#max-paragraphs-handled').val()),
			sequentialTolerance = parseInt($('#paragraphs-sequential-tolerance').val()),
			totalParagraphs = $('.paragraph-container').length,
			aNumbersSequence = generateSequence(totalParagraphs),
			aParagraphPermutationModes = $('select[id^=paragraph-permutation-mode-]').map(function() { return $(this).val() }),
			permuteParagraphs = function(nbParagraphs) {
				return Combinatorics.permutation(aNumbersSequence, nbParagraphs).filter(function (array) {
					for ( var i=0; i< aParagraphPermutationModes.length; i++ ) {
						if ( aParagraphPermutationModes[i] == 'ALWAYS_FIRST' && array[0] != i ) { return false; }
						if ( aParagraphPermutationModes[i] == 'NEVER_FIRST' && array[0] == i ) { return false; }
					}
					return true;
				});
			};
		
		console.info(">>> Starting paragraphs permutations generation...");
		t1 = new Date().getTime();
		for ( var nbParagraphs = minParagraphsHandled; nbParagraphs <= maxParagraphsHandled; nbParagraphs++ ) {
//			aResult = aResult.concat( Combinatorics.permutation(aNumbersSequence, nbParagraphs).toArray() );
			aResult = aResult.concat( permuteParagraphs(nbParagraphs) );
		}
		t2 = new Date().getTime();
		console.info("Elapsed time : " + ((t2-t1) / 1000) + " second(s)");
		
		console.info(">>> Starting sequential tolerance filtering...");
		t1 = new Date().getTime();
		aResult = filterBySequentialTolerance(aResult, sequentialTolerance);
		t2 = new Date().getTime();
		console.info("Elapsed time : " + ((t2-t1) / 1000) + " second(s)");
		
		return aResult;
	}
	
	function generateSequence(total) {
		var result = [];
		for ( var i = 0; i < total; i++ ) {
			result.push(i); 
		}
		return result;
	}

	function filterBySequentialTolerance(aPermutations, sequentialTolerance) {
		if ( !sequentialTolerance ) {
			return aPermutations;
		}
		
		var aResult = [],
			length = aPermutations.length,
			aForbiddenSequences = [];

		for (var i=0; i < length; i++) {
			if ( aPermutations[i].length <= sequentialTolerance ) {
				aResult.push(aPermutations[i]);
				addForbiddenSequences(aPermutations[i], aForbiddenSequences, sequentialTolerance);
			}
			else if ( isSequenceAllowed(aPermutations[i], aForbiddenSequences) ) {
				aResult.push(aPermutations[i]);
				addForbiddenSequences(aPermutations[i], aForbiddenSequences, sequentialTolerance);
			}
		}
		return aResult;
	}
	
	function isSequenceAllowed(aSequence, aForbiddenSequences) {
		var stringSequence = aSequence.join(),
			sequenceLength = aSequence.length,
			length = aForbiddenSequences.length;
		
		for ( var i=0; i < length; i++ ) {
			if ( aForbiddenSequences[i].length < sequenceLength && new RegExp("\\b" + aForbiddenSequences[i].join() + "\\b").test(stringSequence) ) {
//				console.log("Possible sequence "  + stringSequence + " prevented by forbidden sequence " + aForbiddenSequences[i].join() );
				return false;
			}
		}
		return true;
	}
	
	function addForbiddenSequences(aSequence, aForbiddenSequences, sequentialTolerance) {
		var aExtractedSequences = extractArraysBySize(aSequence, sequentialTolerance),
			aStringExtractedSequences = arrayOfArraysToArrayOfStrings(aExtractedSequences),
			aStringForbiddenSequences = arrayOfArraysToArrayOfStrings(aForbiddenSequences);
		
		for ( var i=0; i < aStringExtractedSequences.length; i++ ) {
			if ( aStringForbiddenSequences.indexOf(aStringExtractedSequences[i]) == -1 ) {
				aForbiddenSequences.push(aStringExtractedSequences[i].split(','));
			}
		}
	}
	
	function arrayOfArraysToArrayOfStrings(aArray) {
		var aResult = [];
		$.each(aArray, function(i, array) {
			aResult.push(array.join());
		})
		return aResult;
	}
	
	function extractArraysBySize(aSequence, size) {
		var sequenceLength = aSequence.length,
			aResult = [];
		
		if ( sequenceLength >= size ) {
			if ( sequenceLength == size ) {
				aResult.push( aSequence );
			}
			else {
				for ( var i=0; i<=sequenceLength - size; i++ ) {
					aResult.push( aSequence.slice(i, i+size) );	
				}
			}
		}
		
		return aResult;
	}
	
//	function extractSequences(aSequences, size) {
//		var aResult = [];
//		
//		$.each(aSequences, function(i, aPermutation) {
//			if ( aPermutation.length >= size ) {
//				if ( aPermutation.length == size ) {
//					aResult.push( aPermutation.join() );
//				}
//				else {
//					var sequence;
//					for ( var j=0; j<aPermutation.length - size; j++ ) {
//						sequence = aPermutation.slice(j, j+size).join();
//						if ( aResult.indexOf(sequence) == -1 ) {
//							aResult.push(sequence);	
//						}
//					}
//				}
//			}
//		});
//		
//		return aResult;
//	}

	/** PUBLIC METHODS ***************************************************************************/
	
	this.divideArticleIntoParagraphs = function() {
		var $paragraphContent,
			aParagraphsContents = $('#spintax-article').val().trim().split('\n\n').reverse(),
			paragraphTitle,
			nbElements,
			fileName,
			error = false;
		
		if ( aParagraphsContents.length < defaultMinParagraphsHandled ) {
			MyUtils.displayInfoMessage('warning', "Les fichiers n'ont pu être chargés&nbsp;: le minimum requis est de " + defaultMinParagraphsHandled + " fichiers.");
			return;
		}
	
		$('.paragraph-container').remove();
		
		$.each(aParagraphsContents, function (i,v) {
			nbElements = v.split('\n').length;
			fileName = _this.aUploadedFileNames[aParagraphsContents.length - i - 1];
			if ( nbElements < defaultMinElementsHandled ) {
				MyUtils.displayInfoMessage('warning', "Les fichiers n'ont pu être chargés&nbsp;: <b><i>" + fileName + "</i></b> comporte moins de " + defaultMinElementsHandled + " éléments.");
				error = true;
				return false;
			}
			paragraphTitle = "" +
				"Fichier " + fileName +
				" (" + nbElements + " élément" + (nbElements > 1 ? 's' : '') + ")";
			$paragraphContent = createParagraphZone(aParagraphsContents.length - i, paragraphTitle, v);
		});
		if (error) {
			$('.paragraph-container').remove();
			return;
		}
		
		sortParagraphContainersAlphabetically();
		
		setAndShowParameters();
		
		$('#submitButton').on('click', generateArticles);
	}
	
	this.changeParagraphsPermutationMode = function(mode) {
		$('.paragraph-container select[id^=paragraph-permutation-mode]').each(function() {
			$(this).find('option[value="' + mode + '"]').prop('selected', true);
		});
	}
	
	this.changeElementsPermutationMode = function(mode) {
		$('.paragraph-container select[id^=elements-permutation-mode]').each(function() {
			$(this).find('option[value="' + mode + '"]').prop('selected', true);
		});
	}
	
}

var Spingenerator = new Spingenerator();

/*************************************************************************************************/

function initForm() {
	resetForm();
}

function resetForm() {
	hideHelp();
	
	Spingenerator.aUploadedFileNames = [];
	
	$('.paragraph-container').remove();
	$('#uploadButton').slideDown(400);
	$('.parameters-area, #buttons-bar').slideUp(400);
	$('#default-elements-permutation-mode option').eq(0).prop('selected', true)
}

function showHelp() {
	$('.info-message[class~=help]').slideUp(400, function() {
		$(this).find('.help-content').html('' +
			"<p>Cet outil permet de générer un certain nombre d'articles à partir de ses paragraphes téléchargés par l'utilisateur, ainsi de plusieurs autres paramètres.</p>" +
			"<p class='title'<i style='margin-right:10px' class='fa fa-wrench'></i>Utilisation" +
				"<ol>" +
					"<li>Téléchargez les paragraphes composant votre article</li>" +
					"<li>" +
						"Choissiez pour chaque paragraphe (resp. élément de pararaphe, ou plus simplement «&nbsp;éléments&nbsp;») :" +
						"<ul style='margin-top: 5px'>" +
							"<li>le mode de permutation par défaut ; ce choix se répercute immédiatement sur le mode de permutation de chaque paragraphe (resp. élément)</li>" +
							"<li>une fourchette indiquant le nombre de paragraphes (resp. d'éléments) à prendre en compte et à permuter (concernant les éléments, s'ils sont permutables)</li>" +
							"<li>la tolérance séquenquielle relative à la permutation des paragraphes (resp. des éléments) ; ce chiffre indique le nombre maximum de paragraphes (resp. d'éléments) apparaissant à la suite dans leur ordre d'origine.</li>" +
						"</ul>" +
					"</li>" +
					"<li>Au besoin, modifiez individuellement le mode de permutation de chaque paragraphe (resp. élément)</li>" +
				"</ol>" +
			"</p>"
			);
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

function changeParagraphPermutationMode($select) {
	if ( $select.val() == 'ALWAYS_FIRST' && $('select[id^=paragraph-permutation-mode-]:has(option[value=ALWAYS_FIRST]:selected)').length > 1 ) {
		MyUtils.displayInfoMessage('warning', "Changement impossible : un seul paragraphe peut être toujours placé en première position.");
		$select.find('option[value="' + $select.data('present-value') + '"]').prop('selected', true);
	}
}
