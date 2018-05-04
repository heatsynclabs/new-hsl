const _ = require('lodash');
const jsonp = require('rest/interceptor/jsonp');

const client = jsonp({ callback: { param: 'jsoncallback' } });

module.exports = () => {
  return client({
    path: 'https://api.flickr.com/services/rest/?tags=publish&format=json&method=flickr.photos.search&api_key=bec64c9c0f28889dc6e0c5ef7be3511f&user_id=60827818@N07&per_page=20',
  }).then((response) => {
    console.log('response', response);
    const data = response.entity;
    const photos = _.map(data.photos.photo, (photo) => {
      return {
        image_url: `http://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`,
        title: photo.title,
        link: `http://www.flickr.com/photos/hslphotosync/${photo.id}/in/photostream`,
        description: '',
      };
    });

    const flickrImage = document.getElementById('main_image');
    if (flickrImage) {
      const p = _.sample(photos.slice(0, 15));

      flickrImage.innerHTML = `
        <a href="${p.link}" target="_blank"><img src="${p.image_url}"</a>
        <a href="${p.link}" target="_blank" class="caption" id="main_image_caption">${p.title}<i class="icon-chevron-right"></i></a>
      `;
    }

    console.log('photos');
    return photos;
  });
};
