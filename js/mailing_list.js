define([
  'lodash',
  'dojo/dom',
  './lodash.template',
  'goog!feeds,1'
], function(_, dom){

  'use strict';

  var feed = new google.feeds.Feed('https://groups.google.com/group/heatsynclabs/feed/rss_v2_0_topics.xml');
  feed.setNumEntries(3);
  feed.load(function(result) {
    if (!result.error) {
      console.log('Mailing List Entries: ', result.feed.entries);
      dom.byId('discussion-container').innerHTML = _.templates.discussion(result.feed);
    }
  });

});
