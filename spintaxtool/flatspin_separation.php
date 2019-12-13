<?php
	/**
	 * @param POST {string} text
	 */

	$text = ( !isset($_POST['text']) ? "" : $_POST['text'] );
 
	$text_arr  = explode("</div>",$text);
	$cnt = 0;
	$final_arr  = array();
	foreach($text_arr as $val)
	{
	   $val = preg_replace("/<div>/", "", $val);
	   $breaks = array("<br />","<br>","<br/>");  
	   $val = str_ireplace($breaks, "\r\n", $val);
	   $sntarra  = explode("\r\n",$val);
	   $i  = 0;
	   foreach($sntarra as $vl)
	   {
	     if(empty($vl))
	     {
		  continue;
		 }
	     $final_arr[$cnt][$i]  = $vl;
	     $i++;
	   }
	   $cnt++;
	}
	$final_arr = array_map('array_filter', $final_arr);
    $final_arr = array_filter( $final_arr );
?>
<!DOCTYPE html>

<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width initial-scale=1.0 minimum-scale=1.0 maximum-scale=1.0 user-scalable=no" />
		<meta name="robots" content="noindex, nofollow">
	<title></title>
<link type="text/css" rel="stylesheet" href="css/font-awesome-4.3.0/css/font-awesome.min.css">
<link type="image/x-icon" rel="shortcut icon" href="favicon.ico">

<link type="image/x-icon" rel="icon" href="favicon.ico">
</head>
<style>
h1 { font-size : 12px;}
h2 { font-size : 10px;}
</style>
<div style="min-height:50px; background-color:#F1F1F1"><div style="float:left;margin-left:20px;margin-top:20px;">Choose Pragraph for final contents</div><div style="float:right;margin-right:20px;margin-top:20px;"><input type="button" class="submitFrm" value="Submit"></div></div>
<div>
   <div style="margin-left:10px;">
    <form name="separationFrm" id="separationFrm" action="flatspin_contents.php" method="POST">
        <?php 
           $counter   = 1;
           foreach($final_arr as $spval)
           {
			   array_filter($spval);
			   $spval = preg_replace("/<div>/", "", $spval);
			   //echo '<pre>';print_r($spval);
			   if(empty($spval) && $spval=='')
			   {
			     continue;
			   }
			   
		?>
		<div style="max-height:300px; overflow: scroll;  overflow-x:hidden;">
		<div style="min-height:15px;background-color: #5CB85C;padding: 20px;margin-bottom: 8px;"><span style="font-size:18px; color:#FFF;">Paragraph Content <?php echo $counter;?></span></div>
		  <?php 
		    foreach($spval as $val){?>
			  <div style="float:left; clear:both;"><div style="float:left; width: 20px; padding-top:5px; padding-right:10px;"><input type="checkbox" name="pcontent[<?php echo $counter;?>][]" value="<?php echo $val;?>"></div><div style="float:left; display:table;"><?php echo $val;?></div></div>
		  <?php } ?>
		</div>
		<!--</div>-->
		
		<?php
		$counter++;
		   }
        ?>
    </form>
   </div>
</div>
<div style="min-height:50px; background-color:#F1F1F1; margin-bottom:40px;margin-top:30px" align="center"><div style="margin-right:20px;padding:20px;"><input type="button" class="submitFrm" value="Submit"></div></div>
</html>   
<script type="text/javascript" src="js/jquery-2.1.3.min.js"></script>
<script type="text/javascript">
$(document).ready(function(){
  $(".submitFrm").on('click', function(){
	$("#separationFrm").submit();	
   });	
});
</script>
