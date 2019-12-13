

function SpincheckerV1() {

	

	/** PUBLIC PROPERTIES ************************************************************************/

	

	this.rateMargin = 6; // percents

	this.minCustomerSentences = 4,

	this.aUploadedFileNames = [];

	this.maxSentenceChars = 65,000;

	

	/** PRIVATE PROPERTIES ***********************************************************************/



	var _this = this,

		minValue = 50 - this.rateMargin, // percents 

		maxValue = 50 + this.rateMargin, // percents

		minNeutralSentences = 1,

		justGageUniqueId = 1;

		$standardMessageTpl = $('' +

			'<div class="grid">' +

				'<div class="unit whole">' +

					'<div class="info-message result"></div>' +

				'</div>' +

			'</div>'),

		$neutralSentenceTpl = $('' +

			'<div class="grid">' +

				'<div class="unit three-quarters">' +

					'<div class="info-message result" style="height:60px"></div>' +

				'</div>' +

				'<div class="unit one-quarter">&nbsp;</div>' +

			'</div>'),

		$customerSentenceTpl = $('' +

			'<div class="grid">' +

				'<div class="unit three-quarters">' +

					'<div class="info-message result" style="height:60px"></div>' +

				'</div>' +

				'<div class="unit one-quarter">' +

					'<div class="gauge" style="height:60px"></div>' +

				'</div>' +

			'</div>');

	

	/** PUBLIC METHODS ***************************************************************************/

		

	this.init = function( ){

		this.aUploadedFileNames = [];

		justGageUniqueId = 1;

	}



	/**

	 * @param masterSpin

	 * @param keyword

	 * @param ignoreFirstSentence

	 */

	this.analyzeMasterSpin = function(masterSpin, keyword, ignoreFirstSentence) {

		var toggleTitle,

			isUploadMode = (_this.aUploadedFileNames.length ? true : false );

		

//		displayResultMessageType1($standardMessageTpl, "info", "Pourcentage de spuns avec mot-clé visé : entre " + minValue + "% et " + maxValue + "%", false);

		$.each(masterSpin.split('\n\n'), function(i,paragraphSpintax) {

			toggleTitle = ( isUploadMode ? 'Fichier ' + _this.aUploadedFileNames[i] : 'Paragraphe n° ' + parseInt(i+1) );

			$("<div class='db-toggle' data-title='" + toggleTitle + "'>").appendTo("#div-checkspin-results");

			analyzeParagraph(i, paragraphSpintax, keyword, ignoreFirstSentence);

			$("</div>").appendTo("#div-checkspin-results");

		});

		

		if ( isUploadMode ) {

			sortTogglesAlphabetically();

		}

		createToggles($('#div-checkspin-results'), true, false, false);

		renderGauges();

	}

	

	/** PRIVATE METHODS **************************************************************************/

	

	function analyzeParagraph(noParagraph, paragraphSpintax, keyword, ignoreFirstSentence) {

		var customerSentences = 0,

			neutralSentences = 0,

			checkSentenceResult, 

			spunsWithKeywordRate,

			objMessage,

			messageType,

			message;

		

		$.each(paragraphSpintax.split('\n'), function(i,sentence) {

			if ( !i && ignoreFirstSentence ) {

				displayResultMessageType1($standardMessageTpl, "info", "Phrase 1 ignorée");

			}

			else {

				checkSentenceResult = checkSentenceUsingProbabilities(sentence, keyword);

//				checkSentenceResult = checkSentenceUsingStatistics(v, keyword);

				// Phrase de type client

				if ( checkSentenceResult.isCustomerSentence ) {

					customerSentences++;

					objMessage = getMessageForCustomerSentence(i+1, checkSentenceResult.spunsWithKeywordRate, sentence);

					displayResultMessageType2(objMessage.type, objMessage.text, checkSentenceResult.spunsWithKeywordRate);

				}

				// Phrase de type neutre

				else {

					neutralSentences++;

					objMessage = getMessageForNeutralSentence(i+1, sentence);

					displayResultMessageType1($neutralSentenceTpl, objMessage.type, objMessage.text);

				}

			}

		});

		

		// Displaying final message

		messageType = ( (customerSentences >= _this.minCustomerSentences) && (neutralSentences >= minNeutralSentences) ? "success" : "error" );

		message = "" +

			"Ce paragraphe comporte " + customerSentences + " phrase" + ( customerSentences > 1 ? "s" : "") + " de type « client » pour un minimum de " + _this.minCustomerSentences + ", " +

			"et " + neutralSentences + " phrase" + ( neutralSentences > 1 ? "s" : "") + " de type « neutre » pour un minimum de " + minNeutralSentences + ".";

		displayResultMessageType1($standardMessageTpl, messageType, message);

		

		// Action buton deactivation

		$('#action-button').addClass('disabled').off('click');

	}

	

	function getMessageForCustomerSentence(noSentence, spunsWithKeywordRate, sentence) {

		var text = "La phrase n° " + noSentence + " est de type client",

			errorDetected = false;

		

		if ( spunsWithKeywordRate < minValue || spunsWithKeywordRate > maxValue ) {

			errorDetected = true;

		}

		text += " ; elle génère " + spunsWithKeywordRate.replace('.', ',') + "% de spuns avec mot-clé";

		

		if ( $('#check-sentence-length').is(":checked") && sentence.length > _this.maxSentenceChars ) {

			errorDetected = true;

			text += " ; elle compte plus de " + _this.maxSentenceChars + " caractères" ;

		}

		

		text += ".";

		return { text:text, type:(errorDetected ? 'error' : 'success')};

	}



	function getMessageForNeutralSentence(noSentence, sentence) {

		var text = "La phrase n° " + noSentence + " est de type neutre",

			errorDetected = false;



		if ( $('#check-sentence-length').is(":checked") && sentence.length > _this.maxSentenceChars ) {

			errorDetected = true;

			text += " ; elle compte plus de " + _this.maxSentenceChars + " caractères" ;

		}



		text += ".";

		return { text:text, type:(errorDetected ? 'error' : 'success')};

	}

	

	function displayResultMessageType1($tpl, messageType, message, addToToggleContent) {

		var addToToggleContent = addToToggleContent || true,

			$appendTo = ( addToToggleContent ? $('.db-toggle').last() : $('#div-checkspin-results') ),

			$tplClone = $tpl.clone();

	

		$tplClone.find('.info-message').addClass(messageType).html(message);

		$tplClone.appendTo($appendTo);

	}



	function displayResultMessageType2(messageType, message, spunsWithKeywordRate, addToToggleContent) {

		var addToToggleContent = addToToggleContent || true,

			$appendTo = ( addToToggleContent ? $('.db-toggle').last() : $('#div-checkspin-results') ),

			$tplClone = $customerSentenceTpl.clone();

		

		$tplClone.find('.info-message').addClass(messageType).html(message);

		$tplClone.find('.gauge').attr('id', 'gage-' + justGageUniqueId++).attr('gauge-value', spunsWithKeywordRate);

		$tplClone.appendTo($appendTo);

	}



	function getKeywordDepthInSpintaxSentence(spintaxSentence, indexMatch) {

		var keywordDepth = 0;

		for ( var i=0; i<indexMatch; i++ ) {

			if ( spintaxSentence[i] == '{' ) {

				keywordDepth++;

			}

			if ( spintaxSentence[i] == '}' ) {

				keywordDepth--;

			}

		}

		return keywordDepth;

	}



	function getKeywordNbChoicesInSpintaxSentence(spintaxSentence, keywordDepth, keywordLength, indexMatch) {

		var keywordNbChoices = 1;

		if ( keywordDepth ) {

			var tmpDepth = 0,

				stopProcessing = false;

			for ( var i=0; i<spintaxSentence.length; i++ ) {

				if ( stopProcessing ) {

					break;

				}

//				console.log(i, spintaxSentence[i])

				switch ( spintaxSentence[i] ) {

				case '{': 

					tmpDepth++;

					break;

				case '}':

					if ( tmpDepth == keywordDepth ) {

						if ( i < indexMatch ) {

							keywordNbChoices = 1;

						}

						if ( i >= indexMatch + keywordLength) {

//							console.log("stopProcessing !")

							stopProcessing = true;

						}

					}

					tmpDepth--;

					break;

				case '|': 

					if ( tmpDepth == keywordDepth ) { 

						keywordNbChoices++; 

					};

					break;

				}

			}

		}

//		console.log("keywordNbChoices", keywordNbChoices)

		return keywordNbChoices;

	}



	function checkSentenceUsingProbabilities(spintaxSentence, keyword) {

		var aProbabilities = [],

			keywordDepth,

			totalNbChoices,

			regexpPattern = ( $('#ignore-keyword-between-quotes').is(":checked") 

//				? '"\\s*' + keyword + '|«\\s*' + keyword + '|' + keyword + '\\s*"|' + keyword + '\\s*»|(' + keyword + ')' // we only capture what we need at the end

//				? '"\\s*' + keyword + '|' + keyword + '\\s*"|«.*' + keyword + '.*»|(\\b' + keyword + '\\b)' // we only capture what we need at the end

//				? '«.*' + keyword + '.*»|(\\b' + keyword + '\\b)' // we only capture what we need at the end

				? '«(?:[^»]*)' + keyword + '(?:[^«]*)»|(\\b' + keyword + '\\b)' // we use capturing groups to exclude what we don't need, in order to finally capture what we need

				: '(\\b' + keyword + '\\b)' ), // boundaries are used to match word only

			regexpFlags = ( $('#keyword-search-is-case-sensitive').is(":checked") ? 'g' : 'gi' ),

//			oRegexp = new RegExp(regexpPattern,regexpFlags),

			aMatches = getRegexpMatches(new RegExp(regexpPattern,regexpFlags), spintaxSentence, 1),

			result = { isCustomerSentence: (aMatches.length > 0), spunsWithKeywordRate: null };



//		console.log("regexpPattern", regexpPattern);

//		console.log(aMatches); // JSI 

		if ( !result.isCustomerSentence ) {

			return result;

		}

		

		/*

		oRegexp.lastIndex = 0;

		while ((oRegexp.exec(spintaxSentence)) !== null) {

			console.log(regexpPattern)

			indexMatch = oRegexp.lastIndex - keyword.length;

//			console.log(">>> indexMatch", indexMatch);

			keywordDepth = getKeywordDepthInSpintaxSentence(spintaxSentence, indexMatch);

//			console.log("keywordDepth", keywordDepth);

			totalNbChoices = 1;

			for ( var depth=1; depth<=keywordDepth; depth++ ) {

				totalNbChoices *= getKeywordNbChoicesInSpintaxSentence(spintaxSentence, depth, keyword.length, indexMatch);

			}

//			console.log("totalNbChoices", totalNbChoices);

			aProbabilities.push(1/totalNbChoices);

		}

		*/

		$.each(aMatches, function(i,match){

			keywordDepth = getKeywordDepthInSpintaxSentence(spintaxSentence, match.index);

			totalNbChoices = 1;

			for ( var depth=1; depth<=keywordDepth; depth++ ) {

				totalNbChoices *= getKeywordNbChoicesInSpintaxSentence(spintaxSentence, depth, keyword.length, match.index);

			}

			aProbabilities.push(1/totalNbChoices);

		})

		

//		console.log("aProbabilities", aProbabilities);

		for ( var i=0; i<aProbabilities.length; i++ ) {

			if ( aProbabilities[i] == 1 ) {

				result.spunsWithKeywordRate = 1;

				break;

			}

			result.spunsWithKeywordRate += aProbabilities[i];

		}

		result.spunsWithKeywordRate = new String(parseFloat((100 * result.spunsWithKeywordRate).toFixed(1)));

//		console.log("spunsWithKeywordRate", result.spunsWithKeywordRate);

		return result;

	}



	/**

	 * @param {Object} oRegexp

	 * @param {string} string

	 * @param {integer} [noCapturingGroup] : n° of the capturing group to extract

	 */

	function getRegexpMatches(oRegexp, string, noCapturingGroup) {

		var noCapturingGroup = noCapturingGroup || 0,

			aResult = [],

			result,

			match = oRegexp.exec(string);

		

		if ( match ) {

			while ( match ) {

				// matched text: match[0]

				// match start: match.index

				// capturing group n: match[n]

				result = { index:match.index, text:match[0] };

				if ( noCapturingGroup ) {

					if ( match[noCapturingGroup] !== undefined ) {

						result['cg' + noCapturingGroup] = match[noCapturingGroup];

						aResult.push(result);

					}

				}

				else {

					aResult.push(result);

				}

				match = oRegexp.exec(string);

			}

		}

		

		return aResult;

	}

	

	function sortTogglesAlphabetically() {

		$('.db-toggle').sortElements(function(a, b){

			return $(a).data('title').localeCompare($(b).data('title'));

		});

	}

	

	/**

	 * @deprecated

	 */

	function OLD_checkSentenceUsingProbabilities(spintaxSentence, keyword) {

		var aProbabilities = [],

			keywordDepth,

			indexMatch,

			totalNbChoices,

			regexpPattern = ( $('#ignore-keyword-between-quotes').is(":checked") ? keyword + '(?!("| "|»| »))' : keyword ), // ?! means "not followed by"

			regexpFlags = ( $('#keyword-search-is-case-sensitive').is(":checked") ? 'g' : 'gi' ),

			oRegexp = new RegExp(regexpPattern,regexpFlags),

			result = { isCustomerSentence: oRegexp.test(spintaxSentence), spunsWithKeywordRate: 0 };

		

		if ( !result.isCustomerSentence ) {

			return result;

		}

		

		oRegexp.lastIndex = 0;

		while ((oRegexp.exec(spintaxSentence)) !== null) {

			indexMatch = oRegexp.lastIndex - keyword.length;

//			console.log(">>> indexMatch", indexMatch);

			keywordDepth = getKeywordDepthInSpintaxSentence(spintaxSentence, indexMatch);

//			console.log("keywordDepth", keywordDepth);

			totalNbChoices = 1;

			for ( var depth=1; depth<=keywordDepth; depth++ ) {

				totalNbChoices *= getKeywordNbChoicesInSpintaxSentence(spintaxSentence, depth, keyword.length, indexMatch);

			}

//			console.log("totalNbChoices", totalNbChoices);

			aProbabilities.push(1/totalNbChoices);

		}

		

//		console.log("aProbabilities", aProbabilities);

		for ( var i=0; i<aProbabilities.length; i++ ) {

			if ( aProbabilities[i] == 1 ) {

				result.spunsWithKeywordRate = 1;

				break;

			}

			result.spunsWithKeywordRate += aProbabilities[i];

		}

		result.spunsWithKeywordRate = new String(parseFloat((100 * result.spunsWithKeywordRate).toFixed(1)));

//		console.log("spunsWithKeywordRate", result.spunsWithKeywordRate);

		return result;

	}

	

	function renderGauges() {

		$('.gauge').each(function(i,v) {

			new JustGage({

				id: $(this).attr('id'),

				value: parseFloat($(this).attr('gauge-value')),

				decimals: 1,

				min: 0,

				max: 100,

				label: "%",

				gaugeWidthScale: 0.25,

				customSectors: [{

					color: "#ce4844",

					lo: 0,

					hi: minValue

				},{

					color: "#ff8040",

					lo: minValue,

					hi: 49.9

				},{

					color: "#5cb85c",

					lo: 49.9,

					hi: 50.1

				},{

					color: "#ff8040",

					lo: 50.1,

					hi: maxValue

				},{

					color: "#ce4844",

					lo: maxValue,

					hi: 100

				}]

			});

		});

	}

	

	/**

	 * @deprecated

	 * @param spintaxSentence

	 * @param keyword

	 */

	function checkSentenceUsingStatistics(spintaxSentence, keyword) {

		var nbSentencesForStatisticsMethod = 10000,

			oRegexp = new RegExp(keyword,"i"),

			result = { isCustomerSentence: oRegexp.test(spintaxSentence), spunsWithKeywordRate: 0 };

		if ( !result.isCustomerSentence ) {

			return result;

		}



		var tree = SpinerMan.buildTreeWithNoStats(spintaxSentence),

			spunsWithKeyword = 0,

			totalSpuns = tree.r,

			nbStatisticalSamples = Math.min(totalSpuns, nbSentencesForStatisticsMethod),

			tmpRate;

//		console.log(">>>>>>>>>>>>> totalSpuns", totalSpuns)

		var aVariationsindexes = generateVariationsIndexes(totalSpuns, nbStatisticalSamples);

//		console.log(aVariationsindexes);

		for (var i=1; i<=nbStatisticalSamples; i++) {

//			var j = getRandomIntFromInterval(0, totalSpuns-1);

			var j = aVariationsindexes[i-1];

			var v = SpinerMan.getVariation(tree, j);

			if ( oRegexp.test(v) ) {

				spunsWithKeyword++;

			}

		}

//		console.log(">>> ", spunsWithKeyword, " out of ", nbStatisticalSamples);

		tmpRate = (spunsWithKeyword  / nbStatisticalSamples) * 100;

		result.spunsWithKeywordRate = (parseInt(tmpRate) == tmpRate ? parseInt(tmpRate) : tmpRate.toFixed(1) );

		return result;

	}



	/**

	 * @deprecated

	 */

	function getRandomIntFromInterval(min,max) {

		return Math.floor(Math.random()*(max-min+1)+min);

	}



	/**

	 * @deprecated

	 * @param totalSpuns

	 * @param nbVariations

	 * @returns {Array}

	 */

	function generateVariationsIndexes(totalSpuns, nbVariations) {

		var interval = totalSpuns / (nbVariations+1),

			result = [],

			index = 0;

		for (var i=0; i<nbVariations; i++) {

			index += interval;

			result.push(Math.floor(index));

		}

		return result;

	}



	/**

	 * @deprecated

	 */

	function buildArrayMatches(spintaxSentence, keyword) {

		var oRegexp = new RegExp(keyword,'g'),

			aKeywordIndexMatches = [],

			aResult = [],

			indexMatch,

			absoluteDepth = 0,

			lastKeywordDepth = -1,

			isSameExpression = false;

		

		while ((oRegexp.exec(spintaxSentence)) !== null) {

			aKeywordIndexMatches.push(oRegexp.lastIndex - keyword.length);

		}

		for ( var i=0; i<spintaxSentence.length; i++ ) {

			if ( !aKeywordIndexMatches.length ) {

				break;

			}

			if ( i == aKeywordIndexMatches[0] ) {

//				console.log("match pour i =", i, "isSameExpression", isSameExpression);

				indexMatch = aKeywordIndexMatches.shift();

				if ( !isSameExpression ) {

					aResult.push(indexMatch);

					lastKeywordDepth = absoluteDepth;

//					console.log("PUSHED", indexMatch, "lastKeywordDepth", lastKeywordDepth)

				}

				isSameExpression = true;

			}

			switch ( spintaxSentence[i] ) {

				case '{': absoluteDepth++; break;

				case '}': absoluteDepth--; break;

				case '|':

//					console.log("| detected at", i, "absoluteDepth =", absoluteDepth, "lastKeywordDepth =", lastKeywordDepth);

					if ( absoluteDepth == lastKeywordDepth ) {

						isSameExpression = false;

					}

					break;	

			}

		}

			

		return aResult;

	}



}



var SpincheckerV1 = new SpincheckerV1();



/*************************************************************************************************/



function initForm() {

	resetForm();

}



function resetForm() {

	hideHelp();

	SpincheckerV1.init();

	$('#ignore-keyword-between-quotes').prop('checked', true);

	$('#keyword-search-is-case-sensitive').prop('checked', true);

	$('#min-customer-sentences option:eq(3)').prop('selected', true);

	updateHelpInfos();

	$('#ignore-first-sentence').prop('checked', true);

	$('#check-sentence-length').prop('checked', true);

	$('#master-spin').val('');

	$('#div-checkspin-results').empty()

	$('#action-button').removeClass('disabled').on('click', submitForm);

	$('#keyword').focus();

}



function updateHelpInfos() {

	SpincheckerV1.minCustomerSentences = $('#min-customer-sentences').val();

	$('span#help-min-customer-sentences').html( SpincheckerV1.minCustomerSentences + ' phrase' + (SpincheckerV1.minCustomerSentences > 1 ? 's': ''));

	

	$('span#help-max-sentence-chars').html( SpincheckerV1.maxSentenceChars );

}



function submitForm() {

	var keyword = $('#keyword').val().trim(), 

		masterSpin = $('#master-spin').val().trim();

	

	if ( !keyword ) {

		MyUtils.displayInfoMessage('warning', "Veuillez saisir un mot-clé.");

		$('#keyword').focus();

		return;

	}

	if ( !masterSpin ) {

		MyUtils.displayInfoMessage('warning', "Veuillez saisir un paragraphe Master Spin.");

		$('#master-spin').focus();

		return;

	}

	

	$('#div-checkspin-results').empty();

	SpincheckerV1.analyzeMasterSpin(masterSpin, keyword, $('#ignore-first-sentence').is(":checked"));

}



function showHelp() {

	$('.info-message[class~=help]').slideUp(400, function() {

		$(this).find('.help-content').html('' +

			"<p>Cet outil permet d'analyser un paragraphe Master Spin saisi manuellement ou téléchargé. Vous pouvez télécharger des fichiers en cochant la case du même nom, puis en choisissant un ou plusieurs fichiers TXT dans le répertoire de votre choix." +

			"<p class='title'>L'outil vérifie les règles suivantes</p>" +

			"<ul>" +

				"<li>le paragraphe Master Spin contient au moins <span id='help-min-customer-sentences'></span> de type « client »</li>" +

				"<li>le paragraphe Master Spin contient au moins 1 phrase de type « neutre »</li>" +

				"<li>chaque phrase de type client crée 50% (&plusmn; <span id='rate-margin'></span>%) de spun avec le nom du client</li>" +

				"<li>chaque phrase comporte au plus <span id='help-max-sentence-chars'></span> caractères (la case \"Vérifier la longueur des phrases\" doit être cochée)</li>" +

			"</ul>" +

			"<p class='title'><i style='margin-right:10px' class='fa fa-lightbulb-o'></i>À propos la recherche des mots-clés client</p>" +

			"<ul>" +

				"<li>celle-ci n'étant pas sensible à la casse, le mot-clé <b>SFAM</b> correspond par exemple à <b>SFAM</b>, <b>Sfam</b> ou encore <b>sfam</b></li>" +

				"<li>quand la case <b>Ignorer les mot-clés entre guillemets</b> est cochée, le mot-clé <b>SFAM</b> ne correspond par exemple pas à <b>\"SFAM\"</b>, <b>«SFAM»</b>, <b>\" SFAM \"</b> ou encore <b>« SFAM »</b></li>" +

			"</ul>" +

			"<p class='title'><i style='margin-right:10px' class='fa fa-lightbulb-o'></i>À noter" +

			"<ul>" +

				"<li>En cas de téléchargement de fichiers, ceux-ci sont ajoutés par ordre alphabétique de nom de fichier.</li>" +

			"</ul>" +

		"</p>"

		);

		$('span#rate-margin').html(SpincheckerV1.rateMargin);

		updateHelpInfos();

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



