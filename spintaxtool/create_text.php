<?php
date_default_timezone_set('Asia/Ho_Chi_Minh');
if( ! isset( $_POST ) || empty( $_POST ) || ! isset( $_POST['pr_swap_from'] ) ) {
    echo 'Hi Bro !!!'; exit();
}
include('contents_class.php');
$obj	=	new contentsClass;

 //Extra code Ends Here
//die('<div align="center">kjfdhgkjfdhgkjh</br><a id="add_paragraph" class="button button-blue" href="#">Download Now</a></div>');
@$language = ($_COOKIE['languagename']);

if($_SERVER['HTTP_HOST'] == 'localhost')
{
    $fileUploadPath   =   $_SERVER['DOCUMENT_ROOT'].'/spintaxtool/uploads/tmp/';
    $zipFileLocation   = "http://".$_SERVER['HTTP_HOST']."/spintaxtool/download/".date('Y-m-d');
}
else
{
	$fileUploadPath   =   $_SERVER['DOCUMENT_ROOT'].'/spintaxtool/uploads/tmp/';
	$zipFileLocation   = "http://".$_SERVER['HTTP_HOST']."/spintaxtool/download/".date('Y-m-d');
}
$folder = $_POST['folder'];
unset( $_POST['folder'] );

$formData = $_POST;
if( ! isset( $formData['cnt_par'] ) || empty( $formData['cnt_par'] ) ) {
    echo $obj->render_popup( 'Sorry, Data is empty (1). Please try again or contact to admin' ); exit();
} else {

    $formData['cnt_par'] = $obj->convert_content($formData['cnt_par'], $folder);
    if( ! $formData['cnt_par'] ) {
        echo $obj->render_popup( 'Sorry, Data is empty (2). Please try again or contact to admin' ); exit();
    }
}
$no_article      		=	$formData['no_article'];   		// total no. of article want to generate
$pr_swap_from    		=	$formData['pr_swap_from'];         // starting paragraph no. for swapping
$pr_swap_to				=	$formData['pr_swap_to'];			// Ending paragraph no. for swapping
$add_p_tag				=	$formData['add_p_tag'];			//'Y'; if adding p tag in paragraph is needed
$title_tag_with  		=	'';								// convert <h2>,<h3>,.... into <h1> tag for very beginning of an article
$swap_paragraph_option 	=	'';								// paragrap swap option. If swap option flag is 1 then paragraph will be swapped between $pr_swap_from and $pr_swap_to randomly
if(isset($formData['title_tag_with']))
{
  $title_tag_with   = $formData['title_tag_with'];
}
if(isset($formData['swap_paragraph_option']))
{
  $swap_paragraph_option  = $formData['swap_paragraph_option'];
}
//var_dump($formData['cnt_par']); die();

$elementCountWithinParagraph    = array();
if(!empty($formData['cnt_par'])){
	foreach($formData['cnt_par'] as $cntpar)
	{
		$elementCountWithinParagraph[]  = $obj->countElements($cntpar['p_contents']);
	}

}
//$noOfParagraph		=	count($elementCountWithinParagraph);
//$higestValueInArr	= 	max($elementCountWithinParagraph);
//$dataElmttitle      =   array_filter(explode("\r\n",$formData['cnt_par'][1]['p_contents']));


//$countFirstElementInArr  = $obj->countElements($formData['cnt_par'][1]['p_contents']);

//-------------claculate possible count for file generation -----------------------//
//$possibleCount    = $higestValueInArr * $countFirstElementInArr;
//---------create folder to save file ----------------------------------//
$fileRoot         	= 	$fileUploadPath;
$filePath    		=   $fileRoot.'spin_'.date('Y-m-d').'/'.time();
if(!is_dir($filePath))
{
	mkdir($filePath, 0777, true);
}
//-----------------------end---------------------------------------------//
$metaTitleArr = array();
$metaDescriptionArr = array();
$h1TitleArray = array();
$otherTitleArray = array();
$introductionArr	=	array();
$conclusionArr		=	array();
$bodyElementArr    =	array();

foreach($formData['cnt_par'] as $cnt_par)
{
    if ($cnt_par['permutation_pos'] == 'META_TITLE') {
        $metaTitleArr[] = $cnt_par;
    } else if ($cnt_par['permutation_pos'] == 'META_DESCRIPTION') {
        $metaDescriptionArr[] = $cnt_par;
    } else if ($cnt_par['permutation_pos'] == 'H1_TITLE') {
        $h1TitleArray[] = $cnt_par;
    } else if ($cnt_par['permutation_pos'] == 'OTHER_TITLE') {
        $otherTitleArray[] = $cnt_par;
    } else if($cnt_par['permutation_pos'] == 'INTRO_PARAGRAPHP') {
	    $introductionArr[] = $cnt_par;
    } else if($cnt_par['permutation_pos']  == 'CONCLUSION_PARAGRAPH') {
		$conclusionArr[] = $cnt_par;
    } else {
		$bodyElementArr[] = $cnt_par;
    }
}
$total_intro = count($introductionArr);
$total_conclusion = count($conclusionArr);

/*
echo '<pre>';print_r($introductionArr);
echo '<pre>';print_r($conclusionArr);
echo '<pre>';print_r($bodyElementArr);
die;
*/
$totalCreatedFiles    = 0;

for($j=0; $j <= $no_article; $j++){

    //-------arrange introduction paragraph  section start -----------------------------------//
	$introElement   =    '';
    if(!empty($introductionArr)) {
        shuffle($introductionArr);

        $permutation_mode		=  $introductionArr[0]['permutation_mode'];
        $permutation_pos		=  $introductionArr[0]['permutation_pos'];
        $element_rand_from      =  $introductionArr[0]['rand_from'];
        $element_rand_to		=  $introductionArr[0]['rand_to'];
        $articleElements 		=  $introductionArr[0]['p_contents'];
        $htag_oper		 		=  $introductionArr[0]['h2op'];
        if($htag_oper==''){$htag_oper='na';}
        $articleElementArr	 	=  preg_split("#\n\s*\n#Uis", $articleElements);
        switch($permutation_mode) {

            case 'ALL_NOT_PERMUTABLE':
                 $introElement 			.=  $obj->get_nonpermutable($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);
            break;
            case 'ALL_PERMUTABLE':
                 $introElement 			.=  $obj->get_permutableElement($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);
            break;
            case 'ALL_PERMUTABLE_EXCEPT_FIRST':
                $introElement 			.=  $obj->get_permutableElementExecptFirst($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);
            break;
            case 'ALL_PERMUTABLE_EXCEPT_LAST':
                $introElement 			.=  $obj->get_permutableElementExecptLast($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);
            break;
            case 'ALL_PERMUTABLE_EXCEPT_FIRST_LAST':
                $introElement 			.=  $obj->get_permutableElementExecptFirstLast($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);
            break;

        }

        /*echo "<pre>";
        var_dump($introElement);
        echo "</pre>"; die();*/

        if($title_tag_with=='Y') {
            $introElement    = preg_replace('/<h[1-6]>(.*?)<\/h[1-6]>/',"<h1>$1</h1>",$introElement);
            $introElement    = preg_replace('/[H[1-6]](.*?)[H[1-6]]/',"[H1]$1[H1]",$introElement);
        }

        $elmtPattern = "/<h[1-6]>(.*?)<\/h[1-6]>/";
        preg_match($elmtPattern, $introElement, $elmatches);
        if(!empty($elmatches)){
            //$introElement  .= "\n"; //Note:- It will be changed after completing all logic.Now, it is using testing purpos
        }
		 else
		 {
		    //$introElement  .= "\n\n"; //Note:- It will be changed after completing all logic.Now, it is using testing purpos
		 }

   }
   else
   {

		//----- get element for title of the article--------//
		/*shuffle($dataElmttitle);
		$introElement    =     $dataElmttitle[0];
		$elmtPattern = "/<h[1-6]>(.*?)<\/h[1-6]>/";
		preg_match_all($elmtPattern, $introElement, $elmatches);
		shuffle($elmatches[0]);
		if(!empty($elmatches)){
			$introElement= $elmatches[0][0];
		    $introElement  .= "\n";
		}
		else
		{
		   //$introElement  .= "\n\n";
		}
		*/
	}
//print_r($introElement); die;
	//-----------------------END--------------------------------------------------------//
	//------------------ Start Conclusion section------------------------------------------------------------//
	   $elementSting   =   "";

		if(!empty($conclusionArr))
		{
			$elementSting			.= "\n\n";
			shuffle($conclusionArr);

			$permutation_mode		=  $conclusionArr[0]['permutation_mode'];
			$permutation_pos		=  $conclusionArr[0]['permutation_pos'];
			$element_rand_from      =  $conclusionArr[0]['rand_from'];
			$element_rand_to		=  $conclusionArr[0]['rand_to'];
			$articleElements 		=  $conclusionArr[0]['p_contents'];
			$htag_oper		 		=  $conclusionArr[0]['h2op'];
			if($htag_oper==''){$htag_oper='na';}
			$articleElementArr	 	=  preg_split("#\n\s*\n#Uis", $articleElements);
			switch($permutation_mode) {

				case 'ALL_NOT_PERMUTABLE':
					$elementSting 			 .=  $obj->get_nonpermutable($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);
				break;
				case 'ALL_PERMUTABLE':
					$elementSting 			.=  $obj->get_permutableElement($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);
				break;
				case 'ALL_PERMUTABLE_EXCEPT_FIRST':
					$elementSting 			.=  $obj->get_permutableElementExecptFirst($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);
				break;
				case 'ALL_PERMUTABLE_EXCEPT_LAST':
					$elementSting 			.=  $obj->get_permutableElementExecptLast($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);
				break;
				case 'ALL_PERMUTABLE_EXCEPT_FIRST_LAST':
					$elementSting 		    .=  $obj->get_permutableElementExecptFirstLast($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);
				break;
			}
		}
	//--------------------------------End -------------------------------------------------------------------------//

   //-------get element for another paragraph of article-------------------------------	//

	 $returnBodyElement			=  '';
		$p='';
	  if(!empty($bodyElementArr)){
		   if($swap_paragraph_option==1)//if swapping between paragraph is allowed
		   {
		   	    $newbodyElementArr=$obj->paragraph_operation($bodyElementArr,$pr_swap_from, $pr_swap_to,$total_intro,$total_conclusion );

		   }else{
			   $newbodyElementArr = $bodyElementArr;
			   }
		   $c=1;

		 if(!empty($newbodyElementArr)){
			foreach($newbodyElementArr as  $val)
			{
				trim($p);
				$new_p = preg_replace('/\s+/', '', $p);
                $new_p = trim($new_p);
				if($total_intro>=1 || $c>=2){
				    if( !empty( $new_p ) ||  $total_intro >= 1 ) {
				        $returnBodyElement .= "\n\n";
                    }
                }
				$permutation_mode		=  $val['permutation_mode'];
				$permutation_pos		=  $val['permutation_pos'];
				$element_rand_from      =  $val['rand_from'];
				$element_rand_to		=  $val['rand_to'];
				$articleElements 		=  $val['p_contents'];
				$htag_oper		 		=  $val['h2op'];
				if($htag_oper==''){$htag_oper='na';}
				$articleElementArr	 	=  preg_split("#\n\s*\n#Uis", $articleElements);

				if(($title_tag_with=='Y') && (empty($introElement))){
					if($c==1){ $articleElementArr  =  preg_replace('/<h[1-6]>(.*?)<\/h[1-6]>/',"<h1>$1</h1>", $articleElementArr);
					$articleElementArr  =  preg_replace('/[H[1-6]](.*?)[H[1-6]]/',"[H1]$1[H1]", $articleElementArr);
					}else{
					$articleElementArr = preg_replace('/<h1>(.*?)<\/h1>/',"<h2>$1</h2>", $articleElementArr);
					$articleElementArr = preg_replace('/[H1](.*?)[H1]/',"[H2]$1[H2]", $articleElementArr);
					}
				} elseif(($title_tag_with=='Y') && (!empty($introElement))){
						$articleElementArr = preg_replace('/<h1>(.*?)<\/h1>/',"<h2>$1</h2>", $articleElementArr);
						$articleElementArr = preg_replace('/[H1](.*?)[H1]/',"[H2]$1[H2]", $articleElementArr);
				}


				//if(($c > 1) && ($title_tag_with=='Y') && (!empty($introElement))){$articleElementArr = preg_replace('/<h1>(.*?)<\/h1>/',"<h2>$1</h2>", $articleElementArr);}
				switch($permutation_mode) {
					case 'ALL_NOT_PERMUTABLE':
						$returnBodyElement .=  $p= $obj->get_nonpermutable($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);
					break;
					case 'ALL_PERMUTABLE':
						$returnBodyElement .=  $p= $obj->get_permutableElement($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);
					break;
					case 'ALL_PERMUTABLE_EXCEPT_FIRST':
						$returnBodyElement .=  $p= $obj->get_permutableElementExecptFirst($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);
					break;
					case 'ALL_PERMUTABLE_EXCEPT_LAST':
					   $returnBodyElement 			.=  $p= $obj->get_permutableElementExecptLast($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);
					break;
					case 'ALL_PERMUTABLE_EXCEPT_FIRST_LAST':
					  $returnBodyElement 		.=  $p= $obj->get_permutableElementExecptFirstLast($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);
					break;

				}

				//if(($c==1) && ($title_tag_with=='Y') && (empty($introElement))){$returnBodyElement  =  preg_replace('/<h[1-6]>(.*?)<\/h[1-6]>/',"<h1>$1</h1>", $returnBodyElement);}
				$c++;
			}
		}
	  }
		 if($title_tag_with=='Y')
		  {
			    $introElement    = preg_replace('/<h[1-6]>(.*?)<\/h[1-6]>/',"<h1>$1</h1>",$introElement);
			    $introElement    = preg_replace('/[H[1-6]](.*?)[H[1-6]]/',"[H1]$1[H1]",$introElement);
		  }

		 @$textData			 =	$introElement;
		 //$returnBodyElement  =  preg_replace('/<h1>(.*?)<\/h1>/',"<h2>$1</h2>", $returnBodyElement);
		 $textData          .=  $returnBodyElement;


		 $conclusionElement  =  preg_replace('/<h1>(.*?)<\/h1>/',"<h2>$1</h2>", $elementSting);
		 $conclusionElement  =  preg_replace('/[H1](.*?)[H1]/',"[H2]$1[H2]", $elementSting);
		 $textData          .=	$conclusionElement;
		 if ($add_p_tag=="Y"){
			 //echo $textData;
			  //$body= preg_split("#\n\#Uis",$textData);
			  $splited_file_data= preg_split("#\n#Uis",$textData);
			  $new_textData = $obj->add_Ptag($splited_file_data);
			  //echo "<pre>";
			  //print_r($new_textData);
			  //die;
			  $textData = implode("",$new_textData);
			  }
		 $k= $j+1;
		 file_put_contents($filePath.'/tirage'.$k.'.txt',$textData);
		 $totalCreatedFiles++;
		 if($totalCreatedFiles>$no_article-1)
		 {
		    break;
		  }
}
//print_r($textData); die;
$saved_file_location    =  $filePath.'/';
$all_direcotry_files = scandir($saved_file_location);

$zipFileName = time().'article.zip';

$result = $obj->create_zip_withFolder($saved_file_location, $all_direcotry_files,$zipFileName);
if($result)
{
	$downloadLink      = $zipFileLocation.'/'.$zipFileName;
    //$obj->rrmdir($_SERVER['DOCUMENT_ROOT'].'/spintaxtool/uploads');
	@chmod($downloadLink, 0777);
	$obj->send_success_mail($downloadLink);
	//echo $working_id;
	//echo $updae_fl_count 		= "UPDATE options SET flag='completed', failure_count='0' WHERE id='".$working_id."'";
	//$conn->query($updae_fl_count);
	//$delete_row			=	"DELETE FROM options WHERE flag='completed'";
	//$conn->query($delete_row);
	//echo $downloadLink;
	/*
	echo '<div align="center"><br><br>';
	echo '<a id="add_paragraph" class="button button-blue" href="'.$downloadLink.'">';
	if($language=='en'){echo 'Download'; }else{ echo 'télécharger vos articles'; };
	echo '</a>';
	echo '</div>';
	*/
}
else
{
	$obj->send_failure_mail();
}
if( $result ):
    $mess = 'Your articles have been successfully created. Click to the download button below to download your file.';
    $downloadLink = $downloadLink;
else:
    $mess = 'Sorry, An error has occurred. Please try again or contact to admin.';
    $downloadLink = false;
endif;
echo $obj->render_popup( $mess, $downloadLink ); exit();
?>