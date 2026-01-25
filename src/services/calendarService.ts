import { format, isAfter, isBefore, addDays, subDays, startOfDay, startOfMonth, endOfMonth } from 'date-fns'
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
    console.log('Fetching from Google Calendar API:', url.replace(this.GOOGLE_API_KEY, 'HIDDEN_KEY'))

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
    try {
      const now = new Date()
      const futureLimit = addDays(now, daysAhead)

      const timeMin = now.toISOString()
      const timeMax = futureLimit.toISOString()

      console.log('Fetching upcoming events from API')

      const data = await this.fetchFromAPI(timeMin, timeMax)
      console.log('API Response:', data)

      if (!data.items) {
        console.log('No events found in response')
        return []
      }

      const allEvents = data.items.map((item: any) => this.parseGoogleCalendarEvent(item))

      // Filter out "Open Hours" and "Member hours" events from upcoming events
      const events = allEvents.filter((event: any) => {
        const title = event.title.toLowerCase()
        return !title.includes('open hours') && !title.includes('member hours')
      })

      console.log(`Found ${events.length} upcoming events (${allEvents.length} total, filtered out open/member hours)`)

      return events.sort((a: CalendarEvent, b: CalendarEvent) =>
        a.start.getTime() - b.start.getTime()
      )
    } catch (error) {
      console.error('Error fetching upcoming calendar events:', error)
      return []
    }
  }

  /**
   * Get events for a specific month (for full calendar view)
   */
  async getEventsForMonth(monthDate: Date): Promise<CalendarEvent[]> {
    try {
      // For month view, get events from a week before month start to end of month
      // This ensures we capture events from the previous month that appear in the calendar grid
      const monthStart = startOfDay(startOfMonth(monthDate))
      const fetchStart = subDays(monthStart, 7) // Fetch from 7 days before month start
      const monthEnd = endOfMonth(monthDate)

      const timeMin = fetchStart.toISOString()
      const timeMax = monthEnd.toISOString()

      console.log('Fetching month events from API:', format(monthDate, 'MMMM yyyy'), `(from ${format(fetchStart, 'MMM d')} to ${format(monthEnd, 'MMM d')})`)

      const data = await this.fetchFromAPI(timeMin, timeMax)
      console.log(`API Response for ${format(monthDate, 'MMMM yyyy')}:`, data)

      if (!data.items) {
        console.log('No events found in response')
        return []
      }

      const allEvents = data.items.map((item: any) => this.parseGoogleCalendarEvent(item))

      // Filter for future events only (haven't ended yet)
      const now = new Date()
      const futureEvents = allEvents.filter((event: CalendarEvent) => {
        const isFuture = isAfter(event.end, now)
        if (isFuture) {
          console.log(`Future event: "${event.title}" on ${format(event.start, 'yyyy-MM-dd')}`)
        }
        return isFuture
      })

      console.log(`Found ${futureEvents.length} future events for ${format(monthDate, 'MMMM yyyy')} out of ${allEvents.length} total events`)

      return futureEvents.sort((a: CalendarEvent, b: CalendarEvent) =>
        a.start.getTime() - b.start.getTime()
      )
    } catch (error) {
      console.error('Error fetching monthly calendar events:', error)
      return []
    }
  }

  /**
   * Get all future events from today onward for the events list
   */
  async getAllFutureEvents(): Promise<CalendarEvent[]> {
    try {
      const now = new Date()
      const futureLimit = addDays(now, 365) // Next year

      const timeMin = now.toISOString()
      const timeMax = futureLimit.toISOString()

      console.log('Fetching all future events from API')

      const data = await this.fetchFromAPI(timeMin, timeMax)

      if (!data.items) {
        console.log('No future events found')
        return []
      }

      const allEvents = data.items.map((item: any) => this.parseGoogleCalendarEvent(item))

      // Filter out "Open Hours" and "Member hours" events from the events list
      const events = allEvents.filter((event: any) => {
        const title = event.title.toLowerCase()
        return !title.includes('open hours') && !title.includes('member hours')
      })

      console.log(`Found ${events.length} future events (${allEvents.length} total, filtered out open/member hours)`)

      return events.sort((a: CalendarEvent, b: CalendarEvent) =>
        a.start.getTime() - b.start.getTime()
      )
    } catch (error) {
      console.error('Error fetching all future events:', error)
      return []
    }
  }

  /**
   * Get all events including Open Hours (for schedule component)
   */
  async getAllEvents(daysAhead: number = 30): Promise<CalendarEvent[]> {
    try {
      const now = new Date()
      const futureLimit = addDays(now, daysAhead)

      const timeMin = now.toISOString()
      const timeMax = futureLimit.toISOString()

      console.log('Fetching all events including Open Hours from API')

      const data = await this.fetchFromAPI(timeMin, timeMax)

      if (!data.items) {
        console.log('No events found in response')
        return []
      }

      const events = data.items.map((item: any) => this.parseGoogleCalendarEvent(item))
      console.log(`Found ${events.length} total events (including open hours)`)

      return events.sort((a: CalendarEvent, b: CalendarEvent) =>
        a.start.getTime() - b.start.getTime()
      )
    } catch (error) {
      console.error('Error fetching all events:', error)
      return []
    }
  }

  /**
   * Get recurring events using Google Calendar API's recurring event series
   */
  async getRecurringEvents(daysAhead: number = 90): Promise<CalendarEvent[]> {
    try {
      const now = new Date()
      const futureLimit = addDays(now, daysAhead)

      const timeMin = now.toISOString()
      const timeMax = futureLimit.toISOString()

      console.log('Fetching recurring events from API')

      const data = await this.fetchFromAPI(timeMin, timeMax)

      // Filter for events that appear multiple times
      const recurringEvents = data.items ? data.items
        .map((item: any) => this.parseGoogleCalendarEvent(item))
        .filter((event: CalendarEvent) => {
          // Exclude Open Hours and Member Hours
          const title = event.title.toLowerCase()
          return !title.includes('open hours') && !title.includes('member hours')
        }) : []

      console.log(`Found ${recurringEvents.length} events for recurring analysis`)
      return recurringEvents

    } catch (error) {
      console.error('Error fetching recurring events:', error)
      // Fallback to regular getAllEvents
      return this.getAllEvents(daysAhead)
    }
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
      startDate = new Date(item.start.date + 'T00:00:00')
      endDate = item.end.date ? new Date(item.end.date + 'T00:00:00') : startDate
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
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
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
