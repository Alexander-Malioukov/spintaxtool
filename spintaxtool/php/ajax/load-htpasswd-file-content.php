<?php

	/**
	 * @param none
	 */

	include_once '../inc/db-functions.php';
	
	try {
		$htpasswdPath = '../../.htpasswd';
		$fileContent = ( file_exists($htpasswdPath)  ? file_get_contents($htpasswdPath) : "" );
		returnAjaxResponse(true, 'fileContent', $fileContent);
	}
	catch ( Exception $e ) {
		returnAjaxResponse(false, 'message', $e->getMessage());
	}

?>
