window.flickr = () => {
  if (window.HSL && window.HSL.flickr) {
    const photos = (window.HSL.flickr.photos.photo || []).map((photo) => {
      return {
        image_url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`,
        title: photo.title,
        link: `https://www.flickr.com/photos/hslphotosync/${photo.id}/in/photostream`,
        description: '',
      };
    });

    const flickrImage = document.getElementById('main_image');
    if (flickrImage) {
      const randIndex = Math.floor(Math.random() * photos.length);
      const p = photos[randIndex];

      flickrImage.innerHTML = `
        <a href="${p.link}" target="_blank" rel="noreferrer"><img src="${p.image_url}" alt="flickr feed"></a>
        <a href="${p.link}" target="_blank" class="caption" id="main_image_caption" rel="noreferrer">${p.title}<i class="icon-chevron-right"></i></a>
      `;
    }
    return photos;
  }
  return null;
};
