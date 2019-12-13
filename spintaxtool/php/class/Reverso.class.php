<?php
/**
 * Based on : http://www.reverso.net/spell-checker/french-spelling-grammar/
 * 
 * API : http://orthographe.reverso.net/rispellerws/RestSpeller.svc/help
 * 
 */

class Reverso {
	private $langue = "fra";
	private $url = "http://orthographe.reverso.net/RISpellerWS/RestSpeller.svc/v1/CheckSpellingAsXml/language={langue}?outputFormat=json&doReplacements=false&interfLang={langue}&dictionary=both&spellOrigin=interactive&includeSpellCheckUnits=true&includeExtraInfo=false&isStandaloneSpeller=true";
	public function setLangue($lg) {
		$this->$langue = $lg;
	}
	public function correctionText($txt) {
		$url = str_replace ( '{langue}', $this->langue, $this->url );
		$fields_string = "";
		$ch = curl_init ();
		curl_setopt ( $ch, CURLOPT_HTTPHEADER, array (
			'User-Agent:Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',
			'Origin:http://www.reverso.net',
			'Referer:http://www.reverso.net/orthographe/correcteur-francais/',
			'Host:orthographe.reverso.net',
			'Accept-Encoding:gzip, deflate, sdch',
			'Accept-Language:fr-FR,fr;q=0.8,en-US;q=0.6,en;q=0.4',
			'Access-Control-Request-Headers:accept, content-type, created, username, x-requested-with',
			'Access-Control-Request-Method:POST',
			'Accept:*/*',
			'Created: 01/01/0001 00:00:00',
			'Username: OnlineSpellerWS' 
		) );
		curl_setopt ( $ch, CURLOPT_URL, $url );
		curl_setopt ( $ch, CURLOPT_POSTFIELDS, $txt );
		curl_setopt ( $ch, CURLOPT_SSL_VERIFYPEER, FALSE );
		curl_setopt ( $ch, CURLOPT_COOKIEFILE, "cookie.txt" );
		curl_setopt ( $ch, CURLOPT_COOKIEJAR, "cookie.txt" );
		curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
		curl_setopt ( $ch, CURLOPT_FOLLOWLOCATION, true );
		$result = json_decode ( curl_exec ( $ch ), true );
		$datas = curl_getinfo ( $ch );
		curl_close ( $ch );
		return $result;
	}
}
?>
