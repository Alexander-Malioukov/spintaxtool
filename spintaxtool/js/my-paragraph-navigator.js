
function ParagraphNavigator() {
	
	/** Constructor ******************************************************************************/

	var _this = this;
	
	/** Public methods ***************************************************************************/

	this.create = function() {
		$('body').append("" +
			"<div id='paragraph-navigator'>" +
				"<div class='main-zone'></div>" +
				"<div class='thumbnail'><i class='fa fa-lg fa-bars'></i></div>" +
			"</div>");
		$('#paragraph-navigator .thumbnail').on('mouseenter', this.open);
	}
	
	this.hide = function() {
		var cssRightZoneWidth = $('#paragraph-navigator .thumbnail').width(),
			cssLeftZoneWidth = $('#paragraph-navigator .main-zone').width();
		$('#paragraph-navigator').animate({ left: '-' + parseInt(cssRightZoneWidth + cssLeftZoneWidth) }, 400, empty);
	}

	this.open = function() {
		var cssLeft = parseInt($('#paragraph-navigator').css('left').replace('px',''));
		if ( cssLeft < 0 ) {
			$('#paragraph-navigator').animate({ left:0 }, 400, function() {
				$(this).on('mouseleave', _this.close);
			});
		}
	}

	this.close = function() {
		var cssLeft = parseInt($('#paragraph-navigator').css('left').replace('px','')),
			cssLeftZoneWidth = $('#paragraph-navigator .main-zone').width();
		if ( !cssLeft ) {
			$('#paragraph-navigator').animate({ left: '-' + cssLeftZoneWidth }, 400);
		}
	}

	this.fillAndShow = function(nbParagraphs) {
		$('#paragraph-navigator .main-zone').html("");
		this.addToggleInfosMessages();
		for ( var i=1; i <= nbParagraphs; i++ ) {
			$('#paragraph-navigator .main-zone').append("" +
				"<div class='container'>" +
					"<div style='float:left'>" + MySpeech.get("paragraph_navigator.paragraph_number",true) + " " + i + "</div>" +
					"<div style='text-align:right'>" +
						"<a href='#' title='" + MySpeech.get("paragraph_navigator.goto_content",true) + "' onclick='scrollToElement($(\"textarea[id^=spintax-paragraph-\").eq(" + parseInt(i-1) + ").parents(\".paragraph-container\"))'><i class='fa fa-fw fa-file-text-o'></i></a>" +
						"<a href='#' title=\""+ MySpeech.get("paragraph_navigator.goto_info_message",true) + "\" onclick='scrollToElement($(\"textarea[id^=spintax-paragraph-\").eq(" + parseInt(i-1) + ").next(\".info-message-wrapper\"))'><i class='fa fa-fw fa-comment-o'></i></a>" +
					"</div>" +
				"</container>");
		}
		show();
	}
	
	this.fillAndShow2 = function(nbParagraphs) {
		$('#paragraph-navigator .main-zone').html("");
		for ( var i=1; i <= nbParagraphs; i++ ) {
			$('#paragraph-navigator .main-zone').append("" +
				"<div class='container'>" +
					"<div style='float:left'>" + MySpeech.get("paragraph_navigator.paragraph_number",true) + " " + i + "</div>" +
					"<div style='text-align:right'>" +
						"<a href='#' title='" + MySpeech.get("paragraph_navigator.goto_content",true) + "' onclick='scrollToElement($(\"textarea[id^=spintax-paragraph-\").eq(" + parseInt(i-1) + ").parents(\".paragraph-container\"))'><i class='fa fa-fw fa-file-text-o'></i></a>" +
					"</div>" +
				"</container>");
		}
		show();
	}
	
	this.addLinkToArticleStats = function() {
		$('#paragraph-navigator .main-zone').append("" +
			"<div class='container'>" +
				"<div style='float:left'>" + MySpeech.get("paragraph_navigator.article_stats",true) + "</div>" +
				"<div style='text-align:right'>" +
					"<a href='#' title=\"Statistiques de l'article\" onclick='scrollToElement($(\"#article-stats\"))'><i class='fa fa-fw fa-tachometer'></i></a>" +
				"</div>" +
			"</container>");
	}
	
	this.addToggleInfosMessages = function() {
		$('#paragraph-navigator .main-zone').append("" +
			"<div class='container header' id='toggle-info-messages'>" +
				"<div style='float:left'>"+ MySpeech.get("paragraph_navigator.info_messages",true) + "</div>" +
				"<div style='text-align:right'>" +
					"<a href='#' title='' data-action=''></a>" +
				"</div>" +
			"</container>");
		
		updateToggleInfosMessagesMarkup('expand');
		$('#paragraph-navigator #toggle-info-messages').find('div').eq(1).find('a').one('click', expandAllInfosMessages);
	}
	
	/** Private methods **************************************************************************/

	function show() {
		var cssLeftZoneWidth = $('#paragraph-navigator .main-zone').width();
		$('#paragraph-navigator').animate({ left: '-' + cssLeftZoneWidth }, 800);
	}
	
	function empty() {
		$('#paragraph-navigator .main-zone').html("<p style='padding: 10px; text-align:center;'>" + MySpeech.get("paragraph_navigator.no_paragraph_to_display",true) + "</p>");
	}
	
	function updateToggleInfosMessagesMarkup(actionToCome) {
		var $toggleInfosMessages = $('#paragraph-navigator #toggle-info-messages'),
			$a = $toggleInfosMessages.find('div').eq(1).find('a');
		
		if (actionToCome == 'expand') {
			$a
				.attr('title', MySpeech.get("paragraph_navigator.open_all_info_messages",true))
				.attr('data-action', 'collapse')
				.html("<i class='fa fa-fw fa-toggle-off'></i>");
		}
		else {
			$a
				.attr('title', MySpeech.get("paragraph_navigator.close_all_info_messages",true))
				.attr('data-action', 'expand')
				.html("<i class='fa fa-fw fa-toggle-on'></i>");
		}
	}
	
	function expandAllInfosMessages() {
		$('.info-message-wrapper .db-toggle').each(function() {
			if ( $(this).hasClass('closed') ) {
				openToggle($(this), $.noop);
			}
		});
		MyUtils.displayInfoMessage('info', MySpeech.get("paragraph_navigator.all_info_messages_opened",true));
		updateToggleInfosMessagesMarkup('collapse');
		$('#paragraph-navigator #toggle-info-messages').find('div').eq(1).find('a').one('click', collapseAllInfosMessages);
	}
	
	function collapseAllInfosMessages() {
		$('.info-message-wrapper .db-toggle').each(function() {
			if ( $(this).hasClass('opened') ) {
				closeToggle($(this));
			}
		});
		MyUtils.displayInfoMessage('info', MySpeech.get("paragraph_navigator.all_info_messages_closed",true))
		updateToggleInfosMessagesMarkup('expand');
		$('#paragraph-navigator #toggle-info-messages').find('div').eq(1).find('a').one('click', expandAllInfosMessages);
	}
}

var ParagraphNavigator = new ParagraphNavigator();
