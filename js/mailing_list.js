console.log("Mailing list.js is loading...");

google.load("feeds", "1");

var list_topics = [];

function initialize() {
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
}
google.setOnLoadCallback(initialize);
