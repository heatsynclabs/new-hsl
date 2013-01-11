define([
  'lodash',
  'dojo/on',
  'dojo/dom'
], function(_, on, dom){

  var start = Date.now();

  var cams = [new Image(), new Image(), new Image()];
  var camBaseUrl = 'http://live.heatsynclabs.org/snapshot.php?camera=';

  _.forEach(cams, function(cam, idx){
    on(cam, 'load', function(e){
      dom.byId('cam' + (idx + 1)).src = e.target.src;
    });
  });

  var loadCams = function(timestamp){
    var progress = timestamp - start;
    if(5e3 /* 5 seconds - maybe tweak */ - progress < 0){
      console.log('load cams', progress);
      start = Date.now();
      _.forEach(cams, function(cam, idx){
        cam.src = camBaseUrl + (idx + 1);
      });
    }
    webkitRequestAnimationFrame(loadCams);
  };

  webkitRequestAnimationFrame(loadCams);
});