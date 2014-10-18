define([
  './calendar',
  './flickr',
  './door_status',
  './blogs',
  './mailing_list',
  'dojo/promise/all',
  'dojo/on',
  'dojo/query',
  'require',
  'dojo/NodeList-manipulate',
  'dojo/domReady!'
], function(calendar, flickr, door_status, blogs, mailing_list, all, on, query, require){

  'use strict';

  all({
    calendar: calendar,
    flickr: flickr,
    door_status: door_status,
    blogs: blogs,
    mailing_list: mailing_list
  }).then(function(results){
    // Debugging
    console.log('calendar', results.calendar);
    console.log('flickr', results.flickr);
    console.log('door_status', results.door_status);
    console.log('blogs', results.blogs);
    console.log('mailing_list', results.mailing_list);

    // Wait until everything else is done before loading cams
    require(['hsl/cams']);
  });

  on(document, '.calendar-link:click', function(e){
    e.preventDefault();
    query('#calendar-popup').removeClass('hide');
  });

  on(document, '.close:click', function(){
    query('.modal').addClass('hide');
  });

});
