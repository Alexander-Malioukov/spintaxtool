(function($){
    if (typeof DYANCORE == "undefined") {
		DYANCORE = {};
	}; // MONELAYOUT
    
    DYANCORE.uniqId = function() { 
        return Math.round(new Date().getTime() + (Math.random() * 100)); 
    };//DYANCORE.uniqId
    
    DYANCORE.saveContent = function( form ) {
        var zip = new jszip(),
            folder_name = "contents_" + DYANCORE.uniqId();
            folder = zip.folder(folder_name),
            inputs = form.find('input[id*="hidden-paragraph-"]'),
            $data = {};
            
            $.each(inputs, function(i) {
                var File_id = ( $(this).attr('id').match(/\d+/g)[0] ) + '-' + DYANCORE.uniqId();
                if( File_id == 1 ) {
                    folder.file("content-"+ File_id + ".txt", $(this).val() );   
                }
                //$data[i] = $(this).val();
                //DYANCORE.test($(this).val());
                //$(this).val(File_id);
            });
            zip.generateAsync({type:"blob"})
            .then(function(content) {
                //fileSaver.saveAs(content, "live-art.zip");
                var $date = new Date();
                    data = new File([content], folder_name + ".zip"),
                    formData = new FormData();
                    formData.append('contents', data);
                    //formData.append('folder', folder_name);
                    //console.log( $data );
                    $.ajax({
                        data: formData,
                        url: 'save_data.php',
                        type: 'POST',
                        processData: false,
                        contentType: false,
                        dataType: "html",
                        success: function(response) {
                            if( response == folder_name ) {
                                //form.find('input[name="folder"]').val( response );
                                //DYANCORE.process(form, response);   
                            } else {
                                $('body').append(response);
                            }
                        }
                    });
            });
    };//DYANCORE.saveContent
    
    DYANCORE.saveData = function() {
        $('body').on('click','.save-art', function() {

            //$('.loading-block').addClass('open');
            $("form#db-form").submit(function(e) {
                debugger;
			     e.preventDefault();
				 $('.loading-block').addClass('open');
				 var $this = $(this);
                 DYANCORE.process($this, function() {
					console.log($this.serializeArray());//var formURL = $(this).attr("action");
					$.ajax({
					   url: 'create_text.php',
						type: 'POST',
						dataType: "html",
						data: $this.serializeArray(),
					   success: function(html) {
					       debugger;
						   $('body').append(html);
					   }
					 });
				 });
			});
			return false;    
        });
    }
    
    DYANCORE.process = function(form, callback) {
        $.ajax({
            url: 'save_data.php',
            type: 'POST',
            dataType: "html",
            data: $(form).serializeArray(),
            success: function(html) {
				$('body').append(html);
				if(typeof(callback) == 'function')
					callback();
            }
        });
    }
    
    $(document).ready(function() {
        DYANCORE.saveData();
    });
})(jQuery);