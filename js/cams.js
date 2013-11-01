define([
  'lodash',
  'dojo/on',
  'dojo/request',
  'dojo/dom',
  'dojo/dom-construct',
  './RAF',
  'dojo/domReady!'
], function(_, on, request, dom, domConstruct){

  'use strict';

  var start = Date.now() - 4e3;

  var url = 'http://members.heatsynclabs.org/macs.json';
  var pamela;
  var animationFrame;
  var macAddressRegExp = /^([0-9A-F]{2}[:\-]){5}([0-9A-F]{2})$/i;

  var cam = new Image();
  var camBaseUrl = 'http://live.heatsynclabs.org/snapshot.php?camera=';
  var camElement = dom.byId('cam');

  cam.setAttribute('id', 'cam');

  on(cam, 'load', function(e){
    if(camElement){
      domConstruct.place(e.target, 'cam', 'replace');
    } else {
      cancelAnimationFrame(animationFrame);
    }
  });

  var currentCam = 1;

  var loadCams = function(){
    var progress = Date.now() - start;
    if(4e3 /* 5 seconds - maybe tweak */ - progress < 0){
      console.log('load cams', progress);
      start = Date.now();

      cam.src = camBaseUrl + currentCam++;

      if(currentCam > 4){
        currentCam = 1;
      }
    }
    animationFrame = requestAnimationFrame(loadCams);
  };

  return request.get(url, {
    handleAs: 'json',
    headers: {
      'X-Requested-With': null
    }
  }).then(function(data){
    console.log('Pamela Data: ', data);
    pamela = _(data).pluck('name').unique().value();

    if(!pamela.length){
      pamela.push('Nobody in the space.');
    }

    cam.setAttribute('title', pamela.join(', '));

    animationFrame = requestAnimationFrame(loadCams);

    return pamela;
  }, function(err){
    console.log('Did not get pamela data.', err);

    pamela = ['Could not get Pamela data. Please Refresh'];

    cam.setAttribute('title', pamela.join(', '));

    animationFrame = requestAnimationFrame(loadCams);
  });

});
