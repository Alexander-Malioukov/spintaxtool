<?php

	/**
	 * @param POST aItems (array) : array of items arrays
	 * @param POST conjunction (string, OPTIONAL) : "" / "et" / "ou" / "and" / "or"
	 * @param POST randomlyHideElements (integer) : 0/1
	 * @param POST finalPonctuation (string, can be empty)
	 * @param POST itemsSeparator (string)
	 * @param POST elementsCasePolicy (string) : DO_NOTHING / FIRST_LETTER_OF_FIRST_ELEMENT_UPPERCASE / FIRST_LETTER_OF_ALL_ELEMENTS_UPPERCASE
	 * @param POST language
	 */

	include_once '../inc/db-functions.php';
	include_once '../inc/Combinatorics.class.php';
	include_once '../class/PermutationsUppercase.class.php';
	include_once '../class/MySpeech.class.php';
	
	function applyUppercasePolicy(&$aPermutedItems, $elementsCasePolicy) {
		if ( $elementsCasePolicy != "DO_NOTHING" ) {
			$oSpintax = new PermutationUppercase();
			foreach ( $aPermutedItems as $i => $v ) {
				if ( $elementsCasePolicy == "FIRST_LETTER_OF_FIRST_ELEMENT_UPPERCASE" ) {
					$aPermutedItems[$i][0] = $oSpintax->applyUppercase($aPermutedItems[$i][0]);
				}
				if ( $elementsCasePolicy == "FIRST_LETTER_OF_ALL_ELEMENTS_UPPERCASE" ) {
					foreach ( $aPermutedItems[$i] as $j => $v ) {
						$aPermutedItems[$i][$j] = $oSpintax->applyUppercase($aPermutedItems[$i][$j]);
					}
				}
			}
		}
	}
	
	// Parameters check
	// ----------------
	if ( !isset($_POST['aItems']) || !count($_POST['aItems']) ) {
		returnAjaxResponse(false, 'message', MySpeech::get('GLOBAL.missing_parameter', $_POST['language']) . " (aItems).");
	}
	if ( !isset($_POST['randomlyHideElements']) ) {
		returnAjaxResponse(false, 'message', MySpeech::get('GLOBAL.missing_parameter', $_POST['language']) . " (randomlyHideElements).");
	}
	if ( !isset($_POST['finalPonctuation']) ) {
		returnAjaxResponse(false, 'message', MySpeech::get('GLOBAL.missing_parameter', $_POST['language']) . " (finalPonctuation).");
	}
	if ( !isset($_POST['itemsSeparator']) || !$_POST['itemsSeparator'] ) {
		returnAjaxResponse(false, 'message', MySpeech::get('GLOBAL.missing_parameter', $_POST['language']) . " (itemsSeparator).");
	}
	if ( !isset($_POST['elementsCasePolicy']) || !$_POST['elementsCasePolicy'] ) {
		returnAjaxResponse(false, 'message', MySpeech::get('GLOBAL.missing_parameter', $_POST['language']) . " (elementsCasePolicy).");
	}
	$conjunction = ( !isset($_POST['conjunction']) ? "" : $_POST['conjunction'] );
	
	// Ajax response
	// -------------
	try {
		$aPermutedItems = (new Math_Combinatorics)->permutations($_POST['aItems']);
		applyUppercasePolicy($aPermutedItems, $_POST['elementsCasePolicy']);
		
		$spintax = "";
		foreach ( $aPermutedItems as $aItems ) {
			$spintaxElt = buildSpintaxElement($aItems, $conjunction, $_POST['randomlyHideElements'], $_POST['finalPonctuation'], $_POST['itemsSeparator']);
			$spintax .= ( !$spintax ? "" : "|" ) . $spintaxElt;
		}
		returnAjaxResponse(true, 'spintax', '{' . $spintax . '}');
	}
	catch ( Exception $e ) {
		returnAjaxResponse(false, 'message', $e->getMessage());
	}

?>
