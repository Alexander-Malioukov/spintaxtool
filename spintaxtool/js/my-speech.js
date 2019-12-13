
function MySpeech() {
	
	/** PRIVATE PROPERTIES ***********************************************************************/

	var _this = this,
		language = null,
		application = null,
		dictionnary = {};
	
	
	/** PUBLIC METHODS ***************************************************************************/
	
	this.init = function(app, lang, callback) {
		var dictionnaryFile = 'my-speech-dictionnary.json';
		$.getJSON(dictionnaryFile)
		.done(function(json) {
			dictionnary = json
			
			if ( dictionnary[app] == undefined ) {
				MyUtils.displayInfoMessage('error', "Application '" + app + "' unknown.");
				return;
			}
			
			language = lang;
			application = app;
			if ( callback != undefined ) {
				callback.call();
			}
			
			var key;
			$('head title').html(_this.get("application.title"));
			
			$('[data-speech-key]').each(function() {
				key = $(this).data('speech-key');
				$(this).html(_this.get(key));
			})
		})
		.fail(function() {
			MyUtils.displayInfoMessage('error', "File '" + dictionnaryFile + "' has a wrong JSON format.");
		});
	}
	
	/**
	 * @param {string} key
	 * @param {boolean} [ignoreApplication]
	 */
	this.get = function(key, globalMessage) {
		var keyStart = ( globalMessage != undefined && globalMessage ? "dictionnary.GLOBAL" : "dictionnary." + application );
		
		if ( !eval(keyStart + "." + key) || !eval(keyStart + "." + key + "." + language) ) {
			MyUtils.displayInfoMessage('error', "MySpeech can't find message having key :<br><i>" + key + "</i>.");
		}
		else {
			return eval (keyStart + "." + key + "." + language);
		}
	}
	
	this.getLanguage = function() {
		return language;
	}
	
	this.getApplication = function() {
		return application;
	}
	
}

var MySpeech = new MySpeech();
