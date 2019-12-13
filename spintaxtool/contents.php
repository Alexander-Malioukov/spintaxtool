<?php 
class spinContents {

   function get_possibleCount($cnt_paragraph)
   {
	  $num    = count($cnt_paragraph);
	  $fact   = 1;
	  for($i=$num;$i>=1;$i--)
	  {
		 $fact   = $fact * $i;
	  }
	  return $fact;
	}
	
 function get_spinContent($data_arr,$method=''){
   if($method==1)
   {
      $data   = $this->getAllCombos($data_arr);
   }
   else if($method==2)
   {	 
    
     $data   = $this->uniqueCombination($data_arr);
   }  
   
   return $data;
 }
 
 function getAllCombos($arr) {
    $combinations = array();
    $words = sizeof($arr);
    $combos = 1;
    for($i = $words; $i > 0; $i--) {
        $combos *= $i;
    }
    while(sizeof($combinations) < $combos) {
        shuffle($arr);
        $combo = implode(" ", $arr);
        if(!in_array($combo, $combinations)) {
            $combinations[] = $combo;
        }
    }
    $marge_arr = array_merge($arr,$combinations);
    for($i=0; $i<count($marge_arr);$i++)
    {
	   $final_result[$i][] .= $marge_arr[$i];
	}
	
	//echo '<pre>';print_r($final_result);
	// die;
    return $final_result;
}

function uniqueCombination($data, $minLength = 1, $max = 2000) {
    $count = count($data);
    $members = pow(2, $count);
    $return = array();
    for($i = 0; $i < $members; $i ++) {
        $b = sprintf("%0" . $count . "b", $i); 
        $out = array();
        for($j = 0; $j < $count; $j ++) {
            $b{$j} == '1' and $out[] = $data[$j];
            if($i!==0)
            $b{$j} == '0' and $out[]['remain'] = $data[$j];
            
        }
        count($out) >= $minLength && count($out) <= $max and $return[] = $out;
        }
   //  echo '<pre>';print_r($return); die;  
    return $return;
}

}
 
 ?>
 


