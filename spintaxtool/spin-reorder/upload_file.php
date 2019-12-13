<?php

	$filepath = $_POST["filepath"];
	$spinLimit = $_POST["spinLimit"];
	$spinType  = $_POST["spintype"];
         $target_path = "/home/contentspinning/public_html/spin-reorder/cgi-bin/" . basename( $_FILES["file"]["name"]);
         
    if(!empty($filepath) && !empty($spinLimit) && !empty($spinType)) {
		$a = explode("\\",$filepath);
//		$filename = $a[2];
               $filename = basename( $_FILES["file"]["name"]);
		move_uploaded_file($_FILES["file"]["tmp_name"],$target_path);		
		header("Location: /spin-reorder/cgi-bin/spin.py?filename=$filename&stype=$spinType&slimit=$spinLimit");
	}
	else {
		header("Location: /spin-reorder/");
	}
?>
