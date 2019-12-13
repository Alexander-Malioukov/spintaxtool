<?php
//date_default_timezone_set('Asia/Ho_Chi_Minh');
function mone_remove_old_data() {
    $rdir = $_SERVER['DOCUMENT_ROOT'].'/spintaxtool/download/';
    //var_dump($rdir); exit();
    foreach (scandir($rdir) as $folder) {
        if ($folder != '.' && $folder != '..') { 
            mone_mdestroy($rdir . $folder . '/');    
        }  
    }
    mone_directories($rdir);
}
function mone_is_dir_empty($dir) {
  if (!is_readable($dir)) return NULL; 
  return (count(scandir($dir)) == 2);
}
function mone_directories($dirname) {
    foreach (scandir($dirname) as $folder) {
        if ($folder != '.' && $folder != '..') {
            if( mone_is_dir_empty($dirname.$folder) ) {
                mone_delete_directory($dirname.$folder);
            }
        }
    }
}
function mone_delete_directory($dirname) {
         if (is_dir($dirname))
           $dir_handle = opendir($dirname);
     if (!$dir_handle)
          return false;
     while($file = readdir($dir_handle)) {
           if ($file != "." && $file != "..") {
                if (!is_dir($dirname."/".$file))
                     unlink($dirname."/".$file);
                else
                     mone_delete_directory($dirname.'/'.$file);
           }
     }
     closedir($dir_handle);
     rmdir($dirname);
     return true;
}
function mone_mdestroy($dirname) {
    if (is_dir($dirname))
           $dir_handle = opendir($dirname);
     if (!$dir_handle)
          return false;
    while($file = readdir($dir_handle)) {
        if($file != "." && $file != "..") {
            chmod($dirname.$file, 0777);          
            //if(date("U",filectime($dirname.$file) <= time() - 60 * 60 * 8) ) {
            $file_info = explode('_', $file);
            if( ! is_array( $file_info) || count( $file_info ) == 0 ) {
                $file_info = explode('article', $file);
            }
            if( is_file($dirname.$file) && is_array( $file_info ) && isset( $file_info[1] ) ) {
                $time = (int) $file_info[0];
                if ( (time()- $time ) > 60 * 60 * 48 ) {  // 86400 = 60*60*24
                    //var_dump($dirname.$file);               
                    unlink($dirname.$file);
                }   
            }
        }
    }
    closedir($dir_handle);
}
?>
