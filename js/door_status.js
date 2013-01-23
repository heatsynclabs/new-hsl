define([
  'dojo/request',
  'dojo/dom',
  'dojo/domReady!'
], function(request, dom){

  'use strict';

  var url = 'http://intranet.heatsynclabs.org/~access/cgi-bin/spaceapi.rb';

  var doorStatus = dom.byId('door_status');

  return request.get(url, {
    handleAs: 'json',
    headers: {
      'X-Requested-With': null
    }
  }).then(function(data){
    if(!data.open){
      doorStatus.innerHTML = '<span class="closed">closed</span>';
    }
    if(data.open){
      doorStatus.innerHTML = '<span class="open">open</span>';
    }

    return data;
  }, function(err){
    console.log('Did not get door data.', err);
    doorStatus.innerHTML = 'Error occurred while fetching status, please refresh.';
  });

});
