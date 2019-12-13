<?php
	$filepath = $_POST["filepath"];
	$spinLimit = $_POST["spinLimit"];
	$spinType  = $_POST["spintype"];
    
    if(!empty($filepath) && !empty($spinLimit) && !empty($spinType)) {
		$a = explode("\\",$filepath);
		$filename = $a[2];
		move_uploaded_file($_FILES["file"]["tmp_name"],"cgi-bin/{$filename}");		
		header("Location: http://www.radianceconseil.com/script/cgi-bin/spin.py?filename={$filename}&stype={$spinType}&slimit={$spinLimit}");
	}
	else {
		header("Location: http://www.radianceconseil.com/script/");
	}
?>
