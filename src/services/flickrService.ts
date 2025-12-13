export interface FlickrPhoto {
  id: string
  title: string
  url: string
  thumbnail: string
  link: string
  farm: string
  server: string
  secret: string
}

export class FlickrService {
  private readonly FLICKR_API_URL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=bec64c9c0f28889dc6e0c5ef7be3511f&user_id=60827818%40N07&tags=publish&format=rest'

  async getPhotos(limit: number = 20): Promise<FlickrPhoto[]> {
    try {
      // Use our API endpoint to fetch the XML data
      const apiUrl = import.meta.env.VITE_FLICKR_API_URL || 'https://flickrhsl.moheeb-698.workers.dev'
      const response = await fetch(`${apiUrl}?limit=${limit}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const xmlText = data.contents

      // Parse the XML
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml')

      // Check for XML parsing errors
      const parserError = xmlDoc.querySelector('parsererror')
      if (parserError) {
        throw new Error('Failed to parse XML response')
      }

      // Get photo elements
      const photos = xmlDoc.querySelectorAll('photo')

      if (photos.length === 0) {
        return []
      }

      return Array.from(photos).slice(0, limit).map((photo): FlickrPhoto => {
        const id = photo.getAttribute('id') || ''
        const title = photo.getAttribute('title') || 'HeatSync Labs Photo'
        const farm = photo.getAttribute('farm') || ''
        const server = photo.getAttribute('server') || ''
        const secret = photo.getAttribute('secret') || ''

        // Build URLs using Flickr's URL structure
        const baseUrl = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}`

        return {
          id,
          title,
          url: `${baseUrl}_b.jpg`, // Large size
          thumbnail: `${baseUrl}_m.jpg`, // Medium size for thumbnails
          link: `https://www.flickr.com/photos/hslphotosync/${id}/in/photostream`,
          farm,
          server,
          secret
        }
      })
    } catch (error) {
      console.error('Failed to fetch Flickr photos:', error)
      return []
    }
  }
}