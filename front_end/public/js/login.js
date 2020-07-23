jQuery(document).ready(function () {
    // jQuery("#login").validate();
    jQuery( ".login-form #login_button" ).click(function() {
        var username = jQuery("#login-email").val();
        var password = jQuery("#login-password").val();
        var fd = new FormData();
        fd.append('username', username);
        fd.append('password', password);
        // fd.set('password', re_password);

        $.ajax({
            url: 'http://192.168.1.5:5001/login',
            type: 'POST',
            data: fd,
            processData: false,
            contentType: false,
            success: function (data) {
                console.log(data.status);
                console.log(data.token);
                console.log(data.username);
                createcookie('Analyser_Filter',data.status,data.token,data.username);
                createcookietoken(data.username,data.token);
                var cookie_object = getCookie("Analyser_Filter");
                // console.log(x);
                var cookie = document.cookie = "Analyser_Filter";
                console.log(cookie);
                window.location = "http://localhost/filters-2/index.html";
            }

        });
    });
    function createcookietoken(name,token ) {
        document.cookie = encodeURIComponent(name) + "="+ encodeURIComponent(token);
    }
    function createcookie(name,status,token,username ) {
        document.cookie = encodeURIComponent(name) + "=" + status +";"+ encodeURIComponent(token) +";"+ username +";";
    }
    function getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split('');
      for(var i = 0; i <ca.length; i++) {
        // console.log(ca[i]);
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }
});
