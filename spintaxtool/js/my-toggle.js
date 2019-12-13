
var toggleTimeout = 500;
var iconClass = { opened:'fa-angle-double-up', closed:'fa-angle-double-down' }; 


/**
 * @param {Object} $wrapper: jQuery object for all toggle's wrapper
 * @param {boolean} openFirst
 * @param {boolean} [allowOpenSeveral]
 * @param {boolean} [addNumbering] : add ordinal numbering to each title
 */
function createToggles($wrapper, openFirst, allowOpenSeveral, addNumbering) {
	var $togglesWrapper = $('<div class="db-toggles-wrapper">').appendTo($wrapper),
		allowOpenSeveral = allowOpenSeveral || false,
		addNumbering = addNumbering || false;
	
	// Wrap all toggles into a specific wrapper
	//-----------------------------------------
	$wrapper.find('.db-toggle').appendTo($togglesWrapper);
	
	// Set classes
	// -----------
	var no = 1;
	$wrapper.find('.db-toggle').each(function(index, value) {
		var toggleTitle = $(this).attr('data-title');
//		var toggleContent = $(this).html();
		var $toggleContent = $(this).clone(true,true).children();
		
		$(this).html('');
		$(this).addClass('opened');
		$(this).prepend('<div class="title">' + ( addNumbering ? '<span class="number">' + no++ + '</span>': '' ) + toggleTitle + '</div>');
		$(this).prepend('<div class="icon"><i class="fa ' + iconClass.opened + '"></i></div>');
//		$(this).after('<div class="content">' + toggleContent + '</div>');
		$(this).after( $('<div class="content"></div>').append($toggleContent) );
		
		if ( !index ) {
			if ( !openFirst ) {
				closeToggle($(this));
			}
		}
		else {
			closeToggle($(this));
		}
		
		// Set click handler
		// -----------------
		$(this).click(function() {
			if ( $(this).hasClass('opened') ) {
				closeToggle($(this));
			}
			else {
				var fnToExecuteFirst = ( allowOpenSeveral ? $.noop : function() { closeToggle($wrapper.find('.db-toggle[class~=opened]')); } );
				openToggle($(this), fnToExecuteFirst);
			}
		});
	});
}

function closeToggle($toggle) {
	$toggle.removeClass('opened').addClass('closed');
	$toggle.next('.content').slideUp(toggleTimeout, function() {
		$toggle.find('.icon i').removeClass(iconClass.opened).addClass(iconClass.closed);
	});
}

function openToggle($toggle, fnToExecuteFirst) {
	fnToExecuteFirst();
	$toggle.removeClass('closed').addClass('opened');
	$toggle.next('.content').slideDown(toggleTimeout, function() {
		$toggle.find('.icon i').removeClass(iconClass.closed).addClass(iconClass.opened);
	});
}

function updateToggleTitle($wrapper, title) {
	$wrapper.find('.db-toggle .title').html(title);
}

function updateToggleContent($wrapper, contentMarkup) {
	$wrapper.find('.db-toggle').next('.content').html(contentMarkup);
}
