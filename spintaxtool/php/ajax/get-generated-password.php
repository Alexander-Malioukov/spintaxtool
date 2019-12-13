<?php

	/**
	 * @param none
	 */

	include_once '../inc/db-functions.php';
	
	try {
		returnRawAjaxResponse(strval(generatePassword()));
	}
	catch ( Exception $e ) {
		returnAjaxResponse(false, 'message', $e->getMessage());
	}

?>
