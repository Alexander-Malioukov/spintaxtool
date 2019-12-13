<?php

	/**
	 * @param POST aItems (array) : array of items
	 * @param POST coordinatingConjunction (string, OPTIONAL) : "" / "et" / "ou"
	 * @param POST randomlyHideElements (integer) : 0/1
	 * @param POST finalPonctuation (string, can be empty)
	 * @param POST itemsSeparator (string)
	 */

	include_once '../inc/db-functions.php';

	// Parameters check
	// ----------------
	if ( !isset($_POST['aItems']) || !count($_POST['aItems']) ) {
		returnAjaxResponse(false, 'message', "Paramètre 'aItems' manquant.");
	}
	if ( !isset($_POST['randomlyHideElements']) ) {
		returnAjaxResponse(false, 'message', "Paramètre 'randomlyHideElements' manquant.");
	}
	if ( !isset($_POST['finalPonctuation']) ) {
		returnAjaxResponse(false, 'message', "Paramètre 'finalPonctuation' manquant.");
	}
	if ( !isset($_POST['itemsSeparator']) || !$_POST['itemsSeparator'] ) {
		returnAjaxResponse(false, 'message', "Paramètre 'itemsSeparator' manquant.");
	}
	
	$coordinatingConjunction = ( !isset($_POST['coordinatingConjunction']) ? "" : $_POST['coordinatingConjunction'] );
	
	// Ajax response
	// -------------
	try {
		returnAjaxResponse(
			true,
			'spintaxElt',
			buildSpintaxElement(
				$_POST['aItems'], 
				$coordinatingConjunction, 
				$_POST['randomlyHideElements'], 
				$_POST['finalPonctuation'], 
				$_POST['itemsSeparator']));
	}
	catch ( Exception $e ) {
		returnAjaxResponse(false, 'message', $e->getMessage());
	}

?>
