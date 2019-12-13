<?php

class SpintaxVariations {

	/***********************************************************************************************/
	/* Variables                                                                                   */
	/***********************************************************************************************/

	private static $dictionnary = null;

	/***********************************************************************************************/
	/* Private methods                                                                             */
	/***********************************************************************************************/

	private static function mb_substr_replace($string, $replacement, $start, $length = NULL) {
		if (is_array ( $string )) {
			$num = count ( $string );
			// $replacement
			$replacement = is_array ( $replacement ) ? array_slice ( $replacement, 0, $num ) : array_pad ( array ($replacement), $num, $replacement );
			// $start
			if (is_array ( $start )) {
				$start = array_slice ( $start, 0, $num );
				foreach ( $start as $key => $value )
					$start [$key] = is_int ( $value ) ? $value : 0;
			} else {
				$start = array_pad ( array ($start), $num, $start );
			}
			// $length
			if (! isset ( $length )) {
				$length = array_fill ( 0, $num, 0 );
			} elseif (is_array ( $length )) {
				$length = array_slice ( $length, 0, $num );
				foreach ( $length as $key => $value )
					$length [$key] = isset ( $value ) ? (is_int ( $value ) ? $value : $num) : 0;
			} else {
				$length = array_pad ( array ($length), $num, $length );
			}
			// Recursive call
			return array_map ( __FUNCTION__, $string, $replacement, $start, $length );
		}
		preg_match_all ( '/./us', ( string ) $string, $smatches );
		preg_match_all ( '/./us', ( string ) $replacement, $rmatches );
		if ($length === NULL)
			$length = mb_strlen ( $string );
		array_splice ( $smatches [0], $start, $length, $rmatches [0] );
		return join ( $smatches [0] );
	}
	
	private static function extractNextBracketsBlock($spintax, $depth) {
		$aResult = array("bracketsBlock" => null, "offset" => null);
		$curDepth = 0;
		for ( $i = 0; $i<strlen($spintax); $i++ ) {
			switch ( mb_char_at($spintax, $i) ) {
				case "{":
					if ( $curDepth == $depth ) {
						$indexBegin = $i;
					}
					$curDepth++;
					break;
						
				case "}":
					$curDepth--;
					if ( $curDepth == $depth ) {
						$aResult["bracketsBlock"] = mb_substr($spintax, $indexBegin, $i - $indexBegin + 1, "utf-8");
						$aResult["offset"] = $indexBegin;
						return $aResult;
					}
					break;
			}
		}
		return $aResult;
	}
	
	private static function extractReplacements($bracesBlock) {
		$aResult = array();
		$curDepth = 1;
		$indexBegin = 1;
		for ( $i = 1; $i<strlen($bracesBlock); $i++ ) {
			switch ( mb_char_at($bracesBlock, $i) ) {
				case "{": $curDepth++; break;
				case "}":
					$curDepth--;
					if ( !$curDepth ) {
						array_push($aResult, mb_substr($bracesBlock, $indexBegin, $i - $indexBegin, "utf-8" ));
					}
					break;
				case "|":
					if ( $curDepth == 1 ) {
						array_push($aResult, mb_substr($bracesBlock, $indexBegin, $i - $indexBegin, "utf-8" ));
						$indexBegin = $i + 1;
					}
					break;
			}
		}
		return $aResult;
	}

	/***********************************************************************************************/
	/* Public methods                                                                              */
	/***********************************************************************************************/

	public static function getAllVariations($spintax, &$aResult = array()) {
// 		echo $i . ") " . $spintax . "<br>";
		$aBlock = self::extractNextBracketsBlock($spintax, 0);
// 		var_dump($aBlock);

		if ( !empty($aBlock["bracketsBlock"]) ) {
			$aReplacements = self::extractReplacements($aBlock['bracketsBlock']);
// 			echo "<b>" . $aBlock['bracketsBlock'] . "</b> a pour remplacements :<br>";
// 			var_dump($aReplacements);
			foreach ( $aReplacements as $replacement ) {
				$newSpintax = self::mb_substr_replace( $spintax, $replacement, $aBlock['offset'], mb_strlen($aBlock["bracketsBlock"], "utf-8") );
// 				echo "<p><span style='color:green'>" . $spintax . "</span> DEVIENT <span style='color:red'>". $newSpintax . "</span></p>";
				self::getAllVariations( $newSpintax, $aResult );
			}
		}
		else {
			array_push($aResult, $spintax);
// 			echo "<p style='color:red; font-weight:bold'>$spintax</p>";
		}
		return $aResult;
	}
}

?>
