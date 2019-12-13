<?php

class PermutationUppercase {
	
	/***********************************************************************************************/
	/* Variables                                                                                   */
	/***********************************************************************************************/
	
	private $globalSpintax;
	private $charIndexesToUppercase;
	private $debug;
	
	/***********************************************************************************************/
	/* Constructor                                                                                 */
	/***********************************************************************************************/
	
	function __construct() {}
	
	/***********************************************************************************************/
	/* Private methods                                                                             */
	/***********************************************************************************************/
	
	private function displayMatch($index) {
		echo "" .
			"<div style='font-family:Courier New'>" .
				mb_substr($this->globalSpintax, 0, $index, 'utf-8') .
				"<span style='color:red; font-weight:bold'>" . mb_char_at($this->globalSpintax, $index) . "</span>" .
				mb_substr($this->globalSpintax, $index + 1, null, 'utf-8') .
			"</div>";
// 			substr_replace($this->globalSpintax, "<span style='color:red; font-weight:bold'>" . $this->globalSpintax[$index] . "</span>", $index, 1) . 
	}
	
	private function init($spintax, $debug) {
		$this->globalSpintax = $spintax;
		$this->charIndexesToUppercase = array();
		$this->debug = $debug;
	}
	
	private function getLastUsefulClosingBraceIndex($spintax) {
		$depth = 0;
		for ( $i = 0; $i < strlen($spintax); $i++ ) {
			if ( mb_char_at($spintax, $i) == '{' ) {
				$depth++;
			}
			if ( mb_char_at($spintax, $i) == '}' ) {
				if ( $depth - 1 == 0 ) {
					$result = $i;
					break;
				}
				$depth--;
			}
		}
		return $result;
	}
	
	private function getChoicesHavingDepthOne($spintax, $offset = 0) {
		$aChoices = array();
		
		if (mb_char_at($spintax, 0) != '{') {
			if ( $this->debug ) {
				$this->displayMatch($offset);
			}
			array_push($this->charIndexesToUppercase, $offset);
		}
		else {
			$depth = 0;
			$indexStart = 0;
			$lastClosingBraceIndex = $this->getLastUsefulClosingBraceIndex($spintax);
			if ( $this->debug ) {
// 				echo "<div><span style='border: 1px black dotted; text-weight:bold'>" . substr($spintax, $indexStart, $lastClosingBraceIndex - $indexStart + 1) . "</span> (offset : $offset)</div>";
				echo "<div><span style='border: 1px black dotted; text-weight:bold'>" . mb_substr($spintax, $indexStart, $lastClosingBraceIndex - $indexStart + 1, 'utf-8') . "</span> (offset : $offset)</div>";
			}
			for ($i = $indexStart; $i <= $lastClosingBraceIndex; $i++) {
				if ( mb_char_at($spintax, $i) == '{' ) {
					$depth++;
				}
				if ( mb_char_at($spintax, $i) == '}' ) {
					$depth--;
				}
				if (( mb_char_at($spintax, $i) == '|' && $depth == 1 ) || $i == $lastClosingBraceIndex ) {
// 					$choice = substr($this->globalSpintax, $offset + $indexStart + 1, $i - $indexStart - 1);
					$choice = mb_substr($this->globalSpintax, $offset + $indexStart + 1, $i - $indexStart - 1, 'utf-8');
					array_push($aChoices, array('spintax' => $choice, 'offset' => $offset + $indexStart + 1));
					$indexStart = $i;
					continue;
				}
			}
			
			if ( count($aChoices) ) {
				if ( $this->debug ) {
					var_dump($aChoices);
				}
				foreach($aChoices as $choice) {
					$this->getChoicesHavingDepthOne($choice['spintax'], $choice['offset']);
				}
			}
		}
	}
	
	/***********************************************************************************************/
	/* Public methods                                                                              */
	/***********************************************************************************************/
	
	public function applyUppercase($spintax, $debug = false) {
		$this->init($spintax, $debug);
		
		$this->getChoicesHavingDepthOne($spintax);
		
		$result = $this->globalSpintax;
		foreach ( $this->charIndexesToUppercase as $index ) {
			//$result = substr_replace($result, strtoupper($result[$index]), $index, 1);
			$result = "" .
				mb_substr($result, 0, $index, 'utf-8') .
				mb_strtoupper(mb_char_at($result, $index), 'utf-8') .
				mb_substr($result, $index + 1, null, 'utf-8');
		}
		return $result;
	}
	
}

?>
