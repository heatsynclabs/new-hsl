define([
  'lodash',
  'dojo/dom',
  'dojo/request/script',
  './lodash.template',
  'dojo/domReady!'
], function(_, dom, request){

  'use strict';

  var url = 'http://pipes.yahoo.com/pipes/pipe.run';

  var blogEntries = dom.byId('blog-container');

  request.get(url, {
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
          title: entry.title,
          link: entry.link,
          snippet: entry.description.substring(0, 150) + '...'
        };
      })
      .first(3)
      .value();

    blogEntries.innerHTML = _.templates.blogs({
      entries: entries
    });
  }, function(err){
    console.log('Error in Blogs', err);
    // TODO: template an error message
    blogEntries.innerHTML = 'Error Loading Blogs - Please Refresh the Page';
  });

});
