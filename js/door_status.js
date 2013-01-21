require([
  'dojo/request',
  'dojo/dom',
  'dojo/domReady!'
], function(request, dom){

  //set the door status to something while we query space API
  'use strict';

  var url = 'http://intranet.heatsynclabs.org/~access/cgi-bin/spaceapi.rb';

  var doorStatus = dom.byId('door_status');

  request.get(url, {
    handleAs: 'json',
    headers: {
      'X-Requested-With': null
    }
  }).then(function(data){
    if(!data.open){
      doorStatus.innerHTML = '<div class="signs closed"></div>';
    }
    if(data.open){
      doorStatus.innerHTML = '<div class="signs open"></div>';
    }
  }, function(err){
    console.log('Did not get door data.', err);
    doorStatus.innerHTML = 'Error occurred while fetching status, please refresh.';
  });

});
