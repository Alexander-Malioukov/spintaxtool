

///**
// * @param	{array of objects} each object looks like { value:23, max:100 } ("max" key is optional)
// * @return	{jQuery object}
// */
//function buildSkillsObject(aBars) {
//	var $skills = $('<skills></skills>');
//	$.each(aBars, function(i,bar) {
//		$skills.append()
//	});
//	return $skills;
//}

/**
 * @param	{boolean} displayValues
 * @param	{string} scoresMode : BAD_AVERAGE_GOOD / INTERVAL
 * @param	{boolean} [enableRelativeMaxValue]
 * @return 	none
 */
$.fn.drawSkillBars = function(displayValues, scoresMode, enableRelativeMaxValue) {
	var enableRelativeMaxValue = enableRelativeMaxValue || false,
		$skill = $(this),
		$skillBars = $skill.find('progress');
	
	// Enable reative maximum value
	// ----------------------------
	if ( enableRelativeMaxValue ) {
		var relativeMaxValue = 0;
		$skillBars.each(function() {
			if ( $(this).val() > relativeMaxValue ) {
				relativeMaxValue = $(this).val();
			}
		});
		$skillBars.each(function() {
			$(this).prop('max', relativeMaxValue);
		});
	}
	
	// Display values
	// --------------
	if ( displayValues ) {
		var val;
		$skillBars.each(function() {
			val = new String(parseFloat($(this).val().toFixed(1))).replace('.', ',');
			$(this).next('span').html( $(this).next('span').html() + ' : ' + val );
		});
	}
	
	// Set bar colors
	// --------------
	if ( scoresMode == 'BAD_AVERAGE_GOOD' ) {
		var averageScore = $skill.attr('data-average-score'),
			goodScore = $skill.attr('data-good-score'),
			barScore;
		
		$skillBars.each(function() {
			barScore = $(this).val();
			if ( barScore < averageScore ) {
				$(this).addClass('bad-score');
			}
			else if ( barScore < goodScore ) {
				$(this).addClass('average-score');
			}
			else {
				$(this).addClass('good-score');
			}
		});
	}
	
	if ( scoresMode == 'INTERVAL' ) {
		var minScore = $skill.attr('data-min-score'),
			maxScore = $skill.attr('data-max-score'),
			barScore;
		
		$skillBars.each(function() {
			barScore = $(this).val();
			if ( barScore >= minScore && barScore <= maxScore ) {
				$(this).addClass('good-score');
			}
			else {
				$(this).addClass('bad-score');
			}
		});
	}
	
	// Show and animate skill bars
	// ---------------------------
	$skill.show();
	$skillBars.each(function() {
	  	var max = $(this).val();
		$(this).val(0).animate({ value: max }, { duration: 2000, easing: 'easeOutCirc' });
	});
} 
