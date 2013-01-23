define([
  './replaceTags',
  'lodash',
  'dojo/dom',
  'dojo/request/script',
  './lodash.templates',
  'dojo/domReady!'
], function(replaceTags, _, dom, request){

  'use strict';

  var url = 'http://pipes.yahoo.com/pipes/pipe.run';

  var blogEntries = dom.byId('blog-container');

  return request.get(url, {
    jsonp: '_callback',
    query: {
      _id: 'eb41a075801cf56d9a76ea48deea1612',
      _render: 'json'
    }
  }).then(function(data){
    var entries = _(data.value.items)
      .filter(function(entry){
        return entry.title && entry.description && entry.link;
      })
      .map(function(entry){
        return {
          title: replaceTags(entry.title),
          link: entry.link,
          snippet: replaceTags(entry.description).substring(0, 150) + '...'
        };
      })
      .first(3)
      .value();

    blogEntries.innerHTML = _.templates.blogs({
      entries: entries
    });

    return entries;
  }, function(err){
    console.log('Error in Blogs', err);
    // TODO: template an error message
    blogEntries.innerHTML = 'Error Loading Blogs - Please Refresh the Page';
  });

});
