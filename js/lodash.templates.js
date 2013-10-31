;(function(root) {
  var undefined;

  var objectTypes = {
    'function': true,
    'object': true
  };

  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module

  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  var templates = {},
      _ = root._;

  templates['blogs'] = function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {

     _.forEach(entries, function(entry){
    __p += '\n  <p>\n    <a href="' +
    ((__t = (entry.link)) == null ? '' : __t) +
    '" class="title">' +
    ((__t = (entry.title)) == null ? '' : __t) +
    '</a> - ' +
    ((__t = (entry.snippet)) == null ? '' : __t) +
    '\n  </p>\n';
     }); ;

    }
    return __p
  };

  templates['calendar'] = function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {

     _(dates).unique().forEach(function(date){
    __p += '\n  <h4>' +
    ((__t = (date)) == null ? '' : __t) +
    '</h4>\n  <ul>\n    ';
     _(entries).where({ date: date }).forEach(function(entry){
    __p += '\n      <li>\n        ' +
    ((__t = (entry.time)) == null ? '' : __t) +
    ' <a href="' +
    ((__t = (entry.link)) == null ? '' : __t) +
    '">' +
    ((__t = (entry.title)) == null ? '' : __t) +
    '</a>\n      </li>\n    ';
     }); ;
    __p += '\n  </ul>\n';
     }); ;

    }
    return __p
  };

  templates['discussion'] = function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {

     _.forEach(entries, function(entry){
    __p += '\n  <p>\n    <a href="' +
    ((__t = (entry.link)) == null ? '' : __t) +
    '" class="title">' +
    ((__t = (entry.title)) == null ? '' : __t) +
    '</a> - ' +
    ((__t = (entry.contentSnippet)) == null ? '' : __t) +
    '\n  </p>\n';
    });;
    __p += '\n';

    }
    return __p
  };

  templates['flickr'] = function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape;
    with (obj) {
    __p += '<a href="' +
    ((__t = (link)) == null ? '' : __t) +
    '"><img src="' +
    ((__t = (image_url)) == null ? '' : __t) +
    '"></a>\n<a href="' +
    ((__t = (link)) == null ? '' : __t) +
    '" class="caption" id="main_image_caption">' +
    ((__t = (title)) == null ? '' : __t) +
    ' <i class="icon-chevron-right"></i></a>\n';

    }
    return __p
  };

  templates['flickr_img_url'] = function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape;
    with (obj) {
    __p += 'http://farm' +
    ((__t = (farm)) == null ? '' : __t) +
    '.staticflickr.com/' +
    ((__t = (server)) == null ? '' : __t) +
    '/' +
    ((__t = (id)) == null ? '' : __t) +
    '_' +
    ((__t = (secret)) == null ? '' : __t) +
    '_b.jpg';

    }
    return __p
  };

  templates['flickr_link'] = function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape;
    with (obj) {
    __p += 'http://www.flickr.com/photos/hslphotosync/' +
    ((__t = (id)) == null ? '' : __t) +
    '/in/photostream';

    }
    return __p
  };

  templates['open_status'] = function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape;
    with (obj) {
    __p += '<span class="' +
    ((__t = (status)) == null ? '' : __t) +
    '">' +
    ((__t = (status_text)) == null ? '' : __t) +
    '</span>';

    }
    return __p
  };

  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    define(['lodash'], function(lodash) {
      _ = lodash;
      lodash.templates = lodash.extend(lodash.templates || {}, templates);
    });
  } else if (freeExports && freeModule) {
    _ = require('lodash');
  }
}(this));
