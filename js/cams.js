define([
  'dojo/on',
  'dojo/dom-construct',
  './RAF'
], function(on, domConstruct){

  'use strict';

  var start = Date.now();

  var cam = new Image();
  var camBaseUrl = 'http://live.heatsynclabs.org/snapshot.php?camera=';

  cam.setAttribute("id","cam");

  on(cam, 'load', function(e){
    domConstruct.place(e.target,"cam","replace");
  });

  var currentCam = 2; // Start at cam2 because we default load cam1

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

  requestAnimationFrame(loadCams);
});