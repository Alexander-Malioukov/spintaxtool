
/**
 * @param {object}		oSpinchecker
 * @param {object}		$textarea
 * @param {boolean}		selectMultipleFiles
 * @param {function}	[finalCallback]
 */
function uploadFiles(oSpinchecker, $textarea, selectMultipleFiles, finalCallback) {
	var fileName,
		fileExtension,
		fileEncoding,
		fileContent;
	
	$textarea.val('');
	jQuery('#content_encode').val('');
	new fileReader().Init(
		'', // file types separated by pipes
		'text', // read file as dataURL / binary / array / text
		function (e) { // callBack function return {data: e.target.result, name: theFile.name, size: theFile.size}
			fileName = e.name;
			fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
			if ( fileExtension != 'txt') {
				MyUtils.displayInfoMessage('warning', "Fichier <i>" + fileName + "</i> ignoré (format <b>" + fileExtension.toUpperCase() + "</b> non pris en charge)");
				return;
			}
			try {
				
				}
			catch(error) {
				if ( error.message.indexOf('jschardet') > - 1 && error.message.indexOf('undefined') == 0) {
					MyUtils.displayInfoMessage('warning', "Le fichier <i>" + fileName + "</i> a été chargé mais un problème est survenu dans la détection de son encodage. Merci de recharger la page.");
				}
			}
			fileContent = e.data.trim()
			$textarea.val( $textarea.val() + ( $textarea.val() ? '\n\n' : '' ) + fileContent );
			
			oSpinchecker.aUploadedFileNames.push(fileName.substring(0, fileName.lastIndexOf('.')));
			
			if ( finalCallback != undefined && e.loadingComplete ) {
				finalCallback();
			}	
					
		}, 
		selectMultipleFiles // multiple file select
	);
}

/***********************************************************************************************************************/

//HTML5 fileReader v.1.0.0
//Author: Tóth András
//Licence: MIT
//url: http://atandrastoth.co.uk
var fileReader = function() {
    var init = function(types, readAs, callBack, multy) {
        multy = typeof multy == 'undefined' ? false : multy;
        var input = document.createElement('input');
        input.style.cssText = 'display: none;';
        input.type = "file";
        if (multy) input.multiple = true;
        document.querySelector('body').appendChild(input);
        input.addEventListener('change', selectFiles, false);
        input.click();

        function selectFiles(evt, finalCallback) {
            var files = (evt.target || evt.sourceElement).files;
            removeElement(input);
            for (var i = 0, f; f = files[i]; i++) {
                if (!f.name.toLowerCase().match('(.)(.*(' + types.toLowerCase() + '))')) {
                    continue;
                }
                var reader = new FileReader();
                reader.onload = (function(theFile) {
                	var loadingComplete = ( i == files.length - 1);
                    return function(e) {
                        //config required data from e, theFile
                        callBack({
                        	data: e.target.result, 
                        	name: theFile.name, 
                        	size: theFile.size,
                        	loadingComplete: loadingComplete});
                    };
                })(f);
                switch (readAs) {
                    case 'dataURL':
                        reader.readAsDataURL(f);
                        break;
                    case 'binary':
                        reader.readAsBinaryString(f);
                        break;
                    case 'array':
                        reader.readAsArrayBuffer(f);
                        break;
                    default:
//                            reader.readAsText(f, 'ISO-8859-1');
                    	reader.readAsText(f);
                }
            }
        }
    };

    function removeElement(element) {
        element && element.parentNode && element.parentNode.removeChild(element);
    }
    return {
        Init: function(types, readAs, callBack, multy) {
            init(types, readAs, callBack, multy);
        }
    }
};
