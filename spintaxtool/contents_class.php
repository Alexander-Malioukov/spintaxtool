<?php
 class contentsClass {

    public function countElements($article)
    {
		$articleArr			=	preg_split("#\n\s*\n#Uis", $article);
		return count($articleArr);
	}

    function delete_directory($dirname) {
         if (is_dir($dirname))
           $dir_handle = opendir($dirname);
         if (!$dir_handle)
              return false;
         while($file = readdir($dir_handle)) {
               if ($file != "." && $file != "..") {
                    if (!is_dir($dirname."/".$file))
                         unlink($dirname."/".$file);
                    else
                         $this->delete_directory($dirname.'/'.$file);
               }
         }
         closedir($dir_handle);
         rmdir($dirname);
         return true;
    }

    function rrmdir($src, $del_folder = false) {
        $dir = opendir($src);
        while(false !== ( $file = readdir($dir)) ) {
            if (( $file != '.' ) && ( $file != '..' )) {
                $full = $src . '/' . $file;
                if ( is_dir($full) ) {
                    $this->delete_directory($full);
                }
                else {
                    unlink($full);
                }
            }
        }
        closedir($dir);
        if( $del_folder ) {
            rmdir($src);
        }
        return true;
    }

    public function convert_content( $data, $folder ) {
        $fileUploadPath   =   $_SERVER['DOCUMENT_ROOT'].'spintaxtool/uploads/processing/' . $folder;
        if( !is_dir($fileUploadPath) ) return false;

        $output = $data;
        foreach( $data as $key => $value ) {
            $output[$key]['p_contents'] = file_get_contents($fileUploadPath .'/'.$value['p_contents'].'.txt');
        }
        $this->rrmdir( $fileUploadPath, true );
        return $output;
    }


    public function render_popup( $mess, $link = false ) {
        $html = '<div class="popup">';
            $html .= '<div class="wrap">';
            $html .= '<div class="text">'.$mess.'</div>';
            $html .= '<div class="buttons">';
                $html .= '<a class="cancel" href="/spintaxtool/generatespin.php">back to home</a>';
                if( $link ):
                    $html .= '<a class="download" href="'.$link.'">download</a>';
                else:
                    $html .= '<a class="download" href="/spintaxtool/generatespin.php">cancel</a>';
                endif;
                $html .= '</div>';
            $html .= '</div>';
        $html .= '</div>';
        return $html;
    }

	public function get_rendomElement($articleElementArr, $other='')
	{
		$result = array();
	   $element      =	'';
	   $count_sentence=0;
	   $rendom_data_array= array();
	   //print_r($articleElementArr); die;
	  // print_r($articleElementArr);
	   if(!empty($articleElementArr)){
		   foreach($articleElementArr as $elements){
			  $result[$count_sentence]=array();
			 //echo '<pre>'; print_r($elements); die;
			  //check if element has h tag then break it h tag otherwise from dot
			  //$elmtPtrn = "/<h[1-6]>(.*?)<\/h[1-6]>/";
			  //preg_match($elmtPtrn, $elements, $pmatches0);
			  //if(!empty($pmatches0)){$break_from="/<h[1-6]>(.*?)<\/h[1-6]>/";}else{$break_from="#\n\s*\n#Uis";}


			  //preg_match_all($break_from,$elements,$sentences);
			$sentences[0]    =  preg_split('/\r\n|\r|\n/', $elements);
			//print_r($sentences);
			//preg_match_all($break_from,$elements,$sentences);
			  //print_r($sentences);
			  shuffle($sentences);
			  if(empty($sentences[0])){$sentences[0][0]=$elements; }
			  shuffle($sentences[0]);
			   $result[$count_sentence] = $sentences;
			    $count_sentence++;
		   }
		//echo "<pre>";print_r($articleElementArr); die;
		 $count_sentence=0;
		 foreach($articleElementArr as $elements){

			  $finalArr = array_filter($result[$count_sentence][0]);
			 // echo '<pre>';print_r($finalArr );
			 $position=0;
			 if(empty($finalArr[$position])){$position=1;}
			 @$rendom_data_array[$count_sentence]  .= $finalArr[$position];
			  $element      .= trim($finalArr[$position]);
			  $element     .=' ';
			 $elmtPattern1 = "/<h[1-6]>(.*?)<\/h[1-6]>/";
			  preg_match($elmtPattern1, $finalArr[$position], $pmatches);
			  if(!empty($pmatches)){
				   $element  .= "\n";  //it is working for testing purpose. it will change once we are done.
				}
			 $count_sentence++;
		}

	   }
	   //echo "<pre>"; print_r($rendom_data_array); die;
	   if($other=='true'){return $rendom_data_array; }else{	return $element; }
	}

	/*Function for operation on h2 tag*/
	public function operate_htag($elmar,$h_parm='na')
	{
		$elmtPattern1 = "/<h[2]>(.*?)<\/h[2]>/";
			 $elmtPattern2 = "/[H[2]](.*?)[H[2]]/";
			  preg_match($elmtPattern1, $elmar, $pmatches);
			  preg_match($elmtPattern2, $elmar, $pmatches1);
			 if(!empty($pmatches) || !empty($pmatches1)){
			  switch($h_parm) {
				case 'na':
				//remove h2 tag
				na:{
					 $elmar 	=  '';
				break;
				}
				case 'prmnent':
				prmnent:{
				//do nothing
				break;
				}
				case 'rndm':
					if(rand(0,1)){
						//keep h2 tag
						goto prmnent;
						}else{
						goto na;
						}
				break;

			}// switch ends here
		} //if ends here
		return $elmar;
	}

	   public function get_nonpermutable($articleElementArr,$element_rand_from,$element_rand_to,$h_parm='na')
   {
	    $element      =	'';
	    $get_rendom_data_array	=	$this->get_rendomElement($articleElementArr, $other='true'); //Get all possible outocomes element wise in array

	    $final_array_data	=	$this->generateRandomParagraph($get_rendom_data_array,$element_rand_from,$element_rand_to, $other=''); //swap elements
		 $count_sentence=0;
		foreach($final_array_data as $elements){
			 $hfilter =  trim($this->operate_htag($final_array_data[$count_sentence],$h_parm));
		 $element      .=trim($hfilter);
		 //$element      .=trim($final_array_data[$count_sentence]);
		 if(!empty($element)){$element     .=' ';}
			 $elmtPattern1 = "/<h[1-6]>(.*?)<\/h[1-6]>/";
			 $elmtPattern2 = "/[H[1-6]](.*?)[H[1-6]]/";
			 $elmtPattern3 = "/<h2#>(.*?)<\/h2#>/";
			  preg_match($elmtPattern1, $final_array_data[$count_sentence], $pmatches);
			  preg_match($elmtPattern2, $final_array_data[$count_sentence], $pmatches1);
			  preg_match($elmtPattern3, $final_array_data[$count_sentence], $pmatches2);
			  if(!empty($pmatches) || !empty($pmatches1) || !empty($pmatches2) ){
				  if(!empty($hfilter)){
				   $element  .= "\n";  //it is working for testing purpose. it will change once we are done.
			   }
				}
			 $count_sentence++;
		}

	  return $element;

   }

   public function get_permutableElement($articleElementArr,$element_rand_from,$element_rand_to,$h_parm='na')
   {
	    $element      =	'';
	    $get_rendom_data_array	=	$this->get_rendomElement($articleElementArr, $other='true'); //Get all possible outocomes element wise in array

	   $final_array_data	=	$this->generateRandomParagraph($get_rendom_data_array,$element_rand_from,$element_rand_to, $other='true'); //swap elements
		 $count_sentence=0;
		foreach($final_array_data as $elements){
			 $hfilter =  trim($this->operate_htag($final_array_data[$count_sentence],$h_parm));
		 $element      .=trim($hfilter);
		 //$element      .=trim($final_array_data[$count_sentence]);
			if(!empty($element)){$element     .=' ';}
			$elmtPattern1 = "/<h[1-6]>(.*?)<\/h[1-6]>/";
			 $elmtPattern2 = "/[H[1-6]](.*?)[H[1-6]]/";
			 $elmtPattern3 = "/<h2#>(.*?)<\/h2#>/";
			  preg_match($elmtPattern1, $final_array_data[$count_sentence], $pmatches);
			  preg_match($elmtPattern2, $final_array_data[$count_sentence], $pmatches1);
			  preg_match($elmtPattern3, $final_array_data[$count_sentence], $pmatches2);
			  if(!empty($pmatches) || !empty($pmatches1) || !empty($pmatches2) ){
				  if(!empty($hfilter)){
				   $element  .= "\n";  //it is working for testing purpose. it will change once we are done.
			   }
				}
			 $count_sentence++;
		}
	  return $element;

   }

   public function get_permutableElementExecptFirst($articleElementArr,$element_rand_from,$element_rand_to,$h_parm='na')
   {
		 $element      =	'';
	    $get_rendom_data_array	=	$this->get_rendomElement($articleElementArr, $other='true'); //Get all possible outocomes element wise in array
	    $final_array_data	=	$this->generateRandomParagraph($get_rendom_data_array,$element_rand_from,$element_rand_to, $other='first'); //swap elements
		 $count_sentence=0;
		foreach($final_array_data as $elements){
			 $hfilter =  trim($this->operate_htag($final_array_data[$count_sentence],$h_parm));
		 $element      .=trim($hfilter);
		 //$element      .=trim($final_array_data[$count_sentence]);
			if(!empty($element)){$element     .=' ';}
			  $elmtPattern1 = "/<h[1-6]>(.*?)<\/h[1-6]>/";
			 $elmtPattern2 = "/[H[1-6]](.*?)[H[1-6]]/";
			 $elmtPattern3 = "/<h2#>(.*?)<\/h2#>/";
			  preg_match($elmtPattern1, $final_array_data[$count_sentence], $pmatches);
			  preg_match($elmtPattern2, $final_array_data[$count_sentence], $pmatches1);
			  preg_match($elmtPattern3, $final_array_data[$count_sentence], $pmatches2);
			  if(!empty($pmatches) || !empty($pmatches1) || !empty($pmatches2) ){
				  if(!empty($hfilter)){
				   $element  .= "\n";  //it is working for testing purpose. it will change once we are done.
			   }
				}
			 $count_sentence++;
		}
	  return $element;

   }

   public function get_permutableElementExecptLast($articleElementArr,$element_rand_from,$element_rand_to,$h_parm='na')
   {

		 $element      =	'';
	    $get_rendom_data_array	=	$this->get_rendomElement($articleElementArr, $other='true'); //Get all possible outocomes element wise in array
	    $final_array_data	=	$this->generateRandomParagraph($get_rendom_data_array,$element_rand_from,$element_rand_to, $other='last'); //swap elements
		 $count_sentence=0;
		 foreach($final_array_data as $elements){
			 $hfilter =  trim($this->operate_htag($final_array_data[$count_sentence],$h_parm));
		 $element      .=trim($hfilter);
		 //$element      .=trim($final_array_data[$count_sentence]);
			if(!empty($element)){$element     .=' ';}
			  $elmtPattern1 = "/<h[1-6]>(.*?)<\/h[1-6]>/";
			 $elmtPattern2 = "/[H[1-6]](.*?)[H[1-6]]/";
			 $elmtPattern3 = "/<h2#>(.*?)<\/h2#>/";
			  preg_match($elmtPattern1, $final_array_data[$count_sentence], $pmatches);
			  preg_match($elmtPattern2, $final_array_data[$count_sentence], $pmatches1);
			  preg_match($elmtPattern3, $final_array_data[$count_sentence], $pmatches2);
			  if(!empty($pmatches) || !empty($pmatches1) || !empty($pmatches2) ){
				  if(!empty($hfilter)){
				   $element  .= "\n";  //it is working for testing purpose. it will change once we are done.
			   }
				}
			 $count_sentence++;
		}
	  return $element;
   }


   public function get_permutableElementExecptFirstLast($articleElementArr,$element_rand_from,$element_rand_to,$h_parm='na')
   {
		 $element      =	'';
	    $get_rendom_data_array	=	$this->get_rendomElement($articleElementArr, $other='true'); //Get all possible outocomes element wise in array
	    $final_array_data	=	$this->generateRandomParagraph($get_rendom_data_array,$element_rand_from,$element_rand_to, $other='flast'); //swap elements
		 $count_sentence=0;
		 foreach($final_array_data as $elements){
			 $hfilter =  trim($this->operate_htag($final_array_data[$count_sentence],$h_parm));
		 $element      .=trim($hfilter);
		 //$element      .=trim($final_array_data[$count_sentence]);
			if(!empty($element)){$element     .=' ';}
			 $elmtPattern1 = "/<h[1-6]>(.*?)<\/h[1-6]>/";
			 $elmtPattern2 = "/[H[1-6]](.*?)[H[1-6]]/";
			 $elmtPattern3 = "/<h2#>(.*?)<\/h2#>/";
			  preg_match($elmtPattern1, $final_array_data[$count_sentence], $pmatches);
			  preg_match($elmtPattern2, $final_array_data[$count_sentence], $pmatches1);
			  preg_match($elmtPattern3, $final_array_data[$count_sentence], $pmatches2);
			  if(!empty($pmatches) || !empty($pmatches1) || !empty($pmatches2) ){
				  if(!empty($hfilter)){
				   $element  .= "\n";  //it is working for testing purpose. it will change once we are done.
			   }
				}
			 $count_sentence++;
		}
	  return $element;
   }

   public function allPossibleCombination($data, $minLength = 1, $max = 2000) {
    $count = count($data);
    $members = pow(2, $count);
    $return = array();
    for($i = 0; $i < $members; $i ++) {

        $b = sprintf("%0" . $count . "b", $i);
        $out = array();
        $arrKey      =  '';
		$arrKey2     =  '';
        for($j = 0; $j < $count; $j ++) {
            $b{$j} == '1' and $out[] = $data[$j];
            if($i!==0)
            {
				$b{$j} == '0' and $out[]['remain'] = $data[$j];
			}

        }

        count($out) >= $minLength && count($out) <= $max and $return[] = $out;
        if($i>10000)
        {
		   break;
		}
    }
    return $return;
}

	public function generateElement($dataArr)
	{
	   $stringsHtml      =   '';
	   foreach($dataArr as $elval) {

				if(is_array($elval))
				{
				    $stringsHtml      .=  $elval['remain']."<br>";
				}
				else
				{
					$stringsHtml      .=  $elval;
				}

	  }

	  return $stringsHtml;
	}

//-------Swap paragraphs----------------------//
	public function generateRandomParagraph($bodyElementArr,$p_from,$p_to,$other='')
	{
		$from=$p_from;
		$to= $p_to;
		 $diff= $to-$from;
		//if($diff > 1){$to= $p_to-1;}	;
		if($other=='first'){
			$e_from=2;
			$e_to=count($bodyElementArr);
		} elseif($other=='last'){
			$e_from=1;
			$e_to=count($bodyElementArr)-1;
		} elseif($other=='flast'){
			$e_from=2;
			$e_to=count($bodyElementArr)-1;
		} elseif($other=='true'){
			$e_from=1;
			$e_to=count($bodyElementArr);
		} else{
			$e_from=1;
			$e_to=count($bodyElementArr);
			};

	   $finalParagrapArr  =  array();
	   $topParagrapArr	  =  array();
	   $swappablePar	  =	 array();
	   $bottomParagrapArr =  array();
	   $new_swappablePar  =	 array();
	   $tot_para		  =  count($bodyElementArr);
	   $range		=	range($p_from,$p_to);
	  if($other=='first' || $other=='flast')
	  {
				@$topParagrapArr[]	= $bodyElementArr[0];
      }
     //echo $to	=	(rand($p_from-1,$p_to));
      for($i=$e_from-1; $i<$e_to; $i++)
      {
		  @$swappablePar[]		=	$bodyElementArr[$i];
	  }
	  if(!empty($other)){ shuffle($swappablePar); }
		  $upto	=rand ($from,$to);
		  for($i=0; $i<$upto; $i++){
			  @$new_swappablePar[] = $swappablePar[$i];
			  }
	  $lastEleStCnt  =    $tot_para - $e_to;

	  if($other=='last' || $other=='flast')
	  {
			$bottomParagrapArr[]     =  $bodyElementArr[$tot_para-1];
	  }
	 if(!empty($topParagrapArr)){$finalParagrapArr        =   array_merge($topParagrapArr,$new_swappablePar);
	}else{
		$finalParagrapArr        =   $new_swappablePar;
		}
	 if(!empty($bottomParagrapArr)){$finalParagrapArr        =   array_merge($finalParagrapArr,$bottomParagrapArr);}
	 return $finalParagrapArr;

	}

//-------- Create Zip Formate for Downloading-------------------------------------//

	public function create_zip_withFolder($folder='', $files = array(),$destination = '',$overwrite = false) {
        $zipFileLocation   = __DIR__ . '/download/'.date('Y-m-d');

		if(!is_dir($zipFileLocation))
		{
			mkdir($zipFileLocation, 0777, true);
		}
		 $destination   = $zipFileLocation.'/'.$destination;
		if(file_exists($destination) && !$overwrite) { return false; }
		$valid_files = array();
		if(is_array($files)) {
			foreach($files as $file) {
				if(strlen($folder)>1)
				{
					if(file_exists($folder.$file)) {
					$valid_files[] = $file;
					}
				}
				else
				{
					if(file_exists($file)) {
					$valid_files[] = $file;
					}
				}
			}
		}

		if(count($valid_files)) {
			$zip = new ZipArchive();
			if($zip->open($destination,$overwrite ? ZIPARCHIVE::OVERWRITE : ZIPARCHIVE::CREATE) !== true) {
				return false;
			}
			foreach($valid_files as $file) {
				if(strlen($file)>2)
				{
					$zip->addFile($folder.$file,$file);
				}
			}
			$zip->close();
			return file_exists($destination);
		}
		else
		{
			return false;
		}
	}

	public function paragraph_operation($bodyElementArr, $pr_swap_from, $pr_swap_to, $intro_array, $conclusion_array) {
		$finalParagrapArr  =array();
		$count=0;
		if($intro_array!=0){$count++;};
		if($conclusion_array!=0){$count++;};
		$max = $pr_swap_to-$count;
		shuffle($bodyElementArr);
		$range=range($pr_swap_from,$pr_swap_to);
		shuffle($range);

		if($range[0]!=$count){
		$rn  = $range[0] - $count;

		//$loop_no = rand(0,$range[0]);
		//print_r($loop_no);die;
		for($a=0; $a<=$rn-1 ; $a++){

			if(!empty($bodyElementArr[$a])){
				$finalParagrapArr[]=$bodyElementArr[$a];
							}
		}
	}

	 return $finalParagrapArr;
	}

	/*
	 * Get rendom number of elements from X to Y elements
	 * as given by the user in fields
	 */
	public function add_Ptag($splited_file_data) {
		$cnt = 0;
		$total_para= count($splited_file_data);
		foreach($splited_file_data as $para){
			$newDataWithTag[$cnt] = '';
			$match 				  = preg_match("/<[^<]+>/",$para,$m);
			if(!empty($para) &&  $match == 0){
				$newDataWithTag[$cnt]		=	 '<p>'.$para.'</p>';
				if($cnt < $total_para-1)
				$newDataWithTag[$cnt]		.=	 "\n\n";
			}elseif(!empty($para) && $match != 0){
				$newDataWithTag[$cnt] 		= $para;
				$newDataWithTag[$cnt]		.=	 "\n";
			}else{
				$newDataWithTag[$cnt] = $para;
			}
			$cnt++;
		}
		return $newDataWithTag;
	}

	public function send_success_mail($download_link = '', $custom = false){
        if( $download_link ) {
            $mess = "<p>Your file is ready. Please <a href='".$download_link."'> click here </a> to download the file.</p>";
        } elseif( $custom ) {
            $mess = $custom;
        } else {
            $mess = '';
        }
		$to = "webninjastest@gmail.com,florence.levot@radianceconseil.com";//florence.levot@radianceconseil.com
		$subject = "Spintax Notification";
		$message = "
		<html>
		<head>
		<title>HTML email</title>
		</head>
		<body>
		".$mess."
		</body>
		</html>";

		// Always set content-type when sending HTML email ,florence.levot@radianceconseil.com
		$headers = "MIME-Version: 1.0" . "\r\n";
		$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

		// More headers
		$headers .= 'From: <noreply@content-spinning.pro>' . "\r\n";

		mail($to,$subject,$message,$headers);

		}
	public function send_failure_mail($download_link = ''){
		$to = "webninjastest@gmail.com,florence.levot@radianceconseil.com";
		$subject = "Spintax Notification";
		$message = "
		<html>
		<head>
		<title>HTML email</title>
		</head>
		<body>
		<p>Due to some problem. We were not able to generate files. We will try again after 10mins.</p> " . $download_link ."
		</body>
		</html>
		";

		// Always set content-type when sending HTML email
		$headers = "MIME-Version: 1.0" . "\r\n";
		$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

		// More headers
		$headers .= 'From: <noreply@content-spinning.pro>' . "\r\n";

		mail($to,$subject,$message,$headers);
		}

 }

?>
