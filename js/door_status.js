require([
	"dojo/request"
], function(request){
 	request("http://intranet.heatsynclabs.org/~access/cgi-bin/spaceapi.rb", 
	{handleAs: "json", headers: {"X-Requested-With":null}}
	).then(function(data){
		console.log(data["open"]);
  	}, function(err){
		console.log("Did not get door data.");
  	}, function(evt){
	// handle a progress event
	});
});
