jQuery(document).ready(function () {
    var cookie = document.cookie = "Analyser_Filter";
    getCookie("Analyser_Filter");
    var c;
    function getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for(var i = 0; i <ca.length; i++) {
        c = ca[i];
        // console.log(c);
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }
    jQuery('#run-on-server').click(function(){

        if(jQuery(this).prop("checked") == true){
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
                var cookie_object = getCookie("Analyser_Filter");
                // console.log(x);
                var cookie = document.cookie = "Analyser_Filter";
                console.log(cookie);
                window.location = "http://localhost/filters-2/index.html";
            }
        });
        }

        else if(jQuery(this).prop("checked") == false){

        }

    });

    // if(c == " Analyser_Filter=valid")
    // {

    // }
    // else{
    //     window.location = "http://localhost/filters-2/login.html";
    // }
});