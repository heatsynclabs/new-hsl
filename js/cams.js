define([
  'lodash',
  'dojo/on',
  'dojo/request',
  'dojo/dom-construct',
  './RAF'
], function(_, on, request, domConstruct){

  'use strict';

  var start = Date.now() - 4e3;

  var url = 'http://heatsynclabs.org:1337/data.php';
  var pamela;
  var macAddressRegExp = /^([0-9A-F]{2}[:\-]){5}([0-9A-F]{2})$/i;

  var cam = new Image();
  var camBaseUrl = 'http://live.heatsynclabs.org/snapshot.php?camera=';

  cam.setAttribute('id', 'cam');

  on(cam, 'load', function(e){
    domConstruct.place(e.target, 'cam', 'replace');
  });

  var currentCam = 1;

  var loadCams = function(){
    var progress = Date.now() - start;
    if(4e3 /* 5 seconds - maybe tweak */ - progress < 0){
      console.log('load cams', progress);
      start = Date.now();

      cam.src = camBaseUrl + currentCam++;

      if(currentCam > 3){
        currentCam = 1;
      }
    }
    requestAnimationFrame(loadCams);
  };

  return request.get(url, {
    handleAs: 'json',
    headers: {
      'X-Requested-With': null
    }
  }).then(function(data){
    console.log('Pamela Data: ', data);
    pamela = _.filter(data, function(user){
      return user.indexOf('.') !== 0 && !macAddressRegExp.test(user);
    });

    if(!pamela.length){
      pamela.push('Nobody in the space.');
    }

    cam.setAttribute('title', pamela.join(', '));

    requestAnimationFrame(loadCams);

    return pamela;
  }, function(err){
    console.log('Did not get pamela data.', err);

    pamela = ['Could not get Pamela data. Please Refresh'];

    requestAnimationFrame(loadCams);
  });

});