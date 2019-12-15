<?php
	error_reporting(E_ALL & ~E_NOTICE);
	ini_set('max_execution_time', 0);
	ini_set('Upload_max_filesize' , '1500 M');
	ini_set('max_execution_time', 0);
	ini_set('Memory_limit', '640M');
	ini_set('post_max_size', '2000M');
	define('APP_BASE_PATH', $_SERVER['DOCUMENT_ROOT'].('localhost' === $_SERVER['HTTP_HOST'] ? '/spintaxtool' : '').'/spintaxtool');
	define('APP_BASE_URL', '//'.$_SERVER['HTTP_HOST'].('localhost' === $_SERVER['HTTP_HOST'] ? '/spintaxtool' : '').'/spintaxtool');