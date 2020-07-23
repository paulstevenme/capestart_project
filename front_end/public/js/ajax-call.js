jQuery(document).ready(function () {
    jQuery("#Enable-Log").on('change', function(){
        jQuery(".hidden-form-field").toggleClass("active");
    });

    jQuery("#run-on-server").on("change", function(){
        
    });
	// jQuery( ".reset-username" ).click(function() {
 //        var user_name = jQuery("#reset_username").val();
 //        var password = jQuery("#reset_password").val();
 //        var re_password = jQuery("#reset_repassword").val();

 //        var fd = new FormData();
 //        fd.append('username', user_name);
 //        fd.append('password', password);
 //        fd.append('password', re_password);

 //        $.ajax({
<<<<<<< HEAD
 //            url: 'http://192.168.1.403:5001/login',
=======
 //            url: 'http://localhost3:5001/login',
>>>>>>> 9a8392b8e79eeab31e0ce63e3d48a4126a351d25
 //            type: 'POST',
 //            data: fd
 //            success: function (data) {
 //                console.log(data);
 //            }
 //        });
 //    });
});
