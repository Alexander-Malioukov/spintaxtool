
// Default ajax options  
$.ajaxSetup ({ 
	cache: false, 
	dataType:'json' // expecting data type from the server 
});

function showServerErrorNotification(jsonResponse) {
	MyUtils.displayInfoMessage('error', MySpeech.get("server_error", true) + " <code>status : " + jsonResponse.status + " (" + jsonResponse.statusText + ")");
} 
