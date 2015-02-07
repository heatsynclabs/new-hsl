define([
  './replaceTags',
  'lodash',
  'dojo/dom',
  'dojo/date',
  'dojo/date/locale',
  'dojo/request/script',
  './lodash.templates',
  'dojo/domReady!'
], function(replaceTags, _, dom, date, locale, request){

  'use strict';

  var url = 'http://www.google.com/calendar/feeds/heatsynclabs.org_p9rcn09d64q56m7rg07jptmrqc@group.calendar.google.com/public/basic';

  var calendarEntries = dom.byId('calendar-entries');

  return request.get(url, {
    jsonp: 'callback',
    query: {
      alt: 'json',
      orderby: 'starttime',
      'max-results': 10,
      singleevents: true,
      sortorder: 'ascending',
      futureevents: true
    }
  }).then(function(data){
    var entries = _(data.feed.entry)
      .map(function(entry){
        var eventDate = new Date(entry.gd$when[0].startTime);

        return {
          content: replaceTags(entry.content.$t),
          timestamp: eventDate,
          date: locale.format(eventDate, {
            selector: 'date',
            datePattern: 'EEE, MMM d'
          }),
          time: locale.format(eventDate, {
            selector: 'time',
            timePattern: 'K:mm a'
          }),
          link: _.find(entry.link, { type: 'text/html' }).href,
          title: replaceTags(entry.title.$t)
        };
      })
      .filter(function(entry, idx, entries){
        var sevenDays = date.add(_.first(entries).timestamp, 'day', 6); // Inclusive
        return date.compare(entry.timestamp, sevenDays) < 0;
      })
      .value();

    if(calendarEntries){
      calendarEntries.innerHTML = _.templates.calendar({
        dates: _.pluck(entries, 'date'),
        entries: entries
      });
    }

    return entries;
  }, function(err){
    console.log('Error in Calendar', err);
    // TODO: template an error message
    calendarEntries.innerHTML = 'Error Loading Calendar - Please Refresh the Page';
  });

});
