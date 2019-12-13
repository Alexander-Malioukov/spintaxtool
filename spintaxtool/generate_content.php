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
<?php 
 error_reporting(1);
 include('contents.php');
 $obj    = new spinContents;
$content_arr  = array();
$swapping_method_option = $_POST['method_option'];
$headingTag				= $_POST['heading_tag'];	
if(!empty($_POST['cnt_paragraph']))
{
   $cnt   = 0;
   foreach($_POST['cnt_paragraph'] as $cnt_paragraph)
   {
	  if(count($cnt_paragraph)>1)
	  {
		 
		  $scontent = $obj->get_spinContent($cnt_paragraph,$swapping_method_option);
		  $content_arr[$cnt] = $scontent;
	  }
	  else
	  {
		 if($cnt==0){
			if(!empty($headingTag))
			{
			   $contentTxt    = preg_replace('/<h[1-6]>(.*?)<\/h[1-6]>/',"<".$headingTag.">$1</".$headingTag.">",$cnt_paragraph[0]);
			}
			else{
				$contentTxt   = $cnt_paragraph[0];
			}
		  }
		  else
		  {
		      $contentTxt    = preg_replace('/<h[1]>(.*?)<\/h[1]>/',"<h2>$1</h2>",$cnt_paragraph[0]);
		  }	
			$content_arr[$cnt]  = $contentTxt;
	  }
	  
	  $cnt++; 
   }
   
   
}

//echo '<pre>';print_r($content_arr);die;

  foreach($content_arr as $cntVal)
  {
      $count_cntVal = sizeof($cntVal);
      if($count_cntVal ==1)
      {
   ?>
       <div><?php echo $cntVal;?></div>
   <?php  
	  }
	  else
	  {
	      if($swapping_method_option !=1)
        
	      echo '<div>';
	      foreach($cntVal as $cval)
	      { 
			  $cnt_html = '';
			  $arrFirst = array();
			  $arrsecond = array();
			  $cn  =  count($cval);
			  for($i=0; $i<$cn; $i++)
			  {
			     if(is_array($cval[$i]))
			     {
				      $breaks = array("<br />","<br>","<br/>");  
					  $string   = str_ireplace($breaks, "\r\n", $cval[$i]['remain']);
					  $arrsecond[] .= $string;
					  
				 }
				 else
				 {
				     
				     $breaks = array("<br />","<br>","<br/>");  
					 $string = str_ireplace($breaks, "\r\n", $cval[$i]);
					 $arrFirst[]   .= $string;
					 
				  }
			  }
			 
			  $cnt_html   .= '<p>'.implode(",", $arrFirst).'</p>';
			  if(!empty($arrsecond))
			  {
			     foreach($arrsecond as $as)
			     {
				    $cnt_html   .= '<p>'.$as.'</p>';
				    //$cnt_html   .= '<br/>';
				 }
			  }
			  
			  if($cn==1)
			  {
			   
			   echo $pargraph_separater = '';
			  }
			  else
			  {
				echo $pargraph_separater = '<p>&nbsp</p>';  
				
			  }
			  
	   ?>
	    <p><?php echo $cnt_html;?></p>
	   <?php	   
		  }
		  echo '</div>';
	  }
  }
 ?>
 
</html>
