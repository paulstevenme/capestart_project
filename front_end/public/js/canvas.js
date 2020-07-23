jsPlumb.ready(function () {
    // setup some defaults for jsPlumb.
    var instance = jsPlumb.getInstance({
        Endpoint: ["Dot", {radius: 4}],
        Connector:"StateMachine",
        HoverPaintStyle: {stroke: "#1e8151", strokeWidth: 4 },
        ConnectionOverlays: [
            [ "Arrow", {
                location: 1,
                id: "arrow",
                length: 14,
            } ]
            //[ "Label", { label: "FOO", id: "label", cssClass: "aLabel" }]
        ],
        Container: "canvas"
    });

    instance.registerConnectionType("basic", { anchor:"Continuous", connector:"StateMachine" });

    window.jsp = instance;

    var canvas = document.getElementById("canvas");
    var windows = jsPlumb.getSelector(".statemachine-demo .w");
    // bind a click listener to each connection; the connection is deleted. you could of course
    // just do this: instance.bind("click", instance.deleteConnection), but I wanted to make it clear what was
    // happening.
    instance.bind("click", function (c) {
        instance.deleteConnection(c);
    });
    // jsPlumb.bind("beforeDrop", function(connection) {
    //     return connection.sourceId !== connection.targetId;
    // });

    // bind a connection listener. note that the parameter passed to this function contains more than
    // just the new connection - see the documentation for a full list of what is included in 'info'.
    // this listener sets the connection's internal
    // id as the label overlay's text.

    var connection_array = new Array();
    instance.bind("connection", function (info) {
        console.log(info);
        connection_array.push(info);
        var con_id = info.connection.id;
        var con=info.connection;
        var source_id = info.source.id;
        var target_id = info.target.id;
        var source_val = jQuery("#"+source_id).attr("data-value");
        var target_val = jQuery("#"+target_id).attr("data-value");
        if(source_val=="input")
        {
            if(target_val=="output")
            {
                console.log("false");
                console.log(source_id);
                jQuery('.jtk-endpoint[elid="'+source_id+'"] + svg').remove();
                jQuery('.jtk-endpoint[elid="'+source_id+'"]').nextAll().remove();
            }
        }
        else if(source_val=="filter")
        {
            if(target_val=="input")
            {
                jQuery('.jtk-endpoint[elid="'+source_id+'"] + svg').remove();
                jQuery('.jtk-endpoint[elid="'+source_id+'"]').nextAll().remove();
            }
        }

        jQuery("#"+source_id+" .header .icon-box .close-node").attr("data-source_id",source_id);
        jQuery("#"+source_id+" .header .icon-box .close-node").attr("data-target_id",target_id);
        jQuery("#"+target_id+" .header .icon-box .close-node").attr("data-source_id",source_id);
        jQuery("#"+target_id+" .header .icon-box .close-node").attr("data-target_id",target_id);
        jQuery("#"+source_id+" .header .icon-box .close-node").attr("data-sourcecon",con_id);
        jQuery("#"+target_id+" .header .icon-box .close-node").attr("data-targetcon",con_id);
        // info.connection.getOverlay("label").setLabel(info.connection.id);
        // console.log(connection_array);
    });
    // bind a double click listener to "canvas"; add new node when this occurs.
    // jsPlumb.on(canvas, "dblclick", function(e) {
    //     newNode(e.offsetX, e.offsetY);
    // });
    var input_x = 150;
    var input_y = 150;
    jsPlumb.on(".add-input", "click", function(e) { 
        newinputNode(input_x, input_y);
        input_x = input_x + 10;
        input_y = input_y + 10;
    });
    var filter_x = 450;
    var filter_y = 150;
    jsPlumb.on(".add-filter", "click", function(e) {
        newfilterNode(filter_x, filter_y);
        filter_x = filter_x + 10;
        filter_y = filter_y + 10;
    });
    var output_x = 750;
    var output_y = 150;
    jsPlumb.on(".add-output", "click", function(e) {
        newoutputNode(output_x, output_y);
        output_x = output_x + 10;
        output_y = output_y + 10;
    });
    //
    // initialise element as connection targets and source.
    //
    var initNode = function(el) {

        // initialise draggable elements.
        // console.log(el);
        instance.draggable(el);

        instance.makeSource(el, {
            filter: ".input",
            anchor: "Right",
            connectorStyle: { stroke: "#5c96bc", strokeWidth: 3, outlineStroke: "transparent", outlineWidth: 6 },
            connectionType:"basic",
            extract:{
                "action":"the-action"
            },
            maxConnections: 1,
            onMaxConnections: function (info, e) {
                alert("Maximum connections (" + info.maxConnections + ") reached");
            }
        });
        instance.makeSource(el, {
            filter: ".filter-1",
            anchor: "Right",
            connectorStyle: { stroke: "#5c96bc", strokeWidth: 3, outlineStroke: "transparent", outlineWidth: 6 },
            connectionType:"basic",
            extract:{
                "action":"the-action"
            },
            maxConnections: 1,
            onMaxConnections: function (info, e) {
                alert("Maximum connections (" + info.maxConnections + ") reached");
            }
        });
        // instance.makeSource(el, {
        //     filter: ".filter-2",
        //     anchor: "Right",
        //     connectorStyle: { stroke: "#5c96bc", strokeWidth: 3, outlineStroke: "transparent", outlineWidth: 6 },
        //     connectionType:"basic",
        //     extract:{
        //         "action":"the-action"
        //     },
        //     maxConnections: 2,
        //     onMaxConnections: function (info, e) {
        //         alert("Maximum connections (" + info.maxConnections + ") reached");
        //     }
        // });
        instance.makeTarget(el, {
            filter: ".output",
            maxConnections: 2,
            uniqueEndpoint:true,
            deleteEndpointsOnDetach:false,
            onMaxConnections: function (info, e) {
                alert("Maximum connections (" + info.maxConnections + ") reached");
            }
        });

        instance.makeTarget(el, {
            dropOptions: { hoverClass: "dragHover" },
            anchor: "Continuous",
            allowLoopback: true
        });

        // this is not part of the core demo functionality; it is a means for the Toolkit edition's wrapped
        // version of this demo to find out about new nodes being added.
        //
        instance.fire("jsPlumbDemoNodeAdded", el);
    };
    var inputcount=0;
    var filtercount=0;
    var outputcount=0;
    //create new INput Node
    var newinputNode = function(x, y) {
        
        var d = document.createElement("div");
        var id = "input_box"+inputcount;
        // d.attr("data-value") ="input";
        var modal_id = "input_box"+inputcount+"modal";
        d.className = "w content-box input-box";
        d.id = id;
        d.innerHTML = "<div class='header'><a class='open-modal'>Input</a><div class='icon-box'><a class='open-modal-form' data-toggle='modal' data-target='#"+modal_id+"'><i class='fa fa-cog'></i></a><a class='close-node'><i class='fa fa-trash'></i></a></div> </div><div class=\"ep input\"></div><div class='content-body'></div>";
        d.style.left = x + "px";
        d.style.top = y + "px";
        instance.getContainer().appendChild(d);
        initNode(d);
        jQuery("#"+id).attr("data-value","input");
        //clone the Input Form Modal
        var clone = jQuery("#input").clone();
        jQuery(clone).removeAttr("id");
        jQuery(clone).attr("id",modal_id);
        jQuery(".filter-project").append(clone);

        //add data in inpu form save button
        jQuery("#"+modal_id+" .input-form-modal .choose-input-option").attr("data-value",id);
        jQuery("#"+modal_id+" .input-form-modal .choose-input-option").attr("data-modal",modal_id);
        jQuery("#"+modal_id+" .input-form-modal .input-form-save").attr("data-value",id);
        jQuery("#"+modal_id+" .input-form-modal .input-form-save").attr("data-modal",modal_id);

        //close node
        jQuery(".close-node").click(function(){
            var close_modal_id = jQuery(this).parent().parent().parent().attr("id");

            jQuery('.jtk-endpoint[elid="'+close_modal_id+'"] + svg').remove();
            jQuery('.jtk-endpoint[elid="'+close_modal_id+'"]').remove();
            // var target_con_id = jQuery(this).data("targetcon");
            var source_con_id = jQuery(this).data("sourcecon");
            jQuery('.jtk-endpoint[elid="'+source_con_id+'"] + svg').remove();
            jQuery('.jtk-endpoint[elid="'+source_con_id+'"]').remove();
            // var target_con = jQuery(this).data("targetcon");
            // var source_con = jQuery(this).data("sourcecon");
            var remove_con = jQuery(this).data("sourcecon");
            var remove_con2 = jQuery(this).data("targetcon");
            // jsPlumb.remove("input_box0");

            console.log(remove_con);
            console.log(remove_con2);
            // for(var i=0; i<connection_array.length;i++)
            // {
            //     if(connection_array[i].connection.id==remove_con||connection_array[i].connection.id==remove_con2)
            //     {
            //         // console.log(connection_array[i].connection.id);
            //         // console.log(connection_array[i]);
            //         // console.log(connection_array[i].connection.endpoints);
            //         // instance.deleteConnection(connection_array[i]);
            //         jsPlumb.remove(connection_array[i]);
            //     }
            // }
            jQuery("#"+close_modal_id+"modal").remove();
            jQuery(this).parent().parent().parent().remove();
            // if(remove_con==c)
            // instance.deleteConnection(c);
            // jQuery('#'+remove_con).click();
            // jQuery('#'+remove_con2).click();
            // jsPlumb.remove(remove_con);
            // jsPlumb.remove(remove_con2);
            // jsPlumb.detach(remove_con);
            // jsPlumb.detach(remove_con2);
            // instance.deleteConnection(remove_con);
            // instance.deleteConnection(remove_con2);
            // jQuery('#'+remove_con).remove();
            // jQuery('#'+remove_con2).remove();
            // jQuery("#"+source_con).remove();
            // if(target_con != "undefined")
            // {
            //     jsPlumb.remove(target_con); 
            // }
            // else if(source_con != "undefined")
            // {
            //     jsPlumb.remove(source_con);
            // }
            // else if(remove_id!="undefined")
            // {
            //     jsPlumb.remove(remove_id);
            // }
            // alert();
        });

        //select input form option
        jQuery(".choose-input-option").change(function(){
          var current_id = jQuery(this).data("value");
          var current_modal_id = jQuery(this).data("modal");
          var value = jQuery('#'+current_modal_id+' .choose-input-option option:selected').data("class");
          jQuery("#"+current_modal_id+" ."+value).siblings().removeClass("active");
          jQuery("#"+current_modal_id+" .hidden-fields."+value).addClass("active");
          jQuery("#"+current_id+".input-box .header .open-modal").text(value);
        }); 

        //Save Input Form  
        jQuery(".input-form-save").click(function(){

            var current_id = jQuery(this).data("value");
            var current_modal_id = jQuery(this).data("modal");
            var value = jQuery('#'+current_modal_id+' .choose-input-option option:selected').data("class");
            var element = jQuery("#"+current_modal_id+" .hidden-fields."+value).clone();
            jQuery(element).appendTo("#"+current_id +" .content-body");
            var input_type = jQuery('#'+current_modal_id+' .choose-input-option option:selected').data("class");
            jQuery('#'+current_modal_id+' .choose-input-option').attr("readonly" , "readonly"); 
            jQuery('#'+current_modal_id+' .choose-input-option').css("pointer-events" , "none");
            var inputs = jQuery('#'+current_modal_id+' .input-form-modal .'+input_type+' :input');
            var data = {};
            var input_data =new Array();
            // path_id.push({ id: windows[i].id, target_id: [] , source_id: [] });
            input_data.push({ inputtype: input_type, formdata: [] });
            // console.log(input_type);
            inputs.each(function() {
                var t_name = this.name;
                var t_val = jQuery(this).val();
                input_data[0].formdata.push({ t_name: t_val });
                // data[this.name] = jQuery(this).val();
            });
            console.log(input_data);
        });

        // jQuery('.input-form-modal').submit(function() {
        //     alert("");
            
        // });
        
        jQuery(".ios-switch").on("change", function(){
            jQuery(this).val(jQuery(this).is(':checked'));
        });

        //open input modal
        jQuery(".open-modal-form").click(function(){
            var data = jQuery(this).data("target");
            jQuery(data).modal();
        });
        inputcount++;
        return d;
    };
    var newfilterNode = function(x, y) {
        var d = document.createElement("div");
        var id = "filter_box"+filtercount;
        var modal_id = "filter_box"+filtercount+"modal";
        d.className = "w content-box filter-box";
        d.id = id;
        d.innerHTML = "<div class='ip-button'></div><div class=\"ep filter-1 filter\"></div><div class='header'><a class='open-modal'>Filter</a><div class='icon-box'><a class='open-modal-form' data-toggle='modal' data-target='#"+modal_id+"'><i class='fa fa-cog'></i></a><a class='close-node'><i class='fa fa-trash'></i></a></div> </div><div class='content-body'></div>";
        d.style.left = x + "px";
        d.style.top = y + "px";
        instance.getContainer().appendChild(d);
        initNode(d);
        jQuery("#"+id).attr("data-value","filter");

        //clone the Input Form Modal
        var clone = jQuery("#filter").clone();
        jQuery(clone).removeAttr("id");
        jQuery(clone).attr("id",modal_id);
        jQuery(".filter-project").append(clone);

        //add data in inpu form save button
        jQuery("#"+modal_id+" .filter-form-modal .choose-filter-option").attr("data-value",id);
        jQuery("#"+modal_id+" .filter-form-modal .choose-filter-option").attr("data-modal",modal_id);
        jQuery("#"+modal_id+" .filter-form-modal .filter-form-save").attr("data-value",id);
        jQuery("#"+modal_id+" .filter-form-modal .filter-form-save").attr("data-modal",modal_id);

        //close node
        jQuery(".close-node").click(function(){
            var close_modal_id = jQuery(this).parent().parent().parent().attr("id");
            jQuery('.jtk-endpoint[elid="'+close_modal_id+'"] + svg').remove();
            jQuery('.jtk-endpoint[elid="'+close_modal_id+'"]').remove();
            var source_con_id = jQuery(this).data("sourcecon");
            console.log()
            jQuery('.jtk-endpoint[elid="'+source_con_id+'"] + svg').remove();
            jQuery('.jtk-endpoint[elid="'+source_con_id+'"]').remove();
            jQuery("#"+close_modal_id+"modal").remove();
            jQuery(this).parent().parent().parent().remove();
        });

        //select filter form option
        jQuery(".choose-filter-option").change(function(){
          var current_id = jQuery(this).data("value");
          var current_modal_id = jQuery(this).data("modal");
          var value = jQuery('#'+current_modal_id+' .choose-filter-option option:selected').data("class");
          jQuery("#"+current_modal_id+" ."+value).siblings().removeClass("active");
          jQuery("#"+current_modal_id+" .hidden-fields."+value).addClass("active");
          jQuery("#"+current_id+".filter-box .header .open-modal").text(value);
        }); 

        //Save filter Form  
        jQuery(".filter-form-save").click(function(){

            var current_id = jQuery(this).data("value");
            var current_modal_id = jQuery(this).data("modal");
            var value = jQuery('#'+current_modal_id+' .choose-filter-option option:selected').data("class");
            var element = jQuery("#"+current_modal_id+" .hidden-fields."+value).clone();
            jQuery(element).appendTo("#"+current_id +" .content-body");
            var filter_type = jQuery('#'+current_modal_id+' .choose-filter-option option:selected').data("class");
            jQuery('#'+current_modal_id+' .choose-filter-option').attr("readonly" , "readonly"); 
            jQuery('#'+current_modal_id+' .choose-filter-option').css("pointer-events" , "none");
            var filters = jQuery('#'+current_modal_id+' .filter-form-modal .'+filter_type+' :input');
            var data = {};
            var filter_data =new Array();
            // path_id.push({ id: windows[i].id, target_id: [] , source_id: [] });
            filter_data.push({ filtertype: filter_type, formdata: [] });
            // console.log(input_type);
            filters.each(function() {
                var t_name = this.name;
                var t_val = jQuery(this).val();
                filter_data[0].formdata.push({ t_name: t_val });
                // data[this.name] = jQuery(this).val();
            });
            // console.log(filter_data);
        });

        // jQuery('.input-form-modal').submit(function() {
        //     alert("");
            
        // });
        
        jQuery(".ios-switch").on("change", function(){
            jQuery(this).val(jQuery(this).is(':checked'));
        });

        //open filter modal
        jQuery(".open-modal-form").click(function(){
            var data = jQuery(this).data("target");
            jQuery(data).modal();
        });

        filtercount++;
        return d;
    };
     var newoutputNode = function(x, y) {
        var d = document.createElement("div");
        var id = "output_box"+outputcount;
        var modal_id = "output_box"+outputcount+"modal";
        d.className = "w content-box output-box";
        d.id = id;
        d.innerHTML = "<div class='ip-button'></div><div class='header'><a class='open-modal'>Output</a><div class='icon-box'><a class='open-modal-form' data-toggle='modal' data-target='#"+modal_id+"'><i class='fa fa-cog'></i></a><a class='close-node'><i class='fa fa-trash'></i></a></div> </div><div class=\" output\"></div><div class='content-body'></div>";
        d.style.left = x + "px";
        d.style.top = y + "px";
        instance.getContainer().appendChild(d);
        initNode(d);
        jQuery("#"+id).attr("data-value","output");
        
        //clone the Input Form Modal
        var clone = jQuery("#output").clone();
        jQuery(clone).removeAttr("id");
        jQuery(clone).attr("id",modal_id);
        jQuery(".filter-project").append(clone);

        //add data in inpu form save button
        jQuery("#"+modal_id+" .output-form-modal .choose-output-option").attr("data-value",id);
        jQuery("#"+modal_id+" .output-form-modal .choose-output-option").attr("data-modal",modal_id);
        jQuery("#"+modal_id+" .output-form-modal .output-form-save").attr("data-value",id);
        jQuery("#"+modal_id+" .output-form-modal .output-form-save").attr("data-modal",modal_id);

        //close node
        jQuery(".close-node").click(function(){
            var close_modal_id = jQuery(this).parent().parent().parent().attr("id");
            jQuery("#"+close_modal_id+"modal").remove();
            jQuery(this).parent().parent().parent().remove();
        });

        //select filter form option
        jQuery(".choose-output-option").change(function(){
          var current_id = jQuery(this).data("value");
          var current_modal_id = jQuery(this).data("modal");
          var value = jQuery('#'+current_modal_id+' .choose-output-option option:selected').data("class");
          jQuery("#"+current_modal_id+" ."+value).siblings().removeClass("active");
          jQuery("#"+current_modal_id+" .hidden-fields."+value).addClass("active");
          jQuery("#"+current_id+".output-box .header .open-modal").text(value);
        }); 

        //Save filter Form  
        jQuery(".output-form-save").click(function(){

            var current_id = jQuery(this).data("value");
            var current_modal_id = jQuery(this).data("modal");
            var value = jQuery('#'+current_modal_id+' .choose-output-option option:selected').data("class");
            var element = jQuery("#"+current_modal_id+" .hidden-fields."+value).clone();
            jQuery(element).appendTo("#"+current_id +" .content-body");
            var filter_type = jQuery('#'+current_modal_id+' .choose-output-option option:selected').data("class");
            jQuery('#'+current_modal_id+' .choose-output-option').attr("readonly" , "readonly"); 
            jQuery('#'+current_modal_id+' .choose-output-option').css("pointer-events" , "none");
            var filters = jQuery('#'+current_modal_id+' .output-form-modal .'+filter_type+' :input');
            var data = {};
            var filter_data =new Array();
            // path_id.push({ id: windows[i].id, target_id: [] , source_id: [] });
            filter_data.push({ filtertype: filter_type, formdata: [] });
            // console.log(input_type);
            filters.each(function() {
                var t_name = this.name;
                var t_val = jQuery(this).val();
                filter_data[0].formdata.push({ t_name: t_val });
                // data[this.name] = jQuery(this).val();
            });
            // console.log(filter_data);
        });

        // jQuery('.input-form-modal').submit(function() {
        //     alert("");
            
        // });
        
        jQuery(".ios-switch").on("change", function(){
            jQuery(this).val(jQuery(this).is(':checked'));
        });

        //open filter modal
        jQuery(".open-modal-form").click(function(){
            var data = jQuery(this).data("target");
            jQuery(data).modal();
        });

        outputcount++;
        return d;
    };

    // suspend drawing and initialise.
    instance.batch(function () {
        for (var i = 0; i < windows.length; i++) {
            initNode(windows[i], true);
            // console.log(windows[i]);
        }
        // and finally, make a few connections
        instance.connect({ source: "input_box0", target: "filter_box0", type:"basic", deleteEndpointsOnDetach:false  });
        instance.connect({ source: "filter_box0", target: "output_box0", type:"basic", newConnection:false   });
        // jsPlumb.remove("input_box0");
        // instance.detach(instance.connect({ source: "input_box0", target: "filter_box0", type:"basic", deleteEndpointsOnDetach:false  }));
        // jsPlumb.remove("con_3");
        // jsPlumb.empty("input_box0");
        // instance.connect({  })
        // instance.connect({ source: "filter_box", target: "output_box1", type:"basic" });
        // instance.connect({ source: "input_box1", target: "filter_box1", type: "basic"});

    });

    jQuery(".canvas-save").click(function(){

        var user_id = jQuery(this).data("id");
        var user_name = jQuery(this).data("username");
        // var canvas = document.getElementById("canvas");
        var windows_new = jsPlumb.getSelector(".statemachine-demo .w");

        var path_id = new Array();
        for (var i = 0; i < windows_new.length; i++) {

            path_id.push({ id: windows_new[i].id, target_id: [] , source_id: [] });
            var endpoints = instance.getEndpoints(windows_new[i].id);
            for (var j = 0; j < endpoints.length; j++) {
                if(endpoints[j].connections[0].targetId != windows_new[i].id)
                {
                    path_id[i].target_id.push({ target: endpoints[j].connections[0].targetId});
                }
                else if(endpoints[j].connections[0].sourceId != windows_new[i].id)
                {
                    path_id[i].source_id.push({ source: endpoints[j].connections[0].sourceId});
                }
            }
        }
        // console.log(path_id);

        // Remove Empty Node

        for (var i = 0; i < path_id.length; i++)
        {
            // console.log("ID :"+path_id[i].id);
            if((path_id[i].target_id.length > 0) || (path_id[i].source_id.length > 0))
            {
                for (var j = 0; j < path_id[i].target_id.length; j++)
                {
                    if( path_id[i].id != path_id[i].target_id[j].target )
                    {
                        // console.log("Target Id :"+path_id[i].target_id[j].target);
                    }
                }
            }
            else{
                console.log("EMPTY Connection :"+path_id[i].id);
                jQuery("#"+path_id[i].id).remove();
                path_id.splice(i, 1);

            }
        }

        // Validation Of Connection path

        console.log("Finding Path");
        var root_id = new Array();
        var k = 0;
        for (var i = 0; i < path_id.length; i++)
        { 
            if(path_id[i].source_id.length == 0)
            {
                // console.log("Root Id:"+path_id[i].id);
                root_id.push({ id: path_id[i].id, hole_arr: []  });
            } 
        }

        var c=0;
        var count_path = function(value,num)
        {
            if(value.target_id.length > 0)
            {
                for(var i=0; i<value.target_id.length;i++)
                {
                    root_id[num].hole_arr.push({ path_id : value.id, form_datas : [] });
                    var temp = value.target_id[i].target;
                    for (var k = 0; k < path_id.length; k++)
                    { 
                        if(temp == path_id[k].id)
                        {
                            if(path_id[k].target_id.length>0)
                            {
                              c++;  
                              console.log(path_id[k].id);
                              count_path(path_id[k],num); 
                            }
                            else{
                                console.log(path_id[k].id);
                                root_id[num].hole_arr.push({ path_id : path_id[k].id, form_datas : [] });
                            }
                        }
                    }
                }
            }
            else{
                c=0;
            }
        };

        for (var i = 0; i < root_id.length; i++)
        { 
            for (var j = 0; j < path_id.length; j++)
            {   
                if(root_id[i].id == path_id[j].id)
                {
                    count_path(path_id[j],i);
                    // root_id[i].hole_arr.push({ path_id : path_id[j].id });
                }
            }
        }

        for (var i = 0; i < root_id.length; i++)
        { 
            // console.log("Root ID:"+root_id[i].id);
            for (var j = 0; j < root_id[i].hole_arr.length; j++)
            { 
                console.log("PATH ID:"+root_id[i].hole_arr[j].path_id);
                var position = jQuery("#"+root_id[i].hole_arr[j].path_id).position();
                // $( "p:last" ).text( "left: " + position.left + ", top: " + position.top );
                var current_modal_id = root_id[i].hole_arr[j].path_id+"modal";
                console.log(current_modal_id);
                var input_type = jQuery('#'+current_modal_id+' .choose option:selected').data("class");
                jQuery('#'+current_modal_id+' .choose').attr("readonly" , "readonly"); 
                jQuery('#'+current_modal_id+' .choose').css("pointer-events" , "none");
                var inputs = jQuery('#'+current_modal_id+' form .'+input_type+' :input');
                var data = {};
                var input_data =new Array();
                input_data.push({ inputtype: input_type, formdata: [] });
                inputs.each(function() {
                    var t_name = this.name;
                    var t_val = jQuery(this).val();
                    input_data[0].formdata.push({ t_name: t_val });
                });
                root_id[i].hole_arr[j].form_datas.push({ data : input_data ,top : position.top , left : position.left });
            }
        }
        var all_arr = new Array();

        all_arr.push({ userid: user_id, username: user_name, rootid: [] });
        all_arr[0].rootid.push({ roots:root_id });
        console.log(all_arr);
        var all_data = JSON.stringify(all_arr);

        console.log(all_data);

    });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);
});