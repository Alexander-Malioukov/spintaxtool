<?php
	/**
	 * @param POST text
	 */

	include_once "../class/Reverso.class.php";
	
	$oReverso = new Reverso();
	$result = $oReverso->correctionText($_POST['text']);
	
	header("Content-Type: application/xml; charset=utf-8");
	echo $result['Corrections'];
?>
