<?php 
  //echo '<pre>';print_r($_POST);
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
<form id="contevForm" action="generate_content.php" method="post">
<div style="min-height:50px; background-color:#F1F1F1">
	<div style="float:left;margin-left:20px;margin-top:20px;">Final contents for  selection and permutation between paragraphs</div>
    <div style="float:left;padding-left:200px;margin-top:20px;">
		Select method &nbsp;&nbsp;
		<select name="method_option">
		  <option value=" ">--Select--</option>	
		  <option value="1" selected="selected">Swap together</option>
		  <option value="2">swap (3X2X1)</option>
		</select>
		</div>
	<div style="float:right;margin-right:20px;margin-top:20px;"><input type="button" class="submitFrm" value="Submit"></div>
</div>

<div>
   <?php if(!empty($_POST['pcontent'])){
	   //echo '<pre>';print_r($_POST['pcontent']);
	  $matches == ''; 
	  $count  = 0;
	  foreach($_POST['pcontent'] as $pcontents)
	  {
		// echo '<pre>';print_r($pcontents);
		  $pattern1 = "/<h[1-6]>(.*?)<\/h[1-6]>/";
		  preg_match($pattern1, $pcontents[0], $pmatches);
			
			if(!empty($pmatches)){
			?>
				<div style="min-height:40px;margin-bottom:7px;margin-top:10px;background-color:#F2F2F2;">
				 <div style="float:left;margin-top:10px;">Article's Paragraph</div>
				 <div style="float:right;margin-right:20px;margin-top:10px;">
				  Introduction &nbsp;&nbsp;<input type="radio" name="pra_position" value="intro">&nbsp;&nbsp;
				  Conclusion &nbsp;&nbsp;<input type="radio" name="pra_position" value="concl">
				 </div>
				</div>  
			<?php    
			  }
		   ?>
		 
		 <?php
		  for($i=0; $i<count($pcontents);$i++)
		  {
			  if($i==0)
			  {
			       $pattern = "/<h[1-6]>(.*?)<\/h[1-6]>/";
				   preg_match($pattern, $pcontents[$i], $matches);
				   
			  }
			  
			?>

   <p>
	   
	<input type="hidden" name="cnt_paragraph[<?php echo $count;?>][<?php echo $i;?>]" value="<?php echo $pcontents[$i];?>">
    <?php echo $pcontents[$i];?>
    <?php if(!empty($matches) && $count==0){ ?>
		<div style="padding-right:20px;" align="right">
			Do you want to make heading with Tag H1 <input type="radio" name="heading_tag" value="h1" checked="checked">&nbsp;&nbsp;
			H2<input type="radio" name="heading_tag" value="h2">
		</div>
	<?php } ?>
   </p>
   <?php
		}
		$count++;
	  }
	}
	else
	{
?>	
  <div>You did not select contents for permutation </div>	
<?php	
	}
?>
</div>

<div style="min-height:50px; background-color:#F1F1F1; margin-bottom:40px;margin-top:30px" align="center"><div style="margin-right:20px;padding:20px;"><input type="button" class="submitFrm" value="Submit"></div></div>
</form>  

<html>  
<script type="text/javascript" src="js/jquery-2.1.3.min.js"></script>
<script type="text/javascript">
$(document).ready(function(){
  $(".submitFrm").on('click', function(){
	$("#contevForm").submit();	
   });	
});
</script>
</html>
