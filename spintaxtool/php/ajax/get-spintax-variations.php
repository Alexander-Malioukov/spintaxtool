<?php

	/**
	 * @param POST {string} spintax
	 */

	include_once '../inc/db-functions.php';
	include_once '../class/SpintaxVariations.class.php';

	// Parameters check
	// ----------------
	if ( !isset($_POST['spintax']) ) {
		returnAjaxResponse(false, 'message', "Paramètre 'spintax' manquant.");
	}
	
	// Ajax response (text !)
	// ----------------------
	try {
		returnAjaxResponse( true, SpintaxVariations::getAllVariations($_POST['spintax']) );
	}
	catch ( Exception $e ) {
		returnAjaxResponse(false, 'message', $e->getMessage());
	}

?>
