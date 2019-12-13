<?php
ini_set('display_errors', '0');
//error_reporting(E_ALL); 
ini_set('max_execution_time', 0);
ini_set('Upload_max_filesize' , '1500 M');
//ini_set('Max_input_time',1000);
ini_set('max_execution_time', 0);
ini_set('Memory_limit', '640M');
ini_set('post_max_size', '2000M');
include('mdelete_cron.php');

//include('contents_class.php');
//$obj	=	new contentsClass;
mone_remove_old_data();
/*$path = $_SERVER['DOCUMENT_ROOT'].'/spintaxtool/uploads/processing/';
if( is_dir( $path ) ) {
    foreach (scandir($path) as $folder) {
        if ($folder != '.' && $folder != '..') {
            $ext = explode('_', $folder);
            if( ! isset( $ext[2] ) ||  $ext[2] !== 'processing' ) {
                $output[] = $folder;
            }
        }
    }   
}
@rename($path.$output[0],$path.$output[0].'_processsssss');
exit();*/
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width initial-scale=1.0 minimum-scale=1.0 maximum-scale=1.0 user-scalable=no" />
		<meta name="robots" content="noindex, nofollow">

		

		<title></title>



		<script type="text/javascript" src="js/jquery-2.1.3.min.js"></script>

		<script type="text/javascript" src="js/combinatorics.js"></script>

		<script type="text/javascript" src="js/jquery.textarea_autosize.min.js"></script>

		<script type="text/javascript" src="js/textarea-caret-position.js"></script>

		<script type="text/javascript" src="js/jquery.easing.1.3.js"></script>

		<script type="text/javascript" src="js/raphael-2.1.4.min.js"></script>

		<script type="text/javascript" src="js/justgage.js"></script>

		<script type="text/javascript" src="js/require.js"></script>

		<script type="text/javascript" src="js/jschardet/init.js"></script> <!-- needs requireJs -->

		<script type="text/javascript" src="js/simply-toast.min.js"></script>

		<script type="text/javascript" src="js/jquery.sortElements.js"></script>

		<script type="text/javascript" src="js/my-toggle.js"></script>

		<script type="text/javascript" src="js/my-files-upload.js"></script>

		<script type="text/javascript" src="js/my-utils.js"></script>

		<script type="text/javascript" src="js/my-ajax.js"></script>

		<!-- >script type="text/javascript" src="js/my-paragraph-navigator.js"></script -->

		<script type="text/javascript" src="js/spinerman.js"></script>
		<script type="text/javascript" src="js/cws-flatspin.js?ver=1.1"></script>

		<script type="text/javascript" src="js/my-speech.js"></script>
        <script type="text/javascript" src="js/jquery-confirm.min.js"></script>

		<script type="text/javascript" src="js/cws-spinchecker.js"></script>
        <script type="text/javascript" src="js/jszipjs.js"></script>
        <script type="text/javascript" src="js/filesavejs.js"></script>
        <script type="text/javascript" src="js/jcookiesg.js"></script>
        <script type="text/javascript" src="js/processing.js"></script>
        
        <link type="text/css" rel="stylesheet" href="css/jquery-confirm.min.css" />
		<!--------------------fancybox------------------------------->
			<script type="text/javascript" src="js/jquery.fancybox.pack.js?v=2.1.5"></script>
			<link rel="stylesheet" type="text/css" href="css/jquery.fancybox.css?v=2.1.5" media="screen" />
		<!--------------------fancybox------------------------------->
		<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">

		<link type="text/css" rel="stylesheet" href="css/font-awesome-4.3.0/css/font-awesome.min.css">

		<link type="text/css" rel="stylesheet" href="css/simply-toast.min.css" />

		<link type="text/css" rel="stylesheet" href="css/gridism.css" />

		<!-- link type="text/css" rel="stylesheet" href="css/my-paragraph-navigator.css" / -->		

		<link type="text/css" rel="stylesheet" href="css/main.css" />

		

		<link type="image/x-icon" rel="shortcut icon" href="favicon.ico">

		<link type="image/x-icon" rel="icon" href="favicon.ico">
<?php
$language = ($_COOKIE['languagename']);
if($language=='en'){
	$max_error = 'you have already reached pargraph limit';
	$min_error= "You cant set a smaller number of paragraphs";
	$max_ele_error='you have already reached element limit';
	$min_ele_error='you have already reached lower level of element';
}else{ 
	$max_error = 'Vous ne pouvez pas aller au-delà';
	$min_error= 'Vous ne pouvez pas aller au-delà';
	$max_ele_error= $min_ele_error=$min_error;
	};


?>


		<script type="text/javascript">
		$(document).ready(function() {
			
			$('.fancybox').fancybox({
				'showCloseButton': true,
				'onClose' : function(){window.location.reload(true);},
				 helpers   : { 
				   overlay : {closeClick: false} // prevents closing when clicking OUTSIDE fancybox 
				  }
				});
				
			$('input[type=image]').click(function(){
				var lag = $(this).val();
				setCookie('languagename', lag);
				var load_url = window.location.href.substr(0, window.location.href.indexOf('#'));
			    window.location.href =load_url;		
				});
				var langfren = getCookie('languagename');
			
			 if (getCookie('languagename') == null ) {
					 var userLang = navigator.language || navigator.browserLanguage; 
					 //alert(userLang);
					 if (userLang=='en-US') {
						 var languagename =  'en';
					 } else if (userLang=='fr'){
						 var languagename =  'fr';	 
					 } else {
					     var languagename =  'fr';
					 }
			 } else {
			     
				     var languagename = getCookie('languagename'); 
			 }

			MySpeech.init('Spinchecker', languagename, function() { Spinchecker.init() });
			
			$("#swap_paragraph_option").on('click', function(){
			  if($(this).is(':checked')){
				   $("input[name='pr_swap_from_hide']").val(1);
			  $("input[name='pr_swap_to_hide']").val($("#tot_detected_paragraph").val());
				//$("#pr_swap_from").val(1); 
				$("#pr_swap_from").val($("#tot_detected_paragraph").val());
				$("#pr_swap_to").val($("#tot_detected_paragraph").val());				
				$("#btm-error-bottom").html('');
				$(".random-opt-area-btm").css('display','block');
			  }
			  else
			  {
			     $("#pr_swap_from").val('');
			     $("#pr_swap_to").val('');
			     $("#btm-error-bottom").html('');
			     $(".random-opt-area-btm").css('display','none');
			  }
			});
			
		   $("#incrFrmVal").on("click", function(){
			  var totalDetectedPrValue =  $("#tot_detected_paragraph").val();
			  var from_hide =	$("input[name='pr_swap_from_hide']").val();
			  var to_hide = 	$("input[name='pr_swap_to_hide']").val();
		      var frmValue    = parseInt($("#pr_swap_from").val());
		      if( frmValue <= (totalDetectedPrValue -1) && frmValue < to_hide)
		      {
		         $("#pr_swap_from").val(frmValue + 1);
		         $("#btm-error-bottom").html(''); 
			  }
		      else
		      {
		        $("#btm-error-bottom").html('<?php echo $max_error; ?>');   
			  }
		   });
		   
		   $("#decrFrmVal").on('click', function(){
			   var from_hide =	$("input[name='pr_swap_from_hide']").val();
		      var frmValue    = parseInt($("#pr_swap_from").val());
		      if(frmValue !=1 && frmValue != from_hide)
		      {
		         $("#pr_swap_from").val(frmValue - 1);
		         $("#btm-error-bottom").html(''); 
			  }
		      else
		      {
		        $("#btm-error-bottom").html('<?php echo $min_error; ?>');   
			  }
		   });
		  //---------------------
		  $("#incrToVal").on("click", function(){
			  var totalDetectedPrValue =  $("#tot_detected_paragraph").val();
			   var to_hide = 	$("input[name='pr_swap_to_hide']").val();
		      var toValue    = parseInt($("#pr_swap_to").val());
		      if( toValue < totalDetectedPrValue && toValue < to_hide)
		      {
		         $("#pr_swap_to").val(toValue + 1);
		         $("#btm-error-bottom").html(''); 
			  }
		      else
		      {
		        $("#btm-error-bottom").html('<?php echo $max_error; ?>');   
			  }
		   });
		   
		   $("#decrToVal").on('click', function(){
			   var to_hide = 	$("input[name='pr_swap_to_hide']").val();
		      var from_hide =	$("input[name='pr_swap_from_hide']").val();
		       var toValue    = parseInt($("#pr_swap_to").val());
		      if(toValue !=1 && toValue != from_hide)
		      {
		         $("#pr_swap_to").val(toValue - 1);
		         $("#btm-error-bottom").html(''); 
			  }
		      else
		      {
		        $("#btm-error-bottom").html('<?php echo $min_error; ?>');   
			  }
		   });
		   
		   //--------------------------- inner section----------------------------------------//
		    $('body').on('click', '.incrFrmVal_inner', function(){
		      var toValue    = parseInt($(this).parent().parent().find('input:eq(2)').val());
		      var tofrm_hide    = parseInt($(this).parent().parent().find('input:last').val());
		      var totDetectedElement = $(this).parent().parent().parent().find('label span').text();
		      var totalElementValue  = parseInt(totDetectedElement);
		      if( toValue <= (totalElementValue - 1) && toValue < tofrm_hide)
		      {
		         $(this).parent().parent().find('input:eq(2)').val(toValue + 1);
		         $(this).parent().parent().find("#btm-error").html(''); 
			  }
		      else
		      {
		        $(this).parent().parent().find("#btm-error").html('<?php echo $max_ele_error; ?>');   
			  }
		   });
		   
		   $('body').on('click', '.decrFrmVal_inner', function(){
		      var toValue           = parseInt($(this).parent().parent().find('input:eq(2)').val());
		      var toValue_hide      = parseInt($(this).parent().parent().find('input:eq(2)').next().val());
		       //alert(toValue);
		      if( toValue !=1 && toValue != toValue_hide)
		      {
		         $(this).parent().parent().find('input:eq(2)').val(toValue - 1);
		         $(this).parent().parent().find("#btm-error").html(''); 
			  }
		      else
		      {
		        $(this).parent().parent().find("#btm-error").html('<?php echo $min_ele_error; ?>');   
			  }
		   });
		   
		   $('body').on('click', '.incrToVal_inner', function(){
		      var toValue    = parseInt($(this).parent().parent().find('input:last').prev().val());
		      var toValue_hide    = parseInt($(this).parent().parent().find('input:last').val());
		      var totDetectedElement = $(this).parent().parent().parent().find('label span').text();
		      var totalElementValue  = parseInt(totDetectedElement);
		      
		      if( toValue < totalElementValue && toValue <= toValue_hide)
		      {
		         $(this).parent().parent().find('input:last').prev().val(toValue + 1);
		         $(this).parent().parent().find("#btm-error").html(''); 
			  }
		      else
		      {
		        $(this).parent().parent().find("#btm-error").html('<?php echo $max_ele_error; ?>');   
			  }
		   });
		   
		   $('body').on('click', '.decrToVal_inner', function(){
		      var toValue    = parseInt($(this).parent().parent().find('input:last').prev().val());
		      var toValue_hide    = parseInt($(this).parent().parent().find('input:first').next().val());
		       //alert(toValue_hide);
		      if( toValue !=1 && toValue != toValue_hide)
		      {
		         $(this).parent().parent().find('input:last').prev().val(toValue - 1);
		         $(this).parent().parent().find("#btm-error").html(''); 
			  }
		      else
		      {
		        $(this).parent().parent().find("#btm-error").html('<?php echo $min_ele_error; ?>');   
			  }
		   });
		   //ajax form submit extra code
		   
		   
		   //extra code ends here

		});

		</script>
       <style>
.loading {
  position: fixed;
  z-index: 999;
  height: 2em;
  width: 2em;
  overflow: show;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

input {
    text-align: center !important;
}

/* Transparent Overlay */
.loading:before {
  content: '';
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.3);
}

/* :not(:required) hides these rules from IE9 and below */
.loading:not(:required) {
  /* hide "loading..." text */
  font: 0/0 a;
  color: transparent;
  text-shadow: none;
  background-color: transparent;
  border: 0;
}

.loading:not(:required):after {
  content: '';
  display: block;
  font-size: 10px;
  width: 1em;
  height: 1em;
  margin-top: -0.5em;
  -webkit-animation: spinner 1500ms infinite linear;
  -moz-animation: spinner 1500ms infinite linear;
  -ms-animation: spinner 1500ms infinite linear;
  -o-animation: spinner 1500ms infinite linear;
  animation: spinner 1500ms infinite linear;
  border-radius: 0.5em;
  -webkit-box-shadow: rgba(0, 0, 0, 0.75) 1.5em 0 0 0, rgba(0, 0, 0, 0.75) 1.1em 1.1em 0 0, rgba(0, 0, 0, 0.75) 0 1.5em 0 0, rgba(0, 0, 0, 0.75) -1.1em 1.1em 0 0, rgba(0, 0, 0, 0.5) -1.5em 0 0 0, rgba(0, 0, 0, 0.5) -1.1em -1.1em 0 0, rgba(0, 0, 0, 0.75) 0 -1.5em 0 0, rgba(0, 0, 0, 0.75) 1.1em -1.1em 0 0;
  box-shadow: rgba(0, 0, 0, 0.75) 1.5em 0 0 0, rgba(0, 0, 0, 0.75) 1.1em 1.1em 0 0, rgba(0, 0, 0, 0.75) 0 1.5em 0 0, rgba(0, 0, 0, 0.75) -1.1em 1.1em 0 0, rgba(0, 0, 0, 0.75) -1.5em 0 0 0, rgba(0, 0, 0, 0.75) -1.1em -1.1em 0 0, rgba(0, 0, 0, 0.75) 0 -1.5em 0 0, rgba(0, 0, 0, 0.75) 1.1em -1.1em 0 0;
}

/* Animation */

@-webkit-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-moz-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-o-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}






        #default-permutation-mode { font-size:19px !important;}
        form.db-form select.mini {
		  font-family: Roboto-Regular;
		  font-size: 14px !important;
		  margin: 0 0 5px 10px !important;
		  padding: 0 !important;
		}
		.random-opt-area #no_article { padding:10px;}
		.random-opt-area input{
		padding: 0px 0px !important;
		font-size: 12px !important;
		font-weight: 300 !important;
       }
       
       .random-opt-area-btm { margin-top:10px;}
       #btm-options input{
		  padding: 0px 0px !important;
		  font-size: 16px !important;
		  font-weight: 300 !important;   
	   }
       </style>
	  
	</head>

	

	<body>


		<div id="page-content">

			<!--<form class="db-form" id="db-form" onsubmit="return false">-->
			<!--<form class="db-form" id="db-form" method="post" action="create_text.php" onsubmit="return false">-->

			<form class="db-form" id="db-form" onsubmit="return false">


				<div class="grid">

					<div class="unit whole">
                    <div class="language_options">
                             <input type="image" src="images/fr.png" id="fr_lang" name="language" value="fr" name="setcookies" width="18px" height="12px" />
                             <input type="image" src="images/en.png" id="en_lang" name="language" value="en" name="setcookies" width="18px" height="12px"/>
                        </div>

						<!--<div class="info-message help">

							<div class="help-content"></div>

							<div class="close-button"><a href="#"></a></div>

						</div>-->

					</div>

				</div>

				

				<div class="grid">

					<div class="unit three-quarters"></div>

					

					<div class="unit one-quarter">

						<label style="color: rgba(0,0,0,0)"></label>

						<button id="uploadButton" class="action" onclick="uploadFiles(Spinchecker, $('#spintax-article'), true)" data-speech-key="form.button.upload_files"></button>

					</div>

				</div>

				
				<!-- commented on 12jan---->
				<!-----<div class="grid parameters-area">

					<div class="unit half">
						<label for="default-permutation-mode" data-speech-key="form.label.default_permutation_mode"></label>

						<select id="default-permutation-mode" name="default-permutation-mode">

							<option value="ALL_NOT_PERMUTABLE" data-speech-key="form.select.permutation_mode_none"></option>

							<option value="ALL_PERMUTABLE" data-speech-key="form.select.permutation_mode_all"></option>

							<option value="ALL_PERMUTABLE_EXCEPT_FIRST" data-speech-key="form.select.permutation_mode_all_except_first"></option>
							
							<option value="ALL_PERMUTABLE_EXCEPT_LAST" data-speech-key="form.select.permutation_mode_all_except_last"></option>
							
							<option value="ALL_PERMUTABLE_EXCEPT_FIRST_LAST" data-speech-key="form.select.permutation_mode_all_except_first_last"></option>
							

						</select>

					</div>

					

					<!--<div class="unit one-quarter">

						<input id="compare-paragraphs" name="compare-paragraphs" type="checkbox">

						<label for="compare-paragraphs" data-speech-key="form.label.compare_paragraphs"></label>

					</div>-->

					

					<!--<div class="unit one-quarter">

						<div id="show-current-brackets-block-container">

							<input id="show-current-brackets-block" name="show-current-brackets-block" type="checkbox" onclick="Spinchecker.clickOnCheckboxShowCurrentBracketsBlock()">

							<label for="show-current-brackets-block" data-speech-key="form.label.show_current_brackets_block"></label>

						</div>

					</div>---->
				<!---- commented on 12th jan------
				</div>

				-->

				<div id="main-zone">

					<div class="grid" id="spintax-article-container">

						<div class="unit whole">

							<label for="spintax-article" data-speech-key="form.label.spintax_article"></label>

							<!--<textarea id="spintax-article" name="spintax-article" class="spintax"></textarea>-->
							<textarea id="spintax-article"  class="spintax"></textarea>

						</div>

					</div>

				</div>

				<div class="grid" id="btm-options" style="display:none;">
				  <div class="unit half">
				   <span data-speech-key="form.label.para_detected"></span> : <span id="detected-paragraph">0</span> 
				   <input type="hidden" id="tot_detected_paragraph" value="">
				   <div><span data-speech-key="form.label.how_many_article"></span> &nbsp;<input type="text" name="no_article" id="no_article" style="width:100px;"></div>
				   <div><span data-speech-key="form.label.intro_htag"></span> &nbsp;<input type="checkbox" name="title_tag_with" id="title_tag_with" value="Y"></div>
				   <!--<div><span data-speech-key="form.label.add_ptag"></span> &nbsp;<input type="checkbox" name="add_p_tag" id="add_p_tag" value="Y"></div>-->
				  </div>
				  <div class="unit half " id='rdm' style="text-align:right">
				   <span data-speech-key="form.label.rand_swap"></span> &nbsp;&nbsp;<input type="checkbox" name="swap_paragraph_option" id="swap_paragraph_option" value="1">
				  <div class="random-opt-area-btm" style="display:none;">
					  <div style="float:right;">
						  <span data-speech-key="form.select.min_para_keep"></span> &nbsp;
						  <input type="text" name="pr_swap_from" id="pr_swap_from" value="1" style="width:30px" placeholder="x-value"> 
						  <span><span id="incrFrmVal" style="font-size:x-large;cursor: pointer;">+</span>&nbsp;&nbsp;<span id="decrFrmVal" style="font-size:x-large;cursor: pointer;">-</span></span> 
						  
						  
						   <span data-speech-key="form.select.upon"></span> 
					  &nbsp; <input type="text" name="pr_swap_to" id="pr_swap_to" value="" style="width:30px" placeholder="y-value">
					  <span><span id="incrToVal" style="font-size:x-large;cursor: pointer;">+</span>&nbsp;&nbsp;<span id="decrToVal" style="font-size:x-large;cursor: pointer;">-</span></span>
					 </div>

				  </div>
				   <div style="clear:both;"></div>
				   <div id="btm-error-bottom" style="color:red;" align="right"></div>
				  </div>
				<!---->
				</div>
				

				<div class="grid">

					<div class="unit half">

						<button id="cancelButton" class="cancel" onclick="window.location.reload()" data-speech-key="form.button.restart">Recommencer</button>

					</div>

					<div class="unit half d">

						<button id="submitButton" class="action" data-speech-key="form.button.article_analysis"></button>

					</div>

				</div>

			<input type="hidden" value="" id="content_encode" name="content_encode">	
			 <input type="text" name="pr_swap_from_hide" id="pr_swap_from" value="1" style="display:none" placeholder="x-value"> 
			 <input type="text" name="pr_swap_to_hide" id="pr_swap_to" value="" style="display:none" placeholder="y-value">
             <input type="hidden" value="<?php echo 'contents_' . uniqid();?>" name="folder" />
			</form>
<div id="inline1" style="width:400px;display: none;"> </div>
<a id="get_spin_result" class="fancybox" href="#inline1" style="display: none;">Inline</a>
<div class="loading" style="display:none">Loading&#8230;</div>

		</div>

<audio id="playaudio" controls style="display: none;">
  <source src="Ta-Da.mp3" type="audio/mpeg">
</audio>
		
<div class="loading-block">
    <div class="inner">
        <div class="spinner">
            <div class="double-bounce1"></div>
            <div class="double-bounce2"></div>
        </div>
    </div>
</div>
	</body>

	

</html>
