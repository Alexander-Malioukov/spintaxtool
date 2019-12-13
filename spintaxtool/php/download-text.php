<?php
	/**
	 * @param POST {string} text
	 */

	$text = ( !isset($_POST['text']) ? "" : $_POST['text'] );
	
	/*header('Pragma: public'); 	// required
	header('Expires: 0');		// no cache
	header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
	header('Last-Modified: ' . date("Y-m-d H:i:s") );
	header('Cache-Control: private',false);
	header('Content-Type:text/plain; charset=UTF-8');
	header('Content-Disposition: attachment; filename="flatspin.txt"');
	header('Content-Transfer-Encoding: binary');
	header('Content-Length: '. strlen($text) );
	header('Connection: close');
	echo $text;
	die();*/
	//echo $text;die;
	// preg_match_all('/[^<div></div>]/', $text, $match); 
	$text_arr  = explode("</div>",$text);
	$cnt = 0;
	$final_arr  = array();
	foreach($text_arr as $val)
	{
	   $sntarra  = explode("\r\n",$val);
	  // echo '<pre>'; print_r($sntarra);
	   $i  = 0;
	   foreach($sntarra as $vl)
	   {
	     $final_arr[$cnt][$i]  = $vl;
	     $i++;
	   }
	   $cnt++;
	}
	
    echo '<pre>'; print_r($final_arr);
?>
