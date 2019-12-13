
function ButtonHandler() {
	
	/** PRIVATE PROPERTIES ***********************************************************************/

	var _this = this,
		loaderImagePath = "images/loader.gif",
		prevButtonLabel;
	
	/** PUBLIC METHODS ***************************************************************************/
	
	this.showLoader = function($button, showAjaxloader) {
		if ( showAjaxloader == undefined ) {
			showAjaxloader = false;
		}
		prevButtonLabel = $button.html();
		$button
			.css('position', 'relative')
			.attr('disabled', true)
			.addClass('disabled')
			.html("" + 
				"<div class='progress-bar' style='border-radius:8px'></div>" +
				( showAjaxloader ? "<img src='" + loaderImagePath + "' style='margin-right: 10px'>" : "" ) +
				"<span>" + MySpeech.get("processing", true) + " (0%)</span>" );
	}
	
	this.hideLoader = function($button) {
		$button.find(".progress-bar").remove();
		$button
			.attr('disabled', false)
			.removeClass('disabled')
			.html(prevButtonLabel);
	}
	
	this.setProgressBar = function($button, percents) {
		$button.find(".progress-bar").width(percents + "%");
		$button.find("span").html(MySpeech.get("processing", true) + " (" + Math.round(percents) + "%)");
	}
	
	/** PRIVATE METHODS **************************************************************************/

}

var ButtonHandler = new ButtonHandler();
