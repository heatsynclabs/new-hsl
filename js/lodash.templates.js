;(function(window) {
  var templates = {},
      _ = window._;

  templates['flickr_img_url'] = function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __d = obj.obj || obj;
    __p += 'http://farm' +
    ((__t = (obj.farm)) == null ? '' : __t) +
    '.staticflickr.com/' +
    ((__t = (obj.server)) == null ? '' : __t) +
    '/' +
    ((__t = (obj.id)) == null ? '' : __t) +
    '_' +
    ((__t = (obj.secret)) == null ? '' : __t) +
    '_b.jpg';
    return __p
  };

  templates['open_status'] = function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __d = obj.obj || obj;
    __p += '<span class="' +
    ((__t = (obj.status)) == null ? '' : __t) +
    '">' +
    ((__t = (obj.status)) == null ? '' : __t) +
    '</span>';
    return __p
  };

  templates['flickr_link'] = function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __d = obj.obj || obj;
    __p += 'http://www.flickr.com/photos/hslphotosync/' +
    ((__t = (obj.id)) == null ? '' : __t) +
    '/in/photostream';
    return __p
  };

  templates['flickr'] = function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __d = obj.obj || obj;
    __p += '<a href="' +
    ((__t = (obj.link)) == null ? '' : __t) +
    '">\n  <img id=\'main_image\' src="' +
    ((__t = (obj.image_url)) == null ? '' : __t) +
    '">\n</a>\n<div class=\'caption\' id=\'main_image_caption\'>' +
    ((__t = (obj.title)) == null ? '' : __t) +
    '</div>';
    return __p
  };

  templates['discussion'] = function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    
     _.forEach(entries, function(entry){ ;
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

  templates['blogs'] = function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    
     _.forEach(entries, function(entry){ ;
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
    
     _(dates).unique().forEach(function(date){ ;
    __p += '\n  <h4>' +
    ((__t = (date)) == null ? '' : __t) +
    '</h4>\n  <ul>\n    ';
     _(entries).where({ date: date }).forEach(function(entry){ ;
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

  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    define(['lodash'], function(lodash) {
      _ = lodash;
      lodash.templates = lodash.extend(lodash.templates || {}, templates);
    });
  }
}(this));