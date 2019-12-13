<?php

ini_set('memory_limit', '2048M');

function returnAjaxResponse($success, $dataKey, $data) {
	$result = array( 'success' => $success, $dataKey => $data);
	header('Content-type: application/json');
	echo json_encode($result, JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
	die();
}

function returnRawAjaxResponse($data) {
	header('Content-type: application/json');
	echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
	die();
}

function buildSpintaxElement($aItems, $conjunction, $randomlyHideElements, $finalPonctuation, $itemsSeparator) {
	$result = "";
	$lastElement = array_pop($aItems);
	if ( $randomlyHideElements && count($aItems) >= 2 ) {
		$result .= array_shift($aItems);
		foreach ($aItems as $value) {
			$result .= '{|||||' . $itemsSeparator . $value . '}';
		};
	}
	else {
		$result .= implode($itemsSeparator, $aItems);
	}
	
	$result .= ( $conjunction ? " " . $conjunction . " " : $itemsSeparator ) . $lastElement;
	
	if ( $finalPonctuation ) {
		$result .= ( $finalPonctuation != "." ? " " : "" ) . $finalPonctuation;
	}
	
	return $result;
}

// function permuteItems($aItems, &$usedChars = null, &$permArr = null) {
// 	if ($permArr === null) {
// 		$permArr = array();
// 	}
// 	if ($usedChars === null) {
// 		$usedChars = array();
// 	}
// 	for ($i = 0; $i < count($aItems); $i++) {
// 		$ch = array_splice($aItems, $i, 1)[0];
// 		array_push($usedChars, $ch);
// 		if ( !count($aItems) ) {
// 			array_push($permArr, $usedChars);
// 		}
// 		permuteItems($aItems, $usedChars, $permArr);
// 		array_splice($aItems, $i, 0, $ch);
// 		array_pop($usedChars);
// 	}
// 	return $permArr;
// }

// function setFirstLetterUpperCase($text) {
// 	if ( $text[0] != '{' ) {
// 		return ucfirst($text);
// 	}
	
// 	$pattern = "/[^{|}]+/";
// 	preg_match_all ( $pattern, $text, $matches, PREG_OFFSET_CAPTURE );
// 	foreach ($matches[0] as $match) {
// 		$matchIndex = $match[1];
// 		$text[$matchIndex] = ucfirst($text[$matchIndex]); 
// 	}
// 	return $text;
// }

function generatePassword($length = 10) {
	$chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	$count = mb_strlen($chars);

	for ($i = 0, $result = ''; $i < $length; $i++) {
		$index = rand(0, $count - 1);
		$result .= mb_substr($chars, $index, 1);
	}
	return $result;
}

function cryptApr1Md5($plainpasswd) {
	$salt = substr(str_shuffle("abcdefghijklmnopqrstuvwxyz0123456789"), 0, 8);
	$len = strlen($plainpasswd);
	$text = $plainpasswd.'$apr1$'.$salt;
	$bin = pack("H32", md5($plainpasswd.$salt.$plainpasswd));
	$tmp = "";
	for($i = $len; $i > 0; $i -= 16) { $text .= substr($bin, 0, min(16, $i)); }
	for($i = $len; $i > 0; $i >>= 1) { $text .= ($i & 1) ? chr(0) : $plainpasswd{0}; }
	$bin = pack("H32", md5($text));
	for($i = 0; $i < 1000; $i++)
	{
	$new = ($i & 1) ? $plainpasswd : $bin;
	if ($i % 3) $new .= $salt;
	if ($i % 7) $new .= $plainpasswd;
	$new .= ($i & 1) ? $bin : $plainpasswd;
	$bin = pack("H32", md5($new));
	}
	for ($i = 0; $i < 5; $i++)
	{
	$k = $i + 6;
	$j = $i + 12;
	if ($j == 16) $j = 5;
		$tmp = $bin[$i].$bin[$k].$bin[$j].$tmp;
	}
	$tmp = chr(0).chr(0).$bin[11].$tmp;
	$tmp = strtr(strrev(substr(base64_encode($tmp), 2)),
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
	"./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");

    return "$"."apr1"."$".$salt."$".$tmp;
}

function AtD_http_post($request, $host, $path, $port = 80) {
	$http_request  = "POST $path HTTP/1.0\r\n";
	$http_request .= "Host: $host\r\n";
	$http_request .= "Content-Type: application/x-www-form-urlencoded\r\n";
	$http_request .= "Content-Length: " . strlen($request) . "\r\n";
	$http_request .= "User-Agent: AtD/0.1\r\n";
	$http_request .= "\r\n";
	$http_request .= $request;
		
	$response = '';
	if ( false != ( $fs = @fsockopen($host, $port, $errno, $errstr, 10) ) ) {
		fwrite($fs, $http_request);
			
		while ( !feof($fs) ) {
			$response .= fgets($fs);
		}
		fclose($fs);
		$response = explode("\r\n\r\n", $response, 2);
	}
	return $response;
}

function mb_char_at($str, $i) {
	return mb_substr($str, $i, 1, 'utf-8');
}

?>
