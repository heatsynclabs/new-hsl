;(function(window) {
  var templates = {},
      _ = window._;

  templates['discussion'] = function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    
     _.forEach(entries, function(entry){ ;
    __p += '\n  <a href="' +
    ((__t = (entry.link)) == null ? '' : __t) +
    '" class="discussion-title">' +
    ((__t = (entry.title)) == null ? '' : __t) +
    '</a> -\n  <p>\n    ' +
    ((__t = (entry.contentSnippet)) == null ? '' : __t) +
    '\n  </p>\n';
    });;
    __p += '\n';
    
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