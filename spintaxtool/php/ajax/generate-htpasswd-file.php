<?php

	/**
	 * @param GET {string} fileContent
	 */

	include_once '../inc/db-functions.php';
	
	if ( !isset($_GET['fileContent']) || !$_GET['fileContent'] ) {
		returnAjaxResponse(false, 'message', "Paramètre 'fileContent' manquant");
	}
	
	try {
		$htpasswdPath = '../../.htpasswd';
		unlink($htpasswdPath);
		
		$handle = fopen($htpasswdPath, 'a');
		foreach( explode("\n", $_GET['fileContent']) as $i => $line ) {
			if ( $i ) {
				fwrite($handle, PHP_EOL);
			}
			$array = explode(' ', $line);
			fwrite($handle, $array[0] . ':' . cryptApr1Md5($array[1]));
		}
		fclose($handle);
		
		returnAjaxResponse(true, 'message', '');
	}
	catch ( Exception $e ) {
		returnAjaxResponse(false, 'message', $e->getMessage());
	}

?>
