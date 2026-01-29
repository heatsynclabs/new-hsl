export interface FlickrPhoto {
  id: string
  title: string
  url: string
  thumbnail: string
  link: string
}

// Flickr configuration
const FLICKR_API_KEY = 'bec64c9c0f28889dc6e0c5ef7be3511f'
const FLICKR_USER_ID = '60827818@N07'

export class FlickrService {
  /**
   * Fetch photos from Flickr
   * @param limit Number of photos to fetch (up to 500)
   * @param tag Optional tag to filter by (e.g., 'publish'). If empty, gets all public photos.
   */
  async getPhotos(limit: number = 100, tag: string = ''): Promise<FlickrPhoto[]> {
    try {
      // Try the Flickr API first (supports more photos)
      return await this.fetchFromFlickrApi(limit, tag)
    } catch (error) {
      console.error('Flickr API failed, falling back to RSS feed:', error)
      // Fallback to RSS feed (max 20 photos, no tag filtering)
      return this.fetchFromRssFeed(Math.min(limit, 20))
    }
  }

  // Fetch directly from Flickr API using JSONP (no server needed!)
  private fetchFromFlickrApi(limit: number, tag: string): Promise<FlickrPhoto[]> {
    return new Promise((resolve, reject) => {
      const callbackName = `flickrApiCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`
      let completed = false
      let timeoutId: number | null = null
      let scriptElement: HTMLScriptElement | null = null

      const cleanup = () => {
        if (timeoutId) clearTimeout(timeoutId)
        if ((window as any)[callbackName]) {
          delete (window as any)[callbackName]
        }
        if (scriptElement && scriptElement.parentNode) {
          scriptElement.parentNode.removeChild(scriptElement)
        }
      }

      ;(window as any)[callbackName] = (data: any) => {
        if (completed) return
        completed = true
        cleanup()

        if (data.stat !== 'ok') {
          reject(new Error(data.message || 'Flickr API error'))
          return
        }

        const photos = (data.photos?.photo || []).map((photo: any): FlickrPhoto => ({
          id: photo.id,
          title: photo.title || 'HeatSync Labs Photo',
          url: photo.url_b || photo.url_c || photo.url_z || `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`,
          thumbnail: photo.url_m || photo.url_s || `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_m.jpg`,
          link: `https://www.flickr.com/photos/${FLICKR_USER_ID}/${photo.id}`,
        }))

        resolve(photos)
      }

      // Build the API URL
      let apiUrl = `https://api.flickr.com/services/rest/?method=flickr.photos.search`
      apiUrl += `&api_key=${FLICKR_API_KEY}`
      apiUrl += `&user_id=${encodeURIComponent(FLICKR_USER_ID)}`
      apiUrl += `&per_page=${Math.min(limit, 500)}`
      apiUrl += `&format=json`
      apiUrl += `&jsoncallback=${callbackName}`
      apiUrl += `&extras=url_b,url_c,url_z,url_m,url_s`  // Request various sizes

      // Add tag filter if specified
      if (tag) {
        apiUrl += `&tags=${encodeURIComponent(tag)}`
      }

      scriptElement = document.createElement('script')
      scriptElement.src = apiUrl

      scriptElement.onerror = () => {
        if (!completed) {
          completed = true
          cleanup()
          reject(new Error('Failed to load Flickr API'))
        }
      }

      timeoutId = window.setTimeout(() => {
        if (!completed) {
          completed = true
          cleanup()
          reject(new Error('Flickr API request timed out'))
        }
      }, 30000)

      document.head.appendChild(scriptElement)
    })
  }

  // Fallback: RSS feed (no API key needed, max 20 photos)
  private fetchFromRssFeed(limit: number): Promise<FlickrPhoto[]> {
    return new Promise((resolve, reject) => {
      const callbackName = `flickrRssCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`
      let completed = false
      let timeoutId: number | null = null
      let scriptElement: HTMLScriptElement | null = null

      const cleanup = () => {
        if (timeoutId) clearTimeout(timeoutId)
        if ((window as any)[callbackName]) {
          delete (window as any)[callbackName]
        }
        if (scriptElement && scriptElement.parentNode) {
          scriptElement.parentNode.removeChild(scriptElement)
        }
      }

      ;(window as any)[callbackName] = (data: any) => {
        if (completed) return
        completed = true
        cleanup()

        if (!data.items || !Array.isArray(data.items)) {
          resolve([])
          return
        }

        const photos = data.items.slice(0, limit).map((item: any): FlickrPhoto => {
          const title = item.title || 'HeatSync Labs Photo'
          const link = item.link || ''
          const idMatch = link.match(/\/photos\/[^/]+\/(\d+)/)
          const id = idMatch ? idMatch[1] : ''
          const thumbnailUrl = item.media?.m || ''
          const url = thumbnailUrl.replace('_m.jpg', '_b.jpg')

          return { id, title, url, thumbnail: thumbnailUrl, link }
        })

        resolve(photos)
      }

      scriptElement = document.createElement('script')
      scriptElement.src = `https://www.flickr.com/services/feeds/photos_public.gne?id=${encodeURIComponent(FLICKR_USER_ID)}&format=json&jsoncallback=${callbackName}`

      scriptElement.onerror = () => {
        if (!completed) {
          completed = true
          cleanup()
          reject(new Error('Failed to load Flickr RSS'))
        }
      }

      timeoutId = window.setTimeout(() => {
        if (!completed) {
          completed = true
          cleanup()
          reject(new Error('Flickr RSS request timed out'))
        }
      }, 30000)

      document.head.appendChild(scriptElement)
    })
  }
}
