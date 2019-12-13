<?php


class MySpeech {

	/***********************************************************************************************/
	/* Variables                                                                                   */
	/***********************************************************************************************/

	private static $dictionnary = null;

	/***********************************************************************************************/
	/* Private methods                                                                             */
	/***********************************************************************************************/

	private static function loadDictionnary() {
		$fileContent = file_get_contents("../../my-speech-dictionnary.json");
		self::$dictionnary = json_decode($fileContent, true);
	}

	/***********************************************************************************************/
	/* Public methods                                                                              */
	/***********************************************************************************************/

	public static function get($key, $language) {
		if ( !$key || !$language ) {
			return null;
		}
		
		if ( !self::$dictionnary ) {
			self::loadDictionnary();
		}

		$key = $key . "." . $language;
		$aKeys = explode('.', $key);
		$result = null;
		foreach ( $aKeys as $k ) {
			$result = ( !$result ? self::$dictionnary[$k] : $result[$k] );
		}
		return $result;
	}

}

?>
