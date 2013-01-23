define([
  './replaceTags',
  'lodash',
  'dojo/dom',
  'dojo/Deferred',
  './lodash.templates',
  'goog!feeds,1'
], function(replaceTags, _, dom, Deferred){

  'use strict';

  var defer = new Deferred();

  var feed = new google.feeds.Feed('https://groups.google.com/group/heatsynclabs/feed/rss_v2_0_topics.xml');
  feed.setNumEntries(3);
  feed.load(function(result) {
    if (!result.error) {
      console.log('Mailing List Entries: ', result.feed.entries);
      dom.byId('discussion-container').innerHTML = _.templates.discussion(result.feed);
      defer.resolve(result.feed);
    }
  });

  return defer;

});
