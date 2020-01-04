<?php
require_once 'config.php';
//date_default_timezone_set('Asia/Ho_Chi_Minh');
set_time_limit(0);
class CSAGPROCESS {
    /**
	 * @var The single instance of the class
	 */
	protected static $_instance = null;

	/**
	 *
	 * Ensures only one instance is loaded or can be loaded.
	 *
	 * @static
	 * @return class instance
	 */
     
     public static function instance() {

		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}

		return self::$_instance;
	}
    
    public $path;
    public $lib;
    public $del = array();
    /**
	 * Cloning is forbidden.
	 *
	 * @since 1.2
	 */
	public function __clone() {}

	/**
	 * Unserializing instances of this class is forbidden.
	 *
	 * @since 1.2
	 */
	public function __wakeup() {}
    
    public function __construct() {
        include('contents_class.php');
        $this->lib = new contentsClass;
        if (!isset($_SERVER['DOCUMENT_ROOT']) || empty($_SERVER['DOCUMENT_ROOT']) ) {
            $_SERVER['DOCUMENT_ROOT'] = __DIR__;
        }
        if (!isset($_SERVER['HTTP_HOST']) || empty($_SERVER['HTTP_HOST']) ) {
            $_SERVER['HTTP_HOST'] = 'content-spinning.pro'; //'phpstack-116171-897520.cloudwaysapps.com';
        }
        $this->path = array(
            'processing' => APP_BASE_PATH.'/uploads/processing/', //$_SERVER['DOCUMENT_ROOT'] . '/uploads/processing/',
            'download' => APP_BASE_URL.'/download/', //"http://". $_SERVER['HTTP_HOST'] . "/spintaxtool/download/",
            'upload' => APP_BASE_PATH.'/uploads/tmp/', //$_SERVER['DOCUMENT_ROOT'] . '/uploads/tmp/',
            'download_path' => APP_BASE_PATH.'/download/' //$_SERVER['DOCUMENT_ROOT'] . '/download/'
        );
    }
    
    private function processing( $total, $current ) {
        $milestones = array(10, 20, 30, 40, 50, 60, 70, 80, 90);
        if( $total < 20000 ) 
            return;
            
        foreach( $milestones as $milestone ) {
            if( $current == ( $milestone * $total / 100 ) ) {
                return $milestone;
            }
        }
        return false;
    }
    
    private function set_folder( $folder ) {
        $path = $this->path['processing'];
        if( ! is_dir( $path.$folder ) ) 
            return false;
            
        @rename( $path.$folder, $path.$folder.'_processing' );
        $this->del['old'] = $path.$folder;
        if( $data = $this->get_config_data( $path.$folder.'_processing' ) ) {
               return $data;
        }
        return false;
    }
    
    private function get_config_data( $path ) {
        $config_file = $path . '/' . 'config.json';
        if( ! is_dir( $path ) || ! is_file( $config_file ) ) 
            return false;
        
        $config = json_decode( file_get_contents( $config_file ), true );
        
        if( ! is_array( $config ) || empty( $config ) 
                || ! isset( $config['cnt_par'] ) || empty( $config['cnt_par'] ) ) 
            return false;
            
        $output = $config;
        $count = 0;
        foreach( $config['cnt_par'] as $key => $value ) {
            $file = $path . '/' . $value['p_contents'] . '.txt';
            if( is_file( $file ) ) {
                $output['cnt_par'][ $key ]['p_contents'] = file_get_contents( $file );
                $count++;   
            }
        }
        if( $count == 0 || $count < count( $config['cnt_par'] ) || empty( $output ) )
            return false;
            
        //chmod($path, 0777);
        $this->del['renamed'] = $path;
        //remove folder after get data
        
        //return all config data    
        return $output;
    }
    
    public function check() {
        $path = $this->path['processing'];
        $output = array();
        if( is_dir( $path ) ) {
            foreach (scandir($path) as $folder) {
                if ($folder != '.' && $folder != '..') {
                    $ext = explode('_', $folder);
                    if( ! isset( $ext[2] ) ) {
                        $output[] = $folder;
                    }
                }
            }   
        }
        if( ! empty( $output ) ) {
            if( $data = $this->set_folder( $output[0] ) ) {
                return $data;
            } else return false;
        }
        
        return false;
    }
    
    public function run() {
        //return;
        $data = $this->check();
        
        if( ! $data ) return;
        
        $no_article = $data['no_article'];
        $pr_swap_from = $data['pr_swap_from'];
        $pr_swap_to = $data['pr_swap_to'];
        $add_p_tag = $data['add_p_tag'];
        $title_tag_with = ( isset( $data['title_tag_with'] ) ? $data['title_tag_with'] : '' );
        $swap_paragraph_option = ( isset( $data['swap_paragraph_option'] ) ? $data['swap_paragraph_option'] : '' );
        
        $elementCountWithinParagraph    = array();
        
        foreach( $data['cnt_par'] as $value ) {
    		$elementCountWithinParagraph[]  = $this->lib->countElements( $value['p_contents'] );
    	}
        
        $fileRoot = $this->path['upload'];
        /*$filePath = $fileRoot . 'spin_'.date('Y-m-d').'/'.time();
        if( ! is_dir( $filePath ) ) {
        	mkdir($filePath, 0777, true);
        }*/
        
        $introductionArr	=	array();
        $conclusionArr		=	array();
        $bodyElementArr    =	array();
        
        foreach( $data['cnt_par'] as $value ) {
            if($value['permutation_pos'] == 'INTRO_PARAGRAPHP') {
                $introductionArr[]		=	$value;
            } else if( $value['permutation_pos']  == 'CONCLUSION_PARAGRAPH' ) {
                $conclusionArr[]		=	$value;
            } else {
                $bodyElementArr[]		=	$value;
            }
        }
        $total_intro	    = count( $introductionArr );
        $total_conclusion   = count( $conclusionArr );
        
        $totalCreatedFiles    = 0;
        $zip = new ZipArchive;
        $zip_filename = time().'_article.zip';
        $folder_download = date('Y-m-d') . '/' . $zip_filename;
        $zip_res = $zip->open($this->path['download_path'] . $folder_download, ZIPARCHIVE::CREATE);
        if ( $zip_res === TRUE ) {
            
            for( $j=0; $j <= $no_article; $j++ ) {
                //-------arrange introduction paragraph  section start -----------------------------------//   
                $introElement = '';
                if( ! empty( $introductionArr ) ) {
                    shuffle($introductionArr);   
    
        			$permutation_mode		=  $introductionArr[0]['permutation_mode']; 
        			$permutation_pos		=  $introductionArr[0]['permutation_pos']; 
        			$element_rand_from      =  $introductionArr[0]['rand_from']; 
        			$element_rand_to		=  $introductionArr[0]['rand_to']; 
        			$articleElements 		=  $introductionArr[0]['p_contents']; 
        			$htag_oper		 		=  $introductionArr[0]['h2op']; 
        			if( $htag_oper == '' ) {
                        $htag_oper = 'na';
                    }	
        			$articleElementArr = preg_split( "#\n\s*\n#Uis", $articleElements );
                    switch($permutation_mode) {
    				
        				case 'ALL_NOT_PERMUTABLE':
        					 $introElement 			.=  $this->lib->get_nonpermutable( $articleElementArr, $element_rand_from, $element_rand_to, $htag_oper );
        				break;	
        				case 'ALL_PERMUTABLE':
        					 $introElement 			.=  $this->lib->get_permutableElement( $articleElementArr, $element_rand_from, $element_rand_to, $htag_oper );
        				break;
        				case 'ALL_PERMUTABLE_EXCEPT_FIRST':
        					$introElement 			.=  $this->lib->get_permutableElementExecptFirst( $articleElementArr, $element_rand_from, $element_rand_to, $htag_oper );
        				break;
        				case 'ALL_PERMUTABLE_EXCEPT_LAST':
        					$introElement 			.=  $this->lib->get_permutableElementExecptLast( $articleElementArr, $element_rand_from, $element_rand_to, $htag_oper );
        				break;
        				case 'ALL_PERMUTABLE_EXCEPT_FIRST_LAST':
        					$introElement 			.=  $this->lib->get_permutableElementExecptFirstLast( $articleElementArr, $element_rand_from, $element_rand_to, $htag_oper );
        				break;	
        			}
                    if( $title_tag_with == 'Y' ) {
                        $introElement = preg_replace('/<h[1-6]>(.*?)<\/h[1-6]>/',"<h1>$1</h1>", $introElement);
                        $introElement = preg_replace('/[H[1-6]](.*?)[H[1-6]]/',"[H1]$1[H1]", $introElement);
                    }
                } //@end $introductionArr
                
                $elementSting = "";
                if( ! empty( $conclusionArr ) ) {
                    $elementSting			.= "\n\n";
                    shuffle($conclusionArr);   
                    
                    $permutation_mode		=  $conclusionArr[0]['permutation_mode']; 
                    $permutation_pos		=  $conclusionArr[0]['permutation_pos']; 
                    $element_rand_from      =  $conclusionArr[0]['rand_from']; 
                    $element_rand_to		=  $conclusionArr[0]['rand_to']; 
                    $articleElements 		=  $conclusionArr[0]['p_contents']; 	
                    $htag_oper		 		=  $conclusionArr[0]['h2op']; 
                    if( $htag_oper == '' ) { 
                        $htag_oper = 'na';
                    }
                    $articleElementArr	 	=  preg_split("#\n\s*\n#Uis", $articleElements);
                    switch( $permutation_mode ) {
                    case 'ALL_NOT_PERMUTABLE':
                        $elementSting 			.=  $this->lib->get_nonpermutable($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);		
                        break;
                    case 'ALL_PERMUTABLE':
                        $elementSting 			.=  $this->lib->get_permutableElement($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);
                        break;	
                    case 'ALL_PERMUTABLE_EXCEPT_FIRST':
                        $elementSting 			.=  $this->lib->get_permutableElementExecptFirst($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);
                        break;	
                    case 'ALL_PERMUTABLE_EXCEPT_LAST':
                        $elementSting 			.=  $this->lib->get_permutableElementExecptLast($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);
                        break;	
                    case 'ALL_PERMUTABLE_EXCEPT_FIRST_LAST':
                        $elementSting 		    .=  $this->lib->get_permutableElementExecptFirstLast($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);
                        break;				
                    }				
                } //@end $conclusionArr
                
                //-------get element for another paragraph of article-------------------------------	//
                
                $returnBodyElement = '';
                $p = '';	  
                
                if( ! empty( $bodyElementArr ) ) {
                    if($swap_paragraph_option==1) { //if swapping between paragraph is allowed 
                        $newbodyElementArr = $this->lib->paragraph_operation($bodyElementArr, $pr_swap_from, $pr_swap_to,  $total_intro,  $total_conclusion ); 
                    } else {
                        $newbodyElementArr = $bodyElementArr;
                    }
                    $c = 1;
                    if( ! empty( $newbodyElementArr ) ) {
                        foreach( $newbodyElementArr as  $val) {
                            trim( $p );
            				$new_p = preg_replace('/\s+/', '', $p); 
                            $new_p = trim( $new_p );
            				if( $total_intro >= 1 || $c >= 2 ) { 
            				    if( ! empty( $new_p ) ||  $total_intro >= 1 ) { 
            				        $returnBodyElement .= "\n\n";
                                }
                            }
            				$permutation_mode		=  $val['permutation_mode'];
            				$permutation_pos		=  $val['permutation_pos'];
            				$element_rand_from      =  $val['rand_from'];
            				$element_rand_to		=  $val['rand_to'];
            				$articleElements 		=  $val['p_contents'];	
            				$htag_oper		 		=  $val['h2op']; 
            				if( $htag_oper == '' ) {
            				    $htag_oper = 'na';
                            }
            				$articleElementArr = preg_split("#\n\s*\n#Uis", $articleElements);
                            
                            if( ( $title_tag_with == 'Y' ) && ( empty( $introElement ) ) ) {
            					if( $c==1 ) { 
            					   $articleElementArr  =  preg_replace('/<h[1-6]>(.*?)<\/h[1-6]>/',"<h1>$1</h1>", $articleElementArr);
            					   $articleElementArr  =  preg_replace('/[H[1-6]](.*?)[H[1-6]]/',"[H1]$1[H1]", $articleElementArr);						
            					} else { 
                					$articleElementArr = preg_replace('/<h1>(.*?)<\/h1>/',"<h2>$1</h2>", $articleElementArr);
                					$articleElementArr = preg_replace('/\[\H\1\](.*?)\[\H\1\]/',"[H2]$1[H2]", $articleElementArr); 
            					}
            				} elseif( ( $title_tag_with == 'Y' ) && ( !empty( $introElement ) ) ) {
        						$articleElementArr = preg_replace('/<h1>(.*?)<\/h1>/',"<h2>$1</h2>", $articleElementArr);
        						$articleElementArr = preg_replace('/\[\H\1\](.*?)\[\H\1\]/',"[H2]$1[H2]", $articleElementArr);
            				}
                            switch( $permutation_mode ) {					
            					case 'ALL_NOT_PERMUTABLE':
            						$returnBodyElement 			.=  $p = $this->lib->get_nonpermutable($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);						
            					break;
            					case 'ALL_PERMUTABLE':
            						$returnBodyElement 			.=  $p = $this->lib->get_permutableElement($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);
            					break;
            					case 'ALL_PERMUTABLE_EXCEPT_FIRST':
            						$returnBodyElement 			.=  $p = $this->lib->get_permutableElementExecptFirst($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);
            					break;
            					case 'ALL_PERMUTABLE_EXCEPT_LAST':
            					   $returnBodyElement 			.=  $p = $this->lib->get_permutableElementExecptLast($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);
            					break;
            					case 'ALL_PERMUTABLE_EXCEPT_FIRST_LAST':
            					  $returnBodyElement 		.=  $p = $this->lib->get_permutableElementExecptFirstLast($articleElementArr,$element_rand_from,$element_rand_to,$htag_oper);
            					break;		
            				}
                            $c++;
                        }//@end foreach - $newbodyElementArr
                    } //@end $newbodyElementArr
                } //@end $bodyElementArr
                
                if( $title_tag_with == 'Y' ) {
                    $introElement    = preg_replace('/<h[1-6]>(.*?)<\/h[1-6]>/',"<h1>$1</h1>", $introElement);
                    $introElement    = preg_replace('/[H[1-6]](.*?)[H[1-6]]/',"[H1]$1[H1]", $introElement);
                }		
                	   
                @$textData = $introElement;		 
                $textData .= $returnBodyElement;
                $conclusionElement  = preg_replace('/<h1>(.*?)<\/h1>/',"<h2>$1</h2>", $elementSting);
                $conclusionElement  = preg_replace('/\[\H\1\](.*?)\[\H\1\]/',"[H2]$1[H2]", $elementSting);
                $textData          .= $conclusionElement;
                if( $add_p_tag == "Y" ) {
                    $splited_file_data = preg_split("#\n#Uis",$textData);
                    $new_textData = $this->lib->add_Ptag($splited_file_data);
                    $textData = implode("",$new_textData);
                }
                $k= $j+1;
                //file_put_contents( $filePath.'/tirage'.$k.'.txt', $textData);
                $zip->addFromString('tirage'.$k.'.txt', $textData);
                $totalCreatedFiles++;
                if( $totalCreatedFiles > ( $no_article - 1 ) )
                    break;
            } //@end main for loop
            
            /*$saved_file_location = $filePath.'/';
            $all_direcotry_files = scandir( $saved_file_location );
            $zipFileName = time().'article.zip';
            $result = $this->lib->create_zip_withFolder( $saved_file_location, $all_direcotry_files, $zipFileName );*/
            $zip->close();
            $downloadLink      = $this->path['download'] . $folder_download; //$folder_download
            @chmod($downloadLink, 0777);
            //$this->lib->rrmdir( $filePath, true );
            @rename( $this->del['renamed'], $this->del['old'].'_done' );
            $this->lib->send_success_mail($downloadLink);
        } else { //@end zip 
            $this->lib->send_failure_mail();
        }
    } //@end start()
}
function CSAGPROCESS() {
    return CSAGPROCESS::instance();
}
CSAGPROCESS()->run();