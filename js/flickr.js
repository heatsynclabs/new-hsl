define([
  	'dojo/dom',
	'dojo/dom-attr',
	'dojo/request'
], function(dom,attr,request){
	console.log("Flickr init...");

	var photos = [];

	var url = 'http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=bec64c9c0f28889dc6e0c5ef7be3511f&user_id=60827818%40N07&tags=publish&format=json&nojsoncallback=1';

	request.get(url, {
		handleAs: 'json',
		headers: {
			'X-Requested-With': null
		}
	}).then(function(data){
		//console.log(data.photos.photo);
		for(i = 0; i< data.photos.photo.length; i++) {

			photo = data.photos.photo[i];

			image_url = "http://farm" + photo['farm'] + ".staticflickr.com/" + photo["server"] + "/" + photo["id"] + "_" + photo["secret"] + "_b.jpg"
			title = photo['title'];
			link = "http://www.flickr.com/photos/hslphotosync/" + photo["id"] + "/in/photostream";
			description = "";
			photos[i] = {"title":title,"description":description,"image_url":image_url,"link":link};
		}
		//For Debug
		//console.log(photos);
		//
		//For Debugging purposes use a placekitten.
		//image_url = "http://placekitten.com/800/800";
		
		//for now just use the first image we got back from flickr
		image_url = photos[0]["image_url"];
		title = photos[0]["title"];
		link = photos[0]["link"];
		attr.set("main_image","src",image_url);
		attr.set("main_image_link","href",link);
		dom.byId('main_image_caption').innerHTML=title;

	});
})
