require([
	"dojo/request",
	"dojo/dom"
], function(request,dom){
	
	//set the door status to something while we query space API
	
	//dom.byId("door_status").innerHTML = "<i>fetching door status</i>";

 	request("http://intranet.heatsynclabs.org/~access/cgi-bin/spaceapi.rb", 
	{handleAs: "json", headers: {"X-Requested-With":null}}
	).then(function(data){
		if (data["open"] == false) {
				dom.byId("door_status").innerHTML = '<div class="signs closed"></div>';                
			}
		if (data["open"] == true) {
				dom.byId("door_status").innerHTML = '<div class="signs open"></div>';
			}
  	}, function(err){
		console.log("Did not get door data.");
  	}, function(evt){
	// handle a progress event
	});
});
