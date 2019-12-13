<?php
	/**
	 * 
	 * http://blog.afterthedeadline.com/2009/11/12/add-after-the-deadline-to-your-application/
	 * http://www.afterthedeadline.com/api.slp
	 * 
	 */
	include_once '../inc/db-functions.php';
	
 	$qerystring = "";
	foreach ($_GET as $k => $v) {
		$qerystring .= ( $qerystring ? "&" : "" ) . $k . "=" . $v;
	}
	
	$data = AtD_http_post($qerystring, "fr.service.afterthedeadline.com", "/" . $_GET['action']);
	header("Content-Type: text/xml");
	echo $data[1];
?>
