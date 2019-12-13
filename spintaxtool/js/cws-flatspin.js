function Flatspin() {
	/** PUBLIC PROPERTIES ************************************************************************/	
	this.aUploadedFileNames = [];
	this.maxVariationsHandled = 10000;  

	/** PRIVATE PROPERTIES ***********************************************************************/



	var _this = this,

		spellchechingBatchSize = 1800,

		aErrors = [],

		indexOffset,

		paragraphsSeparator = "\n\n",
		
		sentencesSeparator = "\n";

	

	/** PRIVATE METHODS **************************************************************************/

	

	function generateVariations(msg) {

		var aSpintaxSentences = msg.replace(/\|{2,}/g, '\|').split("\n"),

			tree,

			aVariationsIndexes,

			result = "",

			aSentencesReachingVariationsLimit = [];

		

		// Generate flatspin for each spintax sentence

		// -------------------------------------------
//console.log(aSpintaxSentences);
        
		$.each(aSpintaxSentences, function (i, sentence) {
//console.log(sentence);
           //result +='<div>';
			tree = SpinerMan.buildTree(sentence.trim());

			aVariationsIndexes = generateVariationsIndexes(tree.r);

			if ( aVariationsIndexes.length >= _this.maxVariationsHandled ) {

				aSentencesReachingVariationsLimit.push( parseInt(i+1) );

			}

			

			if (i) {

				result += paragraphsSeparator;

			}

			$.each(aVariationsIndexes, function (j, index) {

				if (j) {

					result += sentencesSeparator;

				}

				result += SpinerMan.getVariation(tree, index);

			});
			
            //result +='</div>';
		});

		// Display global warning message

		// ------------------------------

		/*if ( aSentencesReachingVariationsLimit.length ) {

			MyUtils.displayInfoMessage('warning', "" + 

				( aSentencesReachingVariationsLimit.length > 1 ? MySpeech.get("message.warning.sentences_number") : MySpeech.get("message.warning.sentence_number") ) + " " +

				aSentencesReachingVariationsLimit.join(', ') + " " + ( aSentencesReachingVariationsLimit.length > 1 ? MySpeech.get("message.warning.have_reached_limit_of") : MySpeech.get("message.warning.has_reached_limit_of") ) + " " +

				_this.maxVariationsHandled + " " + MySpeech.get("message.warning.variations") + "." );

		}
  */
		//alert('RRRR=>>'+result);return false;
		return result;

	}

	
	/**

	 * @deprecated

	 */

	function OLD_parseSentences(spintax) {

		var splitDepth = ( spintax[0] == "{" ? 1 : 0 ),

			aIndexes = [];

		

		spintax = spintax.replace(/\.\.\./g, '…');

		var depth = 0;

		for ( var i = 0; i < spintax.length; i++) {

			switch( spintax[i] ) {

				case '{': depth++; break;

				

				case '}': depth--; break;

				

				case '|':

				case '.':

				case '!':

				case '?':

				case '…': if ( depth == splitDepth ) { aIndexes.push(i); } break;

			}

		}

		

		return spintax.splitByIndexes(aIndexes, false, true);

	}

	

	function generateVariationsIndexes(nbTotalVariations) {

		var aResult = [];

		

		if ( nbTotalVariations <= _this.maxVariationsHandled ) {

			for ( var i = 0; i < nbTotalVariations; i++ ) {

				aResult.push(i);

			}

		}

		else {

			while ( aResult.length < _this.maxVariationsHandled ) {

				var index = Math.floor(Math.random() * nbTotalVariations);

				if ( aResult.indexOf(index) == -1 ) {

					aResult.push(index);

				}

			}

		}

		

		return aResult;

	}

	

	/**

	 * @deprecated

	 */

	function OLD_generateVariationsIndexes(nbTotalVariations) {

		var aResult = [];

		

		if ( nbTotalVariations <= _this.maxVariationsHandled ) {

			for ( var i = 0; i < nbTotalVariations; i++ ) {

				aResult.push(i);

			}

		}

		else {

			var step = Math.floor( nbTotalVariations / ( _this.maxVariationsHandled - 1 ) );

			for ( var i = 0; i < _this.maxVariationsHandled; i++ ) {

				aResult.push( i * step );

			}

		}

		

		return aResult;

	}

	

	function spellcheckVariations(variations) {

		var aStrings = chunkVariationsString(variations);

		

		aErrors = [];

		indexOffset = 0;

		for ( var i = 0; i < aStrings.length; i++) {

			ButtonHandler.setProgressBar(  $('#submitButton'), (100 * i) / (aStrings.length - 1) );

			//callSpecheckerService(aStrings[i]);

			callSpecheckerService(aStrings[i].replace(new RegExp(sentencesSeparator, "g"), "\n"));

		}

		

		createErrorTooltips(aErrors);

	}

	

	function chunkVariationsString(variations) {

		var aResult = [],

			aParagraphs = [],

			aSentences = [],

			stringLength = 0,

			string = "";

		

		aParagraphs = variations.split(paragraphsSeparator);

		for ( var i = 0; i < aParagraphs.length; i++ ) {

			if (i) {

				string += paragraphsSeparator; 

			}

			aSentences = aParagraphs[i].split(sentencesSeparator);

			for ( var j = 0; j < aSentences.length; j++ ) {

				if ( string.length > spellchechingBatchSize ) {

					aResult.push(string);

					string = "";

				}

				if (j) {

					string += sentencesSeparator;

				}

				string += aSentences[j];

			}

		}

		if (string) {

			aResult.push(string);

		}
        console.log(aResult);
		return aResult;

	}

	

	function callSpecheckerService(text) {

		$.ajax({

			url: "php/ajax/spellchecker-reverso-proxy.php",

			async: false,

			type: "post",

			data: { text: text },

			dataType: 'xml',

			success: function(xml) {

				aErrors = aErrors.concat( parseSpellcheckingErrors( $(xml).find("error") ) );

				indexOffset += text.length;

			}

		});

	}

	

	function parseSpellcheckingErrors($errors) {

		var aErrors = [],

			error,

			variationsWithBr = $("#paragraph-variations").val(),

			variationsWithoutBr = $("#paragraph-variations").val().replace(new RegExp(sentencesSeparator, "g"), "\n"),

			textBeforeErrorStart,

			countReturn;

		

		$errors.each(function() {

			error = {

				type: $(this).attr("type"),

				message: $(this).find('message').html().replace(/#!/g, "<b>").replace(/#\$/g, "</b>"),

				start: parseInt($(this).attr("start")) + indexOffset,

				end: parseInt($(this).attr("end")) + indexOffset,

				substitution: $(this).attr("substitution"),

				proba: parseInt($(this).attr("proba"))

			};

			

			textBeforeErrorStart = variationsWithoutBr.substring(0, error.start);

			countReturn = (textBeforeErrorStart.match(new RegExp("\n", "g")) || []).length;

			error.start += countReturn * ( sentencesSeparator.length - 1);

			error.end += countReturn * ( sentencesSeparator.length -1 );

			

//			console.log(error.message, error.start, countReturn);

		

			aErrors.push(error);

		});

		

		return aErrors;

	}

	

	function createErrorTooltips(aErrors) {

		var variations = $("#paragraph-variations").val(),

			underlineColor,

			tooltipTitle,

			tooltipMessage;

		

		aErrors.sort(function(o1, o2) { return o2.start - o1.start; });

		$.each(aErrors, function(i, error) {

			switch (error.type) {

				case "typo":

					underlineColor = "blue";

					tooltipTitle = "Typographie";

				break;

				case "grammar":

					underlineColor = "blue";

					tooltipTitle = "Grammaire";

				break;

				case "spell":

					underlineColor = "red";

					tooltipTitle = "Orthographe";

				break;

				default:

					MyUtils.displayInfoMessage('error', MySpeech.get("message.error.error_type_not_supported") + " «&nbsp;" + error.type + "&nbsp;»."); 

					return true; // equivalent to "continue" for a jQuery each loop 

			}

			

			tooltipMessage = "" +

				error.message + 

				( error.substitution ? "<br>Nous suggérons <b>" + error.substitution + "</b>.": "" ) +

				"<div style='text-align:right; font-style:italic;'>Probabilité " + error.proba + "%</div>";



			variations = "" +

				variations.substring(0,error.start) + 

				'<span data-tooltip-title="' + tooltipTitle + '" data-tooltip-message="' + tooltipMessage + '" class="curly-underline ' + underlineColor + '">' + variations.substring(error.start, error.end) + "</span>" +

				variations.substring(error.end);

		});

		

		$("#paragraph-variations").val(variations);

		

		$("span[class^=curly-underline]").each(function() {

			$(this).qtip({

				content: {

					title: $(this).data("tooltip-title"),

					text: $(this).data("tooltip-message")

				},

				position: {

					target: "mouse",

					my: "bottom left",

					at: "top right",

					adjust: { resize: true }

				}

			});

		});

	}

	

	/** PUBLIC METHODS ***************************************************************************/

	

	this.generateFlatspin = function(spintaxdata) {

		// Can we process ?
		 return generateVariations(spintaxdata);
	

	}
	
	/** 
	 
	 * @function to get count total element.
	 
	*/
	
	this.countReadbleElement = function(data) {
		var elementData     =   data.split("\n");
		return elementData.length;
		
	}

	

	this.downloadParagraph = function() {

	}

	

}



var Flatspin = new Flatspin();



/*************************************************************************************************/



function init() {
    $('input[type=image]').click( function(){
			    var lag	= $(this).val();
			    setCookie('languagename', lag);
			    var load_url = window.location.href.substr(0, window.location.href.indexOf('#'));
			    window.location.href =load_url;	
				});
			var languagename = getCookie('languagename');
			
			 if (getCookie('languagename') == null ) {
					 var userLang = navigator.language || navigator.browserLanguage; 
					 //alert(userLang);
					 if (userLang=='en-US') {
						 var languagename =  'en';
					 } else if (userLang=='fr'){
						 var languagename =  'fr';	 
					 } else {
					     var languagename =  'fr';
					 }
			 } else {
			     
				    var  languagename = getCookie('languagename'); 
			 }
			 //alert(languagename);
	
	MySpeech.init('Flatspin', languagename);

	resetForm();

	

	var oClipboard = new Clipboard('#copyToClipboardButton');

	oClipboard.on('success', function(e) {

		MyUtils.displayInfoMessage("success", MySpeech.get("message.success.flatspin_copied_to_clipboard") );

	    e.clearSelection();

	});

}



function resetForm() {

	hideHelp();

	Flatspin.aUploadedFileNames = [],

	Flatspin.aCorrectedErrors = [];

	$("#paragraph-spintax").val('');

	$("#paragraph-variations").val('');

	$('#main-zone').slideUp(400);

	$('#uploadButton').slideDown(400);

}



function showHelp() {

	$('.info-message[class~=help]').slideUp(400, function() {

		$(this).find('.help-content').html( MySpeech.get("application.help").join("") );

		$(this).find('span#max-random-variations').html(Flatspin.maxVariationsHandled);

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



function downloadFlatspin() {

	$("#form-download-flatspin #text").val( $("#paragraph-variations").val().trim() );

	$("#form-download-flatspin").submit();

}


function separateParagraphFlatspin(){

	$("#form-download-flatspin #text").val( $("#paragraph-variations").val().trim() );

	$("#form-download-flatspin").submit();

}

/**
	 * 
	 * Count no of elements
	 */
function elementCountFlatspin(str){
		try {
			var res = str.split("\n\n"); 
			var finalElements = cleanArray(res);
			return finalElements.length;
		} catch(e) {

			return 0;

		}

	}
	
function cleanArray(actual) {
	  var newArray = new Array();
	  for (var i = 0; i < actual.length; i++) {
		if (actual[i]!='') {
		  newArray.push(actual[i]);
		}
	  }
	  return newArray;
	}
