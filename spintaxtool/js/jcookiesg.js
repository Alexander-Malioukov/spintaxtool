// JavaScript Document
 function setCookie(key, value) {  
		   var expires = new Date();  
		   expires.setTime(expires.getTime() + 31536000000); //1 year  
		   document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();  
		   }  
      
 function getCookie(key) {  
		   var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');  
		   return keyValue ? keyValue[2] : null;  
		   } 
