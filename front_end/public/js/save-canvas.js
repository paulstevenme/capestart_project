jQuery(document).ready(function () {

	// jQuery(".canvas-save").click(function(){

 //        //Getting All ID and Connection Target Id
 //     //    alert();
	//     //     var instance = jsPlumb.getInstance({
	//     //     Endpoint: ["Dot", {radius: 4}],
	//     //     Connector:"StateMachine",
	//     //     HoverPaintStyle: {stroke: "#1e8151", strokeWidth: 4 },
	//     //     ConnectionOverlays: [
	//     //         [ "Arrow", {
	//     //             location: 1,
	//     //             id: "arrow",
	//     //             length: 14,
	//     //         } ]
	//     //         //[ "Label", { label: "FOO", id: "label", cssClass: "aLabel" }]
	//     //     ],
	//     //     Container: "canvas"
	//     // });

 //    	// instance.registerConnectionType("basic", { anchor:"Continuous", connector:"StateMachine" });
 //     //    var windows = jsPlumb.getSelector(".statemachine-demo .w");
 //        var path_id = new Array();
 //        for (var i = 0; i < windows.length; i++) {

 //            path_id.push({ id: windows[i].id, target_id: [] , source_id: [] });
 //            var endpoints = instance.getEndpoints(windows[i].id);

 //            for (var j = 0; j < endpoints.length; j++) {
 //                if(endpoints[j].connections[0].targetId != windows[i].id)
 //                {
 //                    path_id[i].target_id.push({ target: endpoints[j].connections[0].targetId});
 //                }
 //                else if(endpoints[j].connections[0].sourceId != windows[i].id)
 //                {
 //                    path_id[i].source_id.push({ source: endpoints[j].connections[0].sourceId});
 //                }
 //            }
 //        }
 //        console.log(path_id);

 //        // Remove Empty Node

 //        for (var i = 0; i < path_id.length; i++)
 //        {
 //            console.log("ID :"+path_id[i].id);
 //            if((path_id[i].target_id.length > 0) || (path_id[i].source_id.length > 0))
 //            {
 //                for (var j = 0; j < path_id[i].target_id.length; j++)
 //                {
 //                    if( path_id[i].id != path_id[i].target_id[j].target )
 //                    {
 //                        console.log("Target Id :"+path_id[i].target_id[j].target);
 //                    }
 //                }
 //            }
 //            else{
 //                console.log("EMPTY Connection :"+path_id[i].id);
 //                jQuery("#"+path_id[i].id).remove();
 //                path_id.splice(i, 1);

 //            }
 //        }

 //        // Validation Of Connection path

 //        console.log("Finding Path");
 //        var root_id = new Array();
 //        var k = 0;
 //        for (var i = 0; i < path_id.length; i++)
 //        { 
 //            if(path_id[i].source_id.length == 0)
 //            {
 //                console.log("Root Id:"+path_id[i].id);
 //                root_id.push({ id: path_id[i].id, count: []  });
 //                // root_id[k++] = path_id[i].id;
 //            } 
 //        }

 //        var c=0;
 //        var count_path = function(value)
 //        {
 //            // console.log(value);
 //            // console.log(value.target_id.length);
 //            if(value.target_id.length > 0)
 //            {
 //                for(var i=0; i<value.target_id.length;i++)
 //                {
 //                    var temp = value.target_id[i].target;
 //                    for (var k = 0; k < path_id.length; k++)
 //                    { 
 //                        if(temp == path_id[k].id)
 //                        {
 //                            console.log(path_id[k].id);
 //                            if(path_id[k].target_id.length>0)
 //                            {
 //                              c++;
 //                              count_path(path_id[k]);  
 //                              console.log(c);
 //                              // root_id[i].count.push({ count: c });
 //                            }
 //                        }
 //                    }
 //                }
 //            }
 //            else{
 //                console.log(c);
 //                c=0;
 //            }
 //            // if (path_id[j].target_id.length > 0) {
 //            //     c++;
 //            //     return count_path();
 //            // } else {
 //            //     return c;
 //            // }
 //        };

 //        for (var i = 0; i < root_id.length; i++)
 //        { 
 //            for (var j = 0; j < path_id.length; j++)
 //            {   
 //                if(root_id[i].id == path_id[j].id)
 //                {
 //                    console.log("path:"+root_id[i].id);
 //                    count_path(path_id[j]);
 //                    // console.log(a);
 //                    // console.log(path_id[j].target_id.length);
 //                }
 //            }
 //        }
        
 //        console.log(root_id);

 //    });

});