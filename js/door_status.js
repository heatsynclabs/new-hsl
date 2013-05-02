define([
  'lodash',
  'dojo/request',
  'dojo/dom',
  './lodash.templates',
  'dojo/domReady!'
], function(_, request, dom){

  'use strict';

  var url = 'http://intranet.heatsynclabs.org/cgi-bin/spaceapi.rb';

  var doorStatus = dom.byId('door_status');

  return request.get(url, {
    handleAs: 'json',
    headers: {
      'X-Requested-With': null
    }
  }).then(function(data){
    if(doorStatus){
      doorStatus.innerHTML = _.templates.open_status({
        status: data.open ? 'open' : 'closed'
      });
    }

    return data;
  }, function(err){
    console.log('Did not get door data.', err);
    doorStatus.innerHTML = 'Error occurred while fetching status, please refresh.';
  });

});
