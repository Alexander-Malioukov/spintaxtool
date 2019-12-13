<?php
$file1 = strip_tags($_GET["f1"]);
$file2 = strip_tags($_GET["f2"]);

if(file_exists("cgi-bin/{$file1}")) {
	unlink("cgi-bin/{$file1}");
}

if(file_exists("cgi-bin/{$file2}")) {
	unlink("cgi-bin/{$file2}");
}

header("Location: http://radianceconseil.com/script/");
?>
