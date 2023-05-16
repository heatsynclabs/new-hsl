import { useEffect, useState } from "react";

export default function MainImage() {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchPhotos() {
      const params = {
        nojsoncallback: 1,
        tags: "publish",
        format: "json",
        method: "flickr.photos.search",
        api_key: "bec64c9c0f28889dc6e0c5ef7be3511f",
        user_id: "60827818@N07",
        per_page: 20,
      };
      try {
        const url =
          "https://api.flickr.com/services/rest/?" +
          new URLSearchParams(params);
        const flickrResponse = await fetch(url);
        const flickrData = await flickrResponse.json();
        if (flickrData.stat === "ok" && flickrData?.photos?.photo?.length) {
          const photos = (flickrData?.photos?.photo || []).map((photo) => {
            return {
              image_url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`,
              title: photo.title,
              link: `https://www.flickr.com/photos/hslphotosync/${photo.id}/in/photostream`,
              description: "",
            };
          });
          setPhotos(photos);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    }
    fetchPhotos();
  }, []);

  const Photo = () => {
    const randIndex = Math.floor(Math.random() * photos.length);
    const photo = photos[randIndex];
    return (
      <>
        <a href={photo?.link} target="_blank" rel="nonreferrer">
          <img src={photo?.image_url ?? ""} alt="flickr feed" />
        </a>
        <a
          href={photo?.link}
          target="_blank"
          className="caption"
          id="main_image_caption"
          rel="nonreferrer"
        >
          {photo?.title} <i className="icon-chevron-right"></i>{" "}
        </a>
      </>
    );
  };

  return (
    <div id="main_image">
      {isLoading && !photos.length ? (
        <div className="spinner">
          <i className="icon-spinner icon-spin icon-3x"></i>
        </div>
      ) : (
        <Photo />
      )}
    </div>
  );
}
