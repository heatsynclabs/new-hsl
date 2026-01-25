export interface FlickrPhoto {
  id: string
  title: string
  url: string
  thumbnail: string
  link: string
}

// Flickr RSS feed configuration (no API key needed)
const FLICKR_USER_ID = '60827818@N07'

export class FlickrService {
  async getPhotos(limit: number = 20): Promise<FlickrPhoto[]> {
    try {
      // Use RSS feed which doesn't require an API key
      const data = await this.fetchWithJsonp(limit)

      if (!data.items || !Array.isArray(data.items)) {
        return []
      }

      return data.items.slice(0, limit).map((item: any): FlickrPhoto => {
        const title = item.title || 'HeatSync Labs Photo'
        const link = item.link || ''
        // Extract the photo ID from the link
        const idMatch = link.match(/\/photos\/[^/]+\/(\d+)/)
        const id = idMatch ? idMatch[1] : ''

        // Get the image URL from media.m and upgrade to larger size
        const thumbnailUrl = item.media?.m || ''
        const url = thumbnailUrl.replace('_m.jpg', '_b.jpg')

        return {
          id,
          title,
          url,
          thumbnail: thumbnailUrl,
          link
        }
      })
    } catch (error) {
      console.error('Failed to fetch Flickr photos:', error)
      return []
    }
  }

  private fetchWithJsonp(limit: number): Promise<any> {
    return new Promise((resolve, reject) => {
      // Generate unique callback name
      const callbackName = `flickrCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`
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

      // Set up the callback function
      ;(window as any)[callbackName] = (data: any) => {
        if (!completed) {
          completed = true
          cleanup()
          resolve(data)
        }
      }

      // Create script element
      scriptElement = document.createElement('script')
      scriptElement.src = `https://www.flickr.com/services/feeds/photos_public.gne?id=${encodeURIComponent(FLICKR_USER_ID)}&format=json&jsoncallback=${callbackName}&per_page=${limit}`

      scriptElement.onerror = () => {
        // Only reject if the callback hasn't already succeeded
        if (!completed) {
          completed = true
          cleanup()
          reject(new Error('Failed to load Flickr API'))
        }
      }

      // Add timeout (30 seconds to account for slow Flickr API)
      timeoutId = window.setTimeout(() => {
        if (!completed) {
          completed = true
          cleanup()
          reject(new Error('Flickr API request timed out'))
        }
      }, 30000)

      // Execute the request
      document.head.appendChild(scriptElement)
    })
  }
}
