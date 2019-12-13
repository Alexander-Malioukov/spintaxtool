<?php
$filePath  =  $_SERVER['DOCUMENT_ROOT'].'/spintaxtool/uploads/processing/';
include('contents_class.php');
$lib	=	new contentsClass;
if(!is_dir($filePath))
{
	mkdir($filePath, 0777, true);
}
if( ! isset( $_FILES ) || ! isset( $_POST ) ) {
    echo $lib->render_popup( 'Sorry, An error has occurred. Please try again or contact to admin.' ); exit();
}
if( isset( $_FILES ) && isset( $_FILES['content'] ) ) {
    if (isset($_FILES['articles']) && $_FILES['articles']['error'] > 0) {
        echo $lib->render_popup( 'Sorry, An error has occurred. Please try again or contact to admin.' ); exit();
    } else{
        // Upload file
        $path = $filePath . $_POST['folder'] . '_creating/';
        if(!is_dir($path)) {
        	mkdir($path, 0777, true);
        }
        if( move_uploaded_file($_FILES['content']['tmp_name'], $path . $_FILES['content']['name'] ) ) {
            $zip = new ZipArchive;
            if ($zip->open($path . $_FILES['content']['name']) === TRUE) {
                $zip->extractTo($path);
                $zip->close();
                unlink($path . $_FILES['content']['name']);
                
                echo $_POST['folder']; exit();
            } else {
                echo $lib->render_popup( 'Sorry, An error has occurred. Please try again or contact to admin.' ); exit();
            }
        } else {
            echo $lib->render_popup( 'Sorry, An error has occurred. Please try again or contact to admin.' ); exit();
        }
    }   
} elseif( isset( $_POST ) && isset( $_POST['pr_swap_from'] ) && isset( $_POST['folder'] ) && is_dir( $filePath.$_POST['folder'] . '_creating/' ) ) {
    @file_put_contents( $filePath.$_POST['folder'] . '_creating/config.json', json_encode($_POST) );
    @rename( $filePath . $_POST['folder'] . '_creating/', $filePath . $_POST['folder'] );
    echo $lib->render_popup( 'Data is being processed. You will receive an email notification when this process is complete.' ); exit();
}
echo $lib->render_popup( 'Sorry, An error has occurred. Please try again or contact to admin.' ); exit();
?>
