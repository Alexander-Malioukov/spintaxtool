
function MyUtils() {
	
	/** PRIVATE PROPERTIES ***********************************************************************/

	var _this = this,
		INFO_MESSAGE_DURATION = 5000; // in milliseconds
	
	/** PUBLIC PROPERTIES ************************************************************************/
	
	
	/** PRIVATE METHODS **************************************************************************/
		
		
	/** PUBLIC METHODS ***************************************************************************/
	
	/**
	 * @param	{Array} array
	 * @return	{Array}
	 */
	this.removeDoublons = function (array) {
		return $.grep(array, function(el, index) {
			return index === $.inArray(el, array);
		});
	}
	
	/**
	 * @param {string} type : success / warning / error / info
	 * @param {string} message
	 */
	this.displayInfoMessage = function (type, message) {
		var type = ( type == 'error' ? 'danger' : type ),
			delay = ( type == 'danger' ? 0 : INFO_MESSAGE_DURATION),
			allowDismiss = ( !delay ? true : false);
		
		$.simplyToast(message, type, { delay:delay, allowDismiss:allowDismiss });
	}
	
}

var MyUtils = new MyUtils();


/*****************************************************************************************************************/


String.prototype.ucFirst = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.lcFirst = function() {
	return this.charAt(0).toLowerCase() + this.slice(1);
}

String.prototype.isFirstUpperCase = function() {
	return /^[A-Z]/.test(this);
}

String.prototype.splitByIndexes = function(aIndexes, excludeCharAtSplitIndexes, trim) {
	var aResult = [],
		indexStart,
		indexEnd;
	
	if ( this.length ) {
		aIndexes.unshift(0);
		if ( aIndexes[aIndexes.length-1] != this.length - 1 ) {
			aIndexes.push(this.length);
		}
		for (var i = 0; i < aIndexes.length - 1; i++) {
			indexStart = aIndexes[i];
			indexEnd = aIndexes[i+1];
			if (i) {
				indexStart++;
			}
			if ( !excludeCharAtSplitIndexes ) {
				indexEnd++;
			}
			aResult.push( ( trim ? this.substring(indexStart, indexEnd).trim() : this.substring(indexStart, indexEnd) ) );
		}
	}
	
	return aResult;
}

String.prototype.replaceCharByString = function(charIndex, string) {
	return this.substring(0, charIndex) + string + this.substring(charIndex+1);
}

String.prototype.insertStringAt = function(stringToInsert, position) {
	return [this.slice(0, position), stringToInsert, this.slice(position)].join('');
}

String.prototype.formatBigNumber = function() {
	if ( this == Infinity ) {
		return Infinity;
	}
	
	if (this.length <= 6) {
		return this.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ");
	}
	else {
		var result,pluriel;
		switch (this.length) {
			case 7:
			case 8:
			case 9:
				result = (this/1000000);
				pluriel = (result >= 2 ? 's' : '' );
				return result.toFixed(1).replace('.0', '').replace('.', ',') + ' million' + pluriel;
			case 10:
			case 11:
			case 12:
				result = (this/1000000000);
				pluriel = (result >= 2 ? 's' : '' );
				return result.toFixed(1).replace('.0', '').replace('.', ',') + ' milliard' + pluriel;
			default:
//				result = Math.round(this / Math.pow(10,this.length-1));
//				return result + 'x10<sup>' + parseInt(this.length - 1) + '</sup>';
//				return "plus de 1000 milliards";
				return Infinity;
		}
	}
}

Array.prototype.clean = function(deleteValue) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == deleteValue) {         
			this.splice(i, 1);
			i--;
		}
	}
	return this;
};

function factorial(n) {
	if (n === 0) {
		return 1;
	}
	return n * factorial(n - 1);
}

function autoresizeTextarea($textarea) {
	$textarea.on('keyup input', function() {
		var offset = this.offsetHeight - this.clientHeight;
		$(this).css('height', 'auto').css('height', this.scrollHeight + offset);
	});
	$textarea.trigger('input')
}

/**
 * @param $element
 * @param [fnCallback]
 */
function scrollToElement($element, fnCallback) {
	$('html, body').animate({
		scrollTop: $element.offset().top },
		700,
		( fnCallback != undefined ? fnCallback : $.noop ));
}

//
//// Usage : $("#myTextBoxSelector").getCursorPosition();
//(function ($, undefined) {
//	$.fn.getCursorPosition = function() {
//		var el = $(this).get(0);
//		var pos = 0;
//		if('selectionStart' in el) {
//			pos = el.selectionStart;
//		} else if('selection' in document) {
//			el.focus();
//			var Sel = document.selection.createRange();
//			var SelLength = document.selection.createRange().text.length;
//			Sel.moveStart('character', -el.value.length);
//			pos = Sel.text.length - SelLength;
//		}
//		return pos;
//	}
//})(jQuery);

/**
 * @param {Array<Elements>} aCells : array of DOM elements (an element for a table cell)
 * @param {string} mode : MIN_VALUE / MAX_VALUE
 */
function markExtremeValueIntoTable(aCells, mode) {
	var cellValue,
		extremeValue,
		fontColor = { minValue: '#ce4844', maxValue: '#5cb85c' };
	
	$.each(aCells, function(i,cell) {
		cellValue = parseFloat($(cell).html().replace('%','').replace(',','.').trim());
		if ( mode == 'MAX_VALUE' ) {
			extremeValue = ( extremeValue == undefined ? cellValue : ( cellValue > extremeValue ? cellValue : extremeValue ) );
		}
		else {
			extremeValue = ( extremeValue == undefined ? cellValue : ( cellValue < extremeValue ? cellValue : extremeValue ) );
		}
	});
	
	$.each(aCells, function(i,cell) {
		cellValue = parseFloat($(cell).html().replace('%','').replace(',','.').trim());
		if ( cellValue == extremeValue ) {
			$(cell).css('color', ( mode == 'MAX_VALUE' ? fontColor.maxValue : fontColor.minValue ));
			$(cell).css('font-weight', 'bold');
		}
	});
}























