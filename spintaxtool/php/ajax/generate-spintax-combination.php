<?php

	/**
	 * @param POST {array} aSpintaxSentences
	 */

	include_once '../inc/db-functions.php';
	include_once '../inc/Combinatorics.class.php';

	// Parameters check
	// ----------------
	if ( !isset($_POST['aSpintaxSentences']) ) {
		returnAjaxResponse(false, 'message', "Paramètre 'aSpintaxSentences' manquant.");
	}
	
	// Ajax response (text !)
	// ----------------------
	try {
		switch (count($_POST['aSpintaxSentences'])) {
			case 0: $spintaxResult = ""; break;
			case 1: $spintaxResult = $_POST['aSpintaxSentences'][0]; break;
			default:
				$combinatorics = new Math_Combinatorics;
				$aCombinations = $combinatorics->permutations(($_POST['aSpintaxSentences']));
				$spintaxResult = '{';
				foreach ($aCombinations as $key => $aCombination) {
					$spintaxResult .= ( !$key ? '' : '|') . implode($aCombination, ' ');
				}
				$spintaxResult .= '}';
		}
		returnRawAjaxResponse($spintaxResult);
	}
	catch ( Exception $e ) {
		returnAjaxResponse(false, 'message', $e->getMessage());
	}

?>
