define([
  'lodash',
  'dojo/dom',
  'dojo/request/script',
  './lodash.templates'
], function(_, dom, request){

  'use strict';

  console.log("Flickr init...");

  var url = 'https://api.flickr.com/services/rest/';

  return request.get(url, {
    jsonp: 'jsoncallback',
    query: {
      method: 'flickr.photos.search',
      api_key: 'bec64c9c0f28889dc6e0c5ef7be3511f',
      user_id: '60827818@N07',
      tags: 'publish',
      format: 'json'
    }
  }).then(function(data){
    console.log('Flickr loaded: ', data.photos.photo);

    var photos = _.map(data.photos.photo, function(photo){
      return {
        image_url: _.templates.flickr_img_url(photo),
        title: photo.title,
        link: _.templates.flickr_link(photo),
        description: ""
      };
    });

    //for now just use the first image we got back from flickr
    var flickrImage = dom.byId('main_image');
    if(flickrImage){
      flickrImage.innerHTML = _.templates.flickr(photos[0]);
    }

    return photos;
  });

});
