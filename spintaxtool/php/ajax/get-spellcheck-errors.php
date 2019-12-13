<?php
	header("Access-Control-Allow-Origin: *");
	
	$ch = curl_init();
	
	curl_setopt ( $ch, CURLOPT_URL, "https://languagetool.org:8081" );
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, array(
		"languag" => "fr",
		"text" => urlencode("je mang des pommss")
	));
// 	curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
	
	curl_exec($ch);
	curl_close($ch);
?>
