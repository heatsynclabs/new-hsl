const flickr = require('./flickr');
const doors = require('./doors');

document.addEventListener('DOMContentLoaded', () => {
  Promise.all([doors(), flickr()])
    .then(console.log)
    .catch(console.error);

  // Check that service workers are registered
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/dist/sw.js');
  }
});
