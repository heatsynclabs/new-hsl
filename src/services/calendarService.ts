import { format, addDays, subDays, startOfDay, startOfMonth, endOfMonth } from 'date-fns'
import { config } from '../config'

export interface CalendarEvent {
  id: string
  title: string
  displayTitle: string
  description?: string
  start: Date
  end: Date
  location?: string
  isAllDay: boolean
  requiresRegistration: boolean
  registrationUrl?: string
  registrationCost?: string
}

export class CalendarService {
  private readonly GOOGLE_API_KEY = config.googleApiKey
  private readonly CALENDAR_ID = config.calendarId
  private cache = new Map<string, { data: any; expires: number }>()
  private CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  private getCached(key: string): any | null {
    const entry = this.cache.get(key)
    if (entry && Date.now() < entry.expires) return entry.data
    this.cache.delete(key)
    return null
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, expires: Date.now() + this.CACHE_TTL })
  }

  /**
   * Make a request to Google Calendar API
   */
  private async fetchFromAPI(timeMin: string, timeMax?: string, maxResults: string = '2500'): Promise<any> {

    const params = new URLSearchParams({
      key: this.GOOGLE_API_KEY,
      timeMin,
      maxResults,
      orderBy: 'startTime',
      singleEvents: 'true'
    })

    if (timeMax) {
      params.append('timeMax', timeMax)
    }

    const calendarId = encodeURIComponent(this.CALENDAR_ID)
    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${params.toString()}`

    const response = await fetch(url)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(`Google Calendar API error: ${data.error.message}`)
    }

    return data
  }

  /**
   * Fetch and parse calendar events for upcoming events
   */
  async getEvents(daysAhead: number = 30): Promise<CalendarEvent[]> {
    const cacheKey = `events-${daysAhead}`
    const cached = this.getCached(cacheKey)
    if (cached) return cached

    const now = new Date()
    const futureLimit = addDays(now, daysAhead)

    const timeMin = now.toISOString()
    const timeMax = futureLimit.toISOString()

    const data = await this.fetchFromAPI(timeMin, timeMax)

    if (!data.items) {
      this.setCache(cacheKey, [])
      return []
    }

    const allEvents = data.items.map((item: any) => this.parseGoogleCalendarEvent(item))

    // Filter out "Open Hours" and "Member hours" events from upcoming events
    const events = allEvents.filter((event: any) => {
      const title = event.title.toLowerCase()
      return !title.includes('open hours') && !title.includes('member hours')
    })

    const result = events.sort((a: CalendarEvent, b: CalendarEvent) =>
      a.start.getTime() - b.start.getTime()
    )

    this.setCache(cacheKey, result)
    return result
  }

  /**
   * Get events for a specific month (for full calendar view)
   */
  async getEventsForMonth(monthDate: Date): Promise<CalendarEvent[]> {
    const cacheKey = `month-${format(monthDate, 'yyyy-MM')}`
    const cached = this.getCached(cacheKey)
    if (cached) return cached

    // For month view, get events from a week before month start to end of month
    // This ensures we capture events from the previous month that appear in the calendar grid
    const monthStart = startOfDay(startOfMonth(monthDate))
    const fetchStart = subDays(monthStart, 7) // Fetch from 7 days before month start
    const monthEnd = endOfMonth(monthDate)

    const timeMin = fetchStart.toISOString()
    const timeMax = monthEnd.toISOString()

    const data = await this.fetchFromAPI(timeMin, timeMax)

    if (!data.items) {
      this.setCache(cacheKey, [])
      return []
    }

    const allEvents = data.items.map((item: any) => this.parseGoogleCalendarEvent(item))

    const result = allEvents.sort((a: CalendarEvent, b: CalendarEvent) =>
      a.start.getTime() - b.start.getTime()
    )

    this.setCache(cacheKey, result)
    return result
  }

  /**
   * Get all future events from today onward for the events list
   */
  async getAllFutureEvents(): Promise<CalendarEvent[]> {
    const cacheKey = 'allFuture'
    const cached = this.getCached(cacheKey)
    if (cached) return cached

    const now = new Date()
    const futureLimit = addDays(now, 365) // Next year

    const timeMin = now.toISOString()
    const timeMax = futureLimit.toISOString()

    const data = await this.fetchFromAPI(timeMin, timeMax)

    if (!data.items) {
      this.setCache(cacheKey, [])
      return []
    }

    const allEvents = data.items.map((item: any) => this.parseGoogleCalendarEvent(item))

    // Filter out "Open Hours" and "Member hours" events from the events list
    const events = allEvents.filter((event: any) => {
      const title = event.title.toLowerCase()
      return !title.includes('open hours') && !title.includes('member hours')
    })

    const result = events.sort((a: CalendarEvent, b: CalendarEvent) =>
      a.start.getTime() - b.start.getTime()
    )

    this.setCache(cacheKey, result)
    return result
  }

  /**
   * Get all events including Open Hours (for schedule component)
   */
  async getAllEvents(daysAhead: number = 30): Promise<CalendarEvent[]> {
    const cacheKey = `allEvents-${daysAhead}`
    const cached = this.getCached(cacheKey)
    if (cached) return cached

    const now = new Date()
    const futureLimit = addDays(now, daysAhead)

    const timeMin = now.toISOString()
    const timeMax = futureLimit.toISOString()

    const data = await this.fetchFromAPI(timeMin, timeMax)

    if (!data.items) {
      this.setCache(cacheKey, [])
      return []
    }

    const events = data.items.map((item: any) => this.parseGoogleCalendarEvent(item))

    const result = events.sort((a: CalendarEvent, b: CalendarEvent) =>
      a.start.getTime() - b.start.getTime()
    )

    this.setCache(cacheKey, result)
    return result
  }

  /**
   * Get recurring events using Google Calendar API's recurring event series
   */
  async getRecurringEvents(daysAhead: number = 90): Promise<CalendarEvent[]> {
    const cacheKey = `recurring-${daysAhead}`
    const cached = this.getCached(cacheKey)
    if (cached) return cached

    const now = new Date()
    const futureLimit = addDays(now, daysAhead)

    const timeMin = now.toISOString()
    const timeMax = futureLimit.toISOString()

    const data = await this.fetchFromAPI(timeMin, timeMax)

    // Filter for events that appear multiple times
    const recurringEvents = data.items ? data.items
      .map((item: any) => this.parseGoogleCalendarEvent(item))
      .filter((event: CalendarEvent) => {
        // Exclude Open Hours and Member Hours
        const title = event.title.toLowerCase()
        return !title.includes('open hours') && !title.includes('member hours')
      }) : []

    this.setCache(cacheKey, recurringEvents)
    return recurringEvents
  }

  /**
   * Parse a Google Calendar API event item into our CalendarEvent format
   */
  private parseGoogleCalendarEvent(item: any): CalendarEvent {
    const isAllDay = !item.start.dateTime

    let startDate: Date
    let endDate: Date

    if (isAllDay) {
      // All-day events use 'date' field (YYYY-MM-DD)
      // Parse as local date to avoid timezone ambiguity across browsers
      const [startYear, startMonth, startDay] = item.start.date.split('-').map(Number)
      startDate = new Date(startYear, startMonth - 1, startDay)
      if (item.end.date) {
        const [endYear, endMonth, endDay] = item.end.date.split('-').map(Number)
        endDate = new Date(endYear, endMonth - 1, endDay)
      } else {
        endDate = startDate
      }
    } else {
      // Timed events use 'dateTime' field (RFC3339 timestamp)
      startDate = new Date(item.start.dateTime)
      endDate = item.end.dateTime ? new Date(item.end.dateTime) : startDate
    }

    const title = item.summary || 'Untitled Event'
    const description = item.description || ''

    // Detect registration requirements
    const registrationRegex = /[\s\-–—·•|,]*\(?registration required\)?[\s\-–—·•|,]*/gi
    const guestlistRegex = /https?:\/\/guestli(?:\.st|st\.co)\/[^\s<>"')]+/i
    const hasRegistrationInTitle = registrationRegex.test(title)
    const guestlistMatch = description.match(guestlistRegex)
    const hasGuestlistUrl = !!guestlistMatch
    const requiresRegistration = hasRegistrationInTitle || hasGuestlistUrl

    // Extract registration URL if present
    const registrationUrl = guestlistMatch ? guestlistMatch[0] : undefined

    // Extract cost if present (e.g., $17, ($17), $17.50)
    const costRegex = /\(?(\$\d+(?:\.\d{2})?)\)?/
    const costMatch = description.match(costRegex)
    const registrationCost = costMatch ? costMatch[1] : undefined

    // Clean the title by removing "registration required" text and empty parentheses
    const displayTitle = title
      .replace(registrationRegex, ' ')
      .replace(/\(\s*\)/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    // Clean the description by removing "Registration Required" patterns, guestlist links, and cost
    const cleanDescription = description
      .replace(/Registration\s*Required:?\s*https?:\/\/guestli(?:\.st|st\.co)\/[^\s<>"')]+\s*/gi, '')
      .replace(/\(?Registration\s*Required\)?:?\s*/gi, '')
      .replace(/https?:\/\/guestli(?:\.st|st\.co)\/[^\s<>"')]+/gi, '')
      .replace(/\(?\$\d+(?:\.\d{2})?\)?:?\s*/g, '')
      .replace(/\n/g, '<br>')
      .replace(/(<br\s*\/?>)+/gi, '<br>')
      .trim()

    return {
      id: item.id,
      title,
      displayTitle: displayTitle || title,
      description: cleanDescription,
      start: startDate,
      end: endDate,
      location: item.location || '',
      isAllDay,
      requiresRegistration,
      registrationUrl,
      registrationCost
    }
  }

  /**
   * Format event for display
   */
  static formatEvent(event: CalendarEvent): {
    dateStr: string
    timeStr: string
    title: string
    description?: string
  } {
    const dateStr = format(event.start, 'MMM d, yyyy')
    const timeStr = event.isAllDay
      ? 'All Day'
      : `${format(event.start, 'h:mm a')} - ${format(event.end, 'h:mm a')}`

    return {
      dateStr,
      timeStr,
      title: event.title,
      description: event.description
    }
  }
}

// HeatSync Labs calendar service instance
export const heatSyncCalendar = new CalendarService()
