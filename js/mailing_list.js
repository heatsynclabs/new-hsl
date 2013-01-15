define([
  'goog!feeds,1'
], function(){

  'use strict';

  console.log("Mailing list.js is loading...");

  var list_topics = [];

  var feed = new google.feeds.Feed("https://groups.google.com/group/heatsynclabs/feed/rss_v2_0_topics.xml");
  feed.setNumEntries(10);
  feed.load(function(result) {
    if (!result.error) {
      console.log(result.feed.entries);
      for (var i = 0; i < result.feed.entries.length; i++) {
        list_topics[i] = result.feed.entries[i];
      }
    }
  });

  return list_topics;

});