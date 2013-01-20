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
			//dom.byId("door_status").innerHTML = "We are currently closed";
			dom.byId("door_status_open").style.display="none";
			dom.byId("door_status_closed").style.display="block";
			}
		if (data["open"] == true) {
			//dom.byId("door_status").innerHTML = "Come in, we're open!";
			dom.byId("door_status_open").style.display="block";
			dom.byId("door_status_closed").style.display="none";
			}
  	}, function(err){
		console.log("Did not get door data.");
  	}, function(evt){
	// handle a progress event
	});
});
