jQuery(document).ready(function () {
    var user_id = 0;
    user_id = jQuery(".saved-items ul li").length;
    jQuery(".tabs li").click(function(){
        jQuery(this).siblings().removeClass('active');
        jQuery(this).addClass("active");
    }); 
    jQuery(".gadgets-tab-section ul li").click(function(){
        var class_name = jQuery(this).data("value");
        jQuery(this).siblings().removeClass("active");
        jQuery(this).addClass("active");
        jQuery("."+class_name).siblings().removeClass('active');
        jQuery("."+class_name).addClass("active");
    });
    //visualizer drag and drop
    // jQuery( ".create-dashboard .gadget-box" ).resizable();
    jQuery('.gadgets-tab-content ul li').draggable({
        revert: "invalid",
        helper: 'clone',
        multiple: 'true'
    });
    jQuery('.drop-box').droppable({
        accept: ".gadgets-tab-content ul li",
        drop: function (event, ui) {
            console.log(this);
            jQuery(this).addClass("active");
            var droppable = jQuery(this);
            var draggable = ui.draggable;
            var clone = draggable.clone();
            jQuery(this).append(clone);
            jQuery(".drop-box li i").click(function(){
                jQuery(this).parent().remove();
                var length = jQuery(".drop-box li").length;
                console.log(length);
                if(length == 0)
                {
                    jQuery(".drop-box").removeClass("active");
                }
            });
        }
    });
    jQuery(".add-gadget").click(function(){
        var length = jQuery(".drop-box li").length;
        if(length != 0)
        {
            jQuery('.drop-box li').each(function(i){
                var val = jQuery(this).children("p").text();
                var clone = jQuery("#original_box").clone();
                jQuery(".create-dashboard .row").append(clone);
                jQuery(clone).removeClass("d-none");
                jQuery(clone).removeAttr("id");
                jQuery("#add-gadgets").modal('hide');
            });
            jQuery( ".create-dashboard .gadget-box" ).resizable();
            jQuery(".basic-text").removeClass("active");
        }
        else{
            alert("Please select your Gadgets");
        }
    });
    //visualizer drag and drop
    jQuery(".search i").click(function(){
        jQuery(this).siblings(".form-control").focus();
    });
    jQuery(".add-user").click(function(){
        jQuery("#add_user form .user_name").val("");
    });
    jQuery(".next-step").click(function(){
        var class_name = jQuery(this).data("value");
        jQuery("."+class_name).siblings().removeClass('active');
        jQuery("."+class_name).addClass("active");
    });
    jQuery(".add-filter-btn").click(function(){
        jQuery(".filter-option").toggleClass("active");
    });
    jQuery(".filter-option h3 .fa-times").click(function(){
        jQuery(this).parent().parent().toggleClass("active");
    });
    jQuery(".db-list .tab").click(function(){
        jQuery(this).siblings().removeClass("active");
        jQuery(this).addClass("active");
    });
    jQuery(".option-properties .tab-section li").click(function(){
        jQuery(this).siblings().removeClass("active");
        jQuery(this).addClass("active");
        var class_name = jQuery(this).data("value");
        jQuery("."+class_name).siblings().removeClass('active');
        jQuery("."+class_name).addClass("active");
    });
    
    // jQuery('[data-toggle="tooltip"]').tooltip(); 
    jQuery("#add_user form .user-save").click(function(){
        var user_name = jQuery("#add_user form .user_name").val();
        var clone = jQuery(".saved-items ul .clone").clone();
        jQuery(clone).removeAttr("class","clone");
        jQuery(clone).children("span").text(user_name);
        jQuery(clone).attr("id","user_id"+user_id);
        if(user_id > 1)
        {
            jQuery(clone).removeAttr("class","active");
        }
        else if(user_id == 1)
        {
            jQuery(clone).attr("class","active");
        }
        jQuery(".saved-items ul").append(clone);
        jQuery('#add_user').modal('toggle');
        user_id++;
        jQuery(".saved-items ul li").click(function(){
            jQuery(this).siblings().removeClass("active");
            jQuery(this).addClass("active");
            
        });
        jQuery(".start-or-stop").click(function(){
            jQuery(".saved-items ul li .start-or-stop").removeClass("active");
            jQuery(this).toggleClass("active");
            // jQuery(this).toggleClass("active");
            var id = jQuery(this).parent().parent().attr("id");
            var name = jQuery(this).parent().siblings("span").text();
            console.log(id);
            jQuery(".canvas-save").attr("data-id",id);
            jQuery(".canvas-save").attr("data-username",name);
        });
        jQuery(".delete-user").click(function(){
            jQuery(this).parent().parent().remove();
        });
    });
    jQuery('input[type="checkbox"]:not([class="ios-switch"]),input[type="radio"]').iCheck(
    {
      checkboxClass: 'icheckbox_square-green',
      radioClass: 'iradio_square-green'
    });
    
    jQuery(".choose-filter-option").change(function(){
      var value = jQuery('.choose-filter-option option:selected').data("class");
      jQuery("."+value).siblings().removeClass("active");
      jQuery(".hidden-fields."+value).addClass("active");
      jQuery(".filter-box .header .open-modal").text(value);
    });
    jQuery(".filter-modal .ios-switch").change(function(){
      jQuery(this).parent().siblings(".hidden-objects").toggleClass("active");
    }); 
    jQuery(".add-dictionary").click(function(){
        var element = jQuery(this).siblings(".dictionary-inside-box").children(".dict").clone();
        jQuery(element).removeClass("dict");
        jQuery(element).addClass("dict-list");
        jQuery(element).appendTo(jQuery(this).siblings(".dictionary-inside-box"));
        jQuery(".dictionary i").click(function(){
            jQuery(this).parent().remove();
        });
    });
    jQuery(".add-dictionary-list").click(function(){
        var element = jQuery(this).siblings(".list-of-dictionary-inside-box").children(".list-dict").clone();
        jQuery(element).removeClass("list-dict");
        jQuery(element).addClass("copy-dict");
        jQuery(element).appendTo(jQuery(this).siblings(".list-of-dictionary-inside-box"));
        jQuery(".dictionary-box .fa-times").click(function(){
            jQuery(this).parent().remove();
        });
        jQuery(".copy-dict .add-dictionary").click(function(){
            var element = jQuery(this).siblings(".dictionary-inside-box").children(".dict").clone();
            jQuery(element).removeClass("dict");
            jQuery(element).addClass("dict-list");
            jQuery(element).appendTo(jQuery(this).siblings(".dictionary-inside-box"));
            jQuery(".dictionary i").click(function(){
                jQuery(this).parent().remove();
            });
        });
    });
    //dashboard start
        jQuery(".box-circle").each(function() {
        let i = 0,
            that = jQuery(this),
            circleBorder = that.find(".circle-border"),
            borderColor = circleBorder.data("color1"),
            animationColor = circleBorder.data("color2"),
            percentageText = that.find(".percentage"),
            percentage = percentageText.data("percentage"),
            degrees = percentage * 3.6;

        circleBorder.css({
            "background-color":  animationColor
        });

        setTimeout(function(){
            loopIt();
        },1);

        function loopIt(){
            i = i + 1

            if (i < 0) {
                i = 0;
            }

            if (i > degrees) {
                i = degrees;
            }

            percentage = i / 3.6;
            percentageText.text(percentage.toFixed(1)+" %");

            if (i <= 180){
                circleBorder.css('background-image','linear-gradient(' + (90 + i) + 'deg, transparent 50%,' + borderColor + ' 50%),linear-gradient(90deg, ' + borderColor + ' 50%, transparent 50%)');
            }
            else{
                circleBorder.css('background-image','linear-gradient(' + (i - 90) + 'deg, transparent 50%,' + animationColor + ' 50%),linear-gradient(90deg, ' + borderColor + ' 50%, transparent 50%)');
            }

            setTimeout(function(){
                loopIt();
            },1);
        }
    });
    //dashboard closed
    // jQuery('.select2').select2({
    //     tags: true,
    // });
    // jQuery("#input_modal").validate();
    // jQuery("#filter_modal").validate();
});
